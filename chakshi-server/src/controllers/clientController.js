// controllers/clientController.js
const Client = require("../models/Client");

// Create new client
exports.createClient = async (req, res) => {
  try {
    // ✅ No need to manually add fields now - they have defaults in schema
    const client = await Client.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Client created successfully", 
      client 
    });
  } catch (error) {
    console.error("❌ Error creating client:", error.message);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    console.error("❌ Error fetching clients:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get one client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: "Client not found" 
      });
    }
    
    res.json({ success: true, client });
  } catch (error) {
    console.error("❌ Error fetching client:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // ✅ Added runValidators
    );
    
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: "Client not found" 
      });
    }
    
    res.json({ success: true, message: "Client updated", client });
  } catch (error) {
    console.error("❌ Error updating client:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: "Client not found" 
      });
    }
    
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting client:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
