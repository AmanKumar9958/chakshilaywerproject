import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js'; // ✅ Already correct

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['advocate', 'student', 'clerk']).withMessage('Invalid role selected')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// ============================================
// PUBLIC ROUTES (No authentication needed)
// ============================================
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================
router.get('/me', authenticate, getMe); // ⭐ CHANGED: protect → authenticate
router.put('/profile', authenticate, updateProfile); // ⭐ CHANGED: protect → authenticate
router.put('/change-password', authenticate, changePasswordValidation, changePassword); // ⭐ CHANGED: protect → authenticate
router.post('/logout', authenticate, logout); // ⭐ CHANGED: protect → authenticate

export default router;
