const Destination = require('../models/Destination');

// List active destinations for the grid (Public), sorted by journey order
const getActiveDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({ active: true })
      .select('slug name stateCountry famousFor rating coverImage order')
      .sort({ order: 1 });

    res.status(200).json(destinations);
  } catch (error) {
    console.error('getActiveDestinations error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Get a single destination by slug, with related tours populated (Public)
const getDestinationBySlug = async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug, active: true })
      .populate('relatedTours', 'slug title');

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error('getDestinationBySlug error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Create a new destination (Admin only)
const createDestination = async (req, res) => {
  try {
    const { slug } = req.body;

    const existingDestination = await Destination.findOne({ slug });
    if (existingDestination) {
      return res.status(400).json({ error: 'A destination with this slug already exists' });
    }

    const newDestination = await Destination.create(req.body);
    res.status(201).json(newDestination);
  } catch (error) {
    console.error('createDestination error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Update an existing destination (Owner or Admin)
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // Admin can edit all fields. Owner can edit description, rating,
    // climate/season facts, highlights, and images (§3.9) — but not the
    // structural fields reserved for the Admin-only destinations manager
    // (create/toggle active/delete/reorder, §2.5.1).
    if (req.user.role !== 'admin') {
      delete updateData.slug;
      delete updateData.active;
      delete updateData.order;
      delete updateData.relatedTours;
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDestination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json(updatedDestination);
  } catch (error) {
    console.error('updateDestination error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Delete a destination (Admin only)
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDestination = await Destination.findByIdAndDelete(id);
    if (!deletedDestination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('deleteDestination error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = {
  getActiveDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
};
