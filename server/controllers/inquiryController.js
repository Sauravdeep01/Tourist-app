const Inquiry = require('../models/Inquiry');
const Tour = require('../models/Tour');
const User = require('../models/User');
const { sendInquiryEmail } = require('../utils/email');

// Submit quote / booking inquiry (registered users only)
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, phoneCountryCode, wechatId, tourId, groupSize, travelDate, message } = req.body;

    // Determine tour title snapshot and the receiving Owner
    let tourTitle = 'General Inquiry';
    let confirmedTourId = null;
    let ownerId = null;

    if (tourId) {
      const tour = await Tour.findById(tourId);
      if (tour) {
        // Use English title as the primary snapshot, fallback to Chinese
        tourTitle = tour.title?.en || tour.title?.zh || 'Selected Tour';
        confirmedTourId = tour._id;
        ownerId = tour.ownerId;
      }
    }

    // General inquiries (no tour selected) have no natural Owner — route them
    // to the longest-standing active Owner so nothing is lost .
    if (!ownerId) {
      const fallbackOwner = await User.findOne({ role: 'owner', active: true }).sort({ createdAt: 1 });
      if (!fallbackOwner) {
        return res.status(500).json({ error: 'No operator account is configured to receive inquiries' });
      }
      ownerId = fallbackOwner._id;
    }

    // Create inquiry
    const inquiryData = {
      name,
      email: email || '',
      phone: phone || '',
      phoneCountryCode: phoneCountryCode || (phone ? '+86' : ''),
      wechatId: wechatId || '',
      country: req.body.country || 'China',
      tour: confirmedTourId,
      ownerId,
      user: req.user.id,
      tourTitle,
      groupSize: groupSize || 1,
      travelDate: travelDate || '',
      message: message || '',
      status: 'new',
    };

    const newInquiry = await Inquiry.create(inquiryData);


    try {
      sendInquiryEmail(newInquiry).catch(err => {
        console.error('SMTP Email Notification skipped:', err.message);
      });
    } catch (emailErr) {
      console.error('SMTP Setup skipped:', emailErr.message);
    }

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      id: newInquiry._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View current user's inquiry history (User only)
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dashboard inquiry list — Owner sees only their own (via req.ownerFilter)
//Admin sees all. Supports ?status=&search=&from=&to= filters.
const getInquiries = async (req, res) => {
  try {
    const filter = { ...(req.ownerFilter || {}) };

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: searchRegex }, { tourTitle: searchRegex }, { email: searchRegex }];
    }
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const inquiries = await Inquiry.find(filter)
      .populate('tour', 'slug title')
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update status or add private operator notes to an inquiry (requireOwnership
// already confirmed the Owner owns this inquiry, or that the caller is Admin)
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (status) inquiry.status = status;
    if (adminNote !== undefined) inquiry.adminNote = adminNote;

    await inquiry.save();

    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reassign an inquiry to a different Owner (Admin only)
const assignInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ errors: [{ field: 'ownerId', message: 'ownerId is required' }] });
    }

    const owner = await User.findOne({ _id: ownerId, role: 'owner' });
    if (!owner) {
      return res.status(400).json({ errors: [{ field: 'ownerId', message: 'No Owner found with this id' }] });
    }

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const previousOwnerId = inquiry.ownerId;
    inquiry.ownerId = owner._id;
    inquiry.assignedOwnerHistory.push({
      from: previousOwnerId,
      to: owner._id,
      changedBy: req.user.id,
      changedAt: new Date(),
    });

    await inquiry.save();
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove an inquiry (requireOwnership already confirmed ownership/Admin)
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInquiry = await Inquiry.findByIdAndDelete(id);
    if (!deletedInquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiry,
  assignInquiry,
  deleteInquiry,
};
