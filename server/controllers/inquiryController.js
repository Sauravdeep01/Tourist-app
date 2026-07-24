const Inquiry = require('../models/Inquiry');
const Tour = require('../models/Tour');
const { sendInquiryEmail } = require('../utils/email');

// Submit quote / booking inquiry (Public)
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, phoneCountryCode, wechatId, tourId, groupSize, travelDate, message } = req.body;

    // Determine tour title snapshot
    let tourTitle = 'General Inquiry';
    let confirmedTourId = null;

    if (tourId) {
      const tour = await Tour.findById(tourId);
      if (tour) {
        // Use English title as the primary snapshot, fallback to Chinese
        tourTitle = tour.title?.en || tour.title?.zh || 'Selected Tour';
        confirmedTourId = tour._id;
      }
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

// List all inquiries with optional status filter (Owner or Admin)
const getInquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const inquiries = await Inquiry.find(filter)
      .populate('tour', 'slug title')
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update status or add private operator notes to an inquiry (Owner or Admin)
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

// Remove an inquiry (Owner or Admin)
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
  deleteInquiry,
};
