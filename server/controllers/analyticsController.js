const Tour = require('../models/Tour');
const Gallery = require('../models/Gallery');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const Destination = require('../models/Destination');


const getRecentActivity = async (filter) => {
  const [tours, images, inquiries] = await Promise.all([
    Tour.find(filter).select('title updatedAt').sort({ updatedAt: -1 }).limit(5).lean(),
    Gallery.find(filter).select('imageTitle createdAt').sort({ createdAt: -1 }).limit(5).lean(),
    Inquiry.find(filter).select('name tourTitle createdAt').sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const activity = [
    ...tours.map((t) => ({ type: 'tour', label: t.title?.en || t.title?.zh || 'Untitled tour', at: t.updatedAt })),
    ...images.map((g) => ({ type: 'gallery', label: g.imageTitle, at: g.createdAt })),
    ...inquiries.map((i) => ({ type: 'inquiry', label: `${i.name} — ${i.tourTitle}`, at: i.createdAt })),
  ];

  activity.sort((a, b) => new Date(b.at) - new Date(a.at));
  return activity.slice(0, 10);
};

// Inquiries per month for the last 12 months — Admin "Monthly Inquiry Statistics" chart
const getMonthlyInquiryStats = async (filter) => {
  const start = new Date();
  start.setMonth(start.getMonth() - 11);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const stats = await Inquiry.aggregate([
    { $match: { ...filter, createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return stats.map((s) => ({ month: s._id, count: s.count }));
};

// Destinations ranked by inquiry volume on the tours that visit them — Admin
// "Popular Destinations" panel.
const getPopularDestinations = async (filter) => {
  const tourCounts = await Inquiry.aggregate([
    { $match: { ...filter, tour: { $ne: null } } },
    { $group: { _id: '$tour', count: { $sum: 1 } } },
  ]);
  if (!tourCounts.length) return [];

  const countByTour = new Map(tourCounts.map((t) => [String(t._id), t.count]));
  const tourIds = tourCounts.map((t) => t._id);

  const destinations = await Destination.find({ relatedTours: { $in: tourIds }, active: true })
    .select('slug name relatedTours')
    .lean();

  const scored = destinations
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      inquiryCount: d.relatedTours.reduce((sum, tourId) => sum + (countByTour.get(String(tourId)) || 0), 0),
    }))
    .filter((d) => d.inquiryCount > 0)
    .sort((a, b) => b.inquiryCount - a.inquiryCount)
    .slice(0, 5);

  return scored;
};

// Dashboard metrics — Owner sees only their own totals,
// Admin sees the whole platform plus cross-tenant breakdowns.
const getAnalytics = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { ownerId: req.user.id };

    const [tourCount, imageCount, inquiryCount, recentActivity] = await Promise.all([
      Tour.countDocuments(filter),
      Gallery.countDocuments(filter),
      Inquiry.countDocuments(filter),
      getRecentActivity(filter),
    ]);

    if (!isAdmin) {
      return res.status(200).json({
        totals: { tours: tourCount, images: imageCount, inquiries: inquiryCount },
        recentActivity,
      });
    }

    const [ownerCount, monthlyInquiryStats, popularDestinations] = await Promise.all([
      User.countDocuments({ role: 'owner' }),
      getMonthlyInquiryStats({}),
      getPopularDestinations({}),
    ]);

    res.status(200).json({
      totals: { owners: ownerCount, tours: tourCount, images: imageCount, inquiries: inquiryCount },
      recentActivity,
      popularDestinations,
      monthlyInquiryStats,
    });
  } catch (error) {
    console.error('getAnalytics error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = { getAnalytics };
