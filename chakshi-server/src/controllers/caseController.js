import Case from '../models/Case.js';

// ➕ Create Case
export const createCase = async (req, res) => {
  try {
    const newCase = await Case.create(req.body);
    res.status(201).json({
      success: true,
      message: "Case created successfully",
      data: newCase,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "E11000 duplicate key error",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update Case
export const updateCase = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, message: 'Case updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📖 Get All Cases
export const getCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdDate: -1 });
    res.json({ success: true, data: cases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Get Single Case
export const getCaseById = async (req, res) => {
  try {
    const found = await Case.findById(req.params.id);
    if (!found)
      return res.status(404).json({ success: false, message: 'Case not found' });
    res.json({ success: true, data: found });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
