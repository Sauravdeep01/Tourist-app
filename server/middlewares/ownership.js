// Ownership enforcement for the multi-tenant data model.
// Kept separate from role checks (authMiddleware.js) — role says WHAT an
// Owner may do in general, ownership says WHETHER they may do it to THIS row.

// For :id routes: loads the target document and compares its ownerId with
// req.user.id. Mismatch -> 403. Admins bypass this check (unscoped access).
const requireOwnership = (Model, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'admin') {
        return next();
      }

      const doc = await Model.findById(req.params[idParam]);
      if (!doc) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      if (!doc.ownerId || String(doc.ownerId) !== String(req.user.id)) {
        return res.status(403).json({ error: 'Forbidden: you do not own this resource' });
      }

      req.resource = doc;
      next();
    } catch (error) {
      console.error('requireOwnership error:', error.message);
      res.status(500).json({ error: 'Server error occurred' });
    }
  };
};

// For list routes: injects { ownerId: req.user.id } into req.ownerFilter for
// Owners; leaves it empty ({}) for Admins (unscoped).
const scopeToOwner = (req, res, next) => {
  req.ownerFilter = req.user.role === 'admin' ? {} : { ownerId: req.user.id };
  next();
};

module.exports = { requireOwnership, scopeToOwner };
