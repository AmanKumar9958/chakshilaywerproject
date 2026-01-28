import User from '../models/User.js';

// Create
export const createUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, role });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// Read all (with basic pagination)
export const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments()
    ]);

    res.json({
      items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};

// Read one
export const getUserById = async (req, res, next) => {
  try {
    const item = await User.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'User not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// Update
export const updateUser = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    const item = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, role } },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'User not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteUser = async (req, res, next) => {
  try {
    const item = await User.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'User not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
