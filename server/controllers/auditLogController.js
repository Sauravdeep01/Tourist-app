const AuditLog = require('../models/AuditLog');

// Paginated, searchable audit trail — Admin only, read-only, append-only 
const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    const filter = {};
    if (req.query.action) filter.action = new RegExp(req.query.action, 'i');
    if (req.query.role) filter.role = req.query.role;
    if (req.query.actorId) filter.actorId = req.query.actorId;
    if (req.query.targetType) filter.targetType = req.query.targetType;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('actorId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      logs,
      total,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (error) {
    console.error('getAuditLogs error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = { getAuditLogs };
