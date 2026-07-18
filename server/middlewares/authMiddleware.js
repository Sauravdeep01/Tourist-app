const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and attach user to request
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user and make sure they are active
    const user = await User.findById(id).select('_id email role active');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!user.active) {
      return res.status(401).json({ error: 'Account has been deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Request is not authorized' });
  }
};

// Middleware to check minimum role required
// admin > owner > user
const requireRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const roles = ['user', 'owner', 'admin'];
    const userRoleIndex = roles.indexOf(req.user.role);
    const minRoleIndex = roles.indexOf(minRole);

    if (userRoleIndex === -1 || minRoleIndex === -1 || userRoleIndex < minRoleIndex) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
