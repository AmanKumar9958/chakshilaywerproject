const Client = require("../models/Client");

// Create new client
exports.createClient = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      totalCases: 0,
      activeCases: 0,
      closedCases: 0,
      billedAmount: 0,
      successRate: 0,
      lastInteraction: new Date()
    };

    const client = await Client.create(payload);
    res.status(201).json({ success: true, message: "Client created successfully", client });
  } catch (error) {
    console.error("❌ Error creating client:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get one client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Client updated", client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
