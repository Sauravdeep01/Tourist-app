const Feedback = require('../models/Feedback');

// Submit website feedback — one entry per user (User only)
const createFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existing = await Feedback.findOne({ user: req.user.id });
    if (existing) {
      return res.status(409).json({ error: 'You have already submitted feedback — edit your existing feedback instead.' });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      rating: Number(rating),
      comment: comment.trim(),
    });

    res.status(201).json(feedback);
  } catch (error) {
    // Race condition fallback: two concurrent submissions from the same user
    if (error.code === 11000) {
      return res.status(409).json({ error: 'You have already submitted feedback — edit your existing feedback instead.' });
    }
    console.error('createFeedback error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Public paginated feed of visible feedback, newest first (Public)
const getPublicFeedback = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = { hidden: false };

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Feedback.countDocuments(filter),
    ]);

    res.status(200).json({
      feedbacks,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('getPublicFeedback error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Aggregate rating summary (average, total, star distribution) for visible feedback (Public)
const getFeedbackStats = async (req, res) => {
  try {
    const [stats] = await Feedback.aggregate([
      { $match: { hidden: false } },
      {
        $facet: {
          summary: [{ $group: { _id: null, average: { $avg: '$rating' }, total: { $sum: 1 } } }],
          distribution: [{ $group: { _id: '$rating', count: { $sum: 1 } } }],
        },
      },
    ]);

    const average = stats.summary[0]?.average || 0;
    const total = stats.summary[0]?.total || 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats.distribution.forEach((bucket) => {
      distribution[bucket._id] = bucket.count;
    });

    res.status(200).json({
      average: Math.round(average * 10) / 10,
      total,
      distribution,
    });
  } catch (error) {
    console.error('getFeedbackStats error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// View own feedback entry (User only)
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ user: req.user.id });
    if (!feedback) {
      return res.status(404).json({ error: 'No feedback submitted yet' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('getMyFeedback error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Edit own feedback entry — rating and/or comment (User only)
const updateMyFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const feedback = await Feedback.findOne({ user: req.user.id });
    if (!feedback) {
      return res.status(404).json({ error: 'No feedback submitted yet' });
    }

    if (rating !== undefined) feedback.rating = Number(rating);
    if (comment !== undefined) feedback.comment = comment.trim();

    await feedback.save();

    res.status(200).json(feedback);
  } catch (error) {
    console.error('updateMyFeedback error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Remove own feedback entry (User only)
const deleteMyFeedback = async (req, res) => {
  try {
    const deleted = await Feedback.findOneAndDelete({ user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'No feedback submitted yet' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('deleteMyFeedback error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// List all feedback, including hidden, with optional ?hidden=true/false filter (Owner or Admin)
const getAllFeedbackAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.hidden === 'true') filter.hidden = true;
    if (req.query.hidden === 'false') filter.hidden = false;

    const feedbacks = await Feedback.find(filter)
      .populate('user', 'name email')
      .populate('reply.repliedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('getAllFeedbackAdmin error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Add or overwrite the owner's reply to a feedback entry (Owner or Admin)
const replyToFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    feedback.reply = {
      text: text.trim(),
      repliedBy: req.user.id,
      repliedAt: new Date(),
    };

    await feedback.save();

    res.status(200).json(feedback);
  } catch (error) {
    console.error('replyToFeedback error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Remove the owner's reply from a feedback entry (Owner or Admin)
const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    feedback.reply = undefined;
    await feedback.save();

    res.status(200).json(feedback);
  } catch (error) {
    console.error('deleteReply error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Hide or show a feedback entry on the public feed (Owner or Admin)
const setVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;

    if (typeof hidden !== 'boolean') {
      return res.status(400).json({ error: '"hidden" must be true or false' });
    }

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    feedback.hidden = hidden;
    await feedback.save();

    res.status(200).json(feedback);
  } catch (error) {
    console.error('setVisibility error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Permanently remove a feedback entry, e.g. abusive content (Owner or Admin)
const deleteFeedbackAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('deleteFeedbackAdmin error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = {
  createFeedback,
  getPublicFeedback,
  getFeedbackStats,
  getMyFeedback,
  updateMyFeedback,
  deleteMyFeedback,
  getAllFeedbackAdmin,
  replyToFeedback,
  deleteReply,
  setVisibility,
  deleteFeedbackAdmin,
};
