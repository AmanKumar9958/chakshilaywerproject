import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ============================================
// 🔐 AUTHENTICATION MIDDLEWARE
// ============================================
// Purpose: Verify JWT token and attach user to request
// Use: Protect routes that require login

export const authenticate = async (req, res, next) => {
  try {
    console.log('🔐 Authentication middleware started');
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.',
        action: {
          type: 'login',
          url: '/login'
        }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 Token found:', token.substring(0, 20) + '...');

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified for user:', decoded.id);
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please login again.',
          action: {
            type: 'login',
            url: '/login'
          }
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.',
          action: {
            type: 'login',
            url: '/login'
          }
        });
      }
      
      throw jwtError;
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found. Please register.',
        action: {
          type: 'register',
          url: '/register'
        }
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated:', user.email);
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Attach user to request object
    req.user = user;
    
    console.log('✅ Authentication successful for:', user.email);
    console.log('   User ID:', user._id);
    console.log('   Role:', user.role);
    console.log('   Subscription Status:', user.subscription?.status || 'none');
    
    next();

  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.'
    });
  }
};

// ============================================
// 🔐 OPTIONAL: ROLE-BASED ACCESS CONTROL
// ============================================
// Purpose: Check if user has specific role
// Use: Protect routes for specific user types

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('🔒 Authorization check for roles:', roles);
    console.log('   User role:', req.user.role);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log('❌ Authorization failed - User role not allowed');
      return res.status(403).json({
        success: false,
        message: `Access denied. This feature requires ${roles.join(' or ')} role.`,
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    console.log('✅ Authorization successful');
    next();
  };
};
