const AuditLog = require('../models/AuditLog');

// Best-effort extraction of the affected document's id from either the
// route params (edit/delete routes) or the JSON response body (create routes).
const extractTargetId = (req, body) => {
  if (req.params && req.params.id) return req.params.id;
  if (body && body._id) return body._id;
  if (body && body.id) return body.id;
  return null;
};

// After a successful (2xx) Owner/Admin mutation, records who did what to
// which resource. Never logs secrets — only field names
// that were touched, never their values.
const auditLog = (action, targetType) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        AuditLog.create({
          actorId: req.user.id,
          role: req.user.role,
          action,
          targetType,
          targetId: extractTargetId(req, body),
          meta: { fields: req.body && typeof req.body === 'object' ? Object.keys(req.body) : [] },
          ip: req.ip,
          userAgent: req.headers['user-agent'] || '',
        }).catch((err) => {
          console.error('auditLog write failed:', err.message);
        });
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = { auditLog };
