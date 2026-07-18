const Tour = require('../models/Tour');

// List active tours (featured first, then newest)
const getActiveTours = async (req, res) => {
  try {
    const tours = await Tour.find({ active: true })
      .select('slug title subtitle days nights overview priceFrom coverImage featured')
      .sort({ featured: -1, createdAt: -1 });

    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

// Create a new tour package (Admin only)
const createTour = async (req, res) => {
  try {
    const { slug } = req.body;

    const existingTour = await Tour.findOne({ slug });
    if (existingTour) {
      return res.status(400).json({ error: 'A tour with this slug already exists' });
    }

    const newTour = await Tour.create(req.body);
    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing tour (Owner or Admin)
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin can edit everything, Owner can edit pricing and texts.
    // The endpoint accepts any partial fields matching the schema and updates them.
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ error: 'Tour package not found' });
    }

    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a tour package (Admin only)
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({ error: 'Tour package not found' });
    }

    res.status(200).json({ message: 'Tour package deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getActiveTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
};
