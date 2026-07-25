const Tour = require('../models/Tour');

// List active tours (featured first, then newest) — Public
const getActiveTours = async (req, res) => {
  try {
    const tours = await Tour.find({ active: true })
      .select('slug title subtitle days nights overview priceFrom coverImage featured')
      .sort({ featured: -1, createdAt: -1 });

    res.status(200).json(tours);
  } catch (error) {
    console.error('getActiveTours error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Dashboard tour list — Owner sees only their own tours (incl. inactive);
// Admin sees all, with the owning Owner populated (§2.5.0, §3.9).
const getManageTours = async (req, res) => {
  try {
    const tours = await Tour.find({ ...(req.ownerFilter || {}) })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tours);
  } catch (error) {
    console.error('getManageTours error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Get a single tour by slug
const getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, active: true });

    if (!tour) {
      return res.status(404).json({ error: 'Tour package not found' });
    }

    res.status(200).json(tour);
  } catch (error) {
    console.error('getTourBySlug error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Create a new tour package (Owner — owned by them; Admin — unscoped)
const createTour = async (req, res) => {
  try {
    const { slug } = req.body;

    const existingTour = await Tour.findOne({ slug });
    if (existingTour) {
      return res.status(400).json({ error: 'A tour with this slug already exists' });
    }

    // ownerId always comes from the token, never the request body
    const newTour = await Tour.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(newTour);
  } catch (error) {
    console.error('createTour error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Update an existing tour (requireOwnership already confirmed the Owner owns
// this tour, or that the caller is Admin, before this handler runs
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
    delete updateData.ownerId; // ownership never changes via this endpoint

    // Admin can edit all fields. Owner can edit pricing, itinerary, texts, and media
    // but is prohibited from modifying core administrative fields (slug, active, featured).
    if (req.user.role !== 'admin') {
      delete updateData.slug;
      delete updateData.active;
      delete updateData.featured;
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ error: 'Tour package not found' });
    }

    res.status(200).json(updatedTour);
  } catch (error) {
    console.error('updateTour error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Delete a tour package (requireOwnership already confirmed ownership/Admin)
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({ error: 'Tour package not found' });
    }

    res.status(200).json({ message: 'Tour package deleted successfully' });
  } catch (error) {
    console.error('deleteTour error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = {
  getActiveTours,
  getManageTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
};
