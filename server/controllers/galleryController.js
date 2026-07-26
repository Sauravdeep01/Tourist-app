const Gallery = require('../models/Gallery');
const Destination = require('../models/Destination');

// Photo grid for Gallery (Public)
const getActiveGallery = async (req, res) => {
  try {
    const items = await Gallery.find({ active: true })
      .select('imageUrl imageTitle destinationName description altText caption tourTag order')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error('getActiveGallery error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Dashboard image list — Owner sees only their own images; Admin sees all
const getManageGallery = async (req, res) => {
  try {
    const items = await Gallery.find({ ...(req.ownerFilter || {}) })
      .populate('ownerId', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error('getManageGallery error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Add a photo to gallery (Owner or Admin)
const createGalleryItem = async (req, res) => {
  try {
    // ownerId always comes from the token, never the request body
    const newItem = await Gallery.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(newItem);
  } catch (error) {
    console.error('createGalleryItem error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Edit title/caption/tags/order of an existing photo (requireOwnership already
// confirmed the Owner owns this image, or that the caller is Admin)
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.ownerId; // ownership never changes via this endpoint

    if (updateData.destinationName) {
      const destinationExists = await Destination.findOne({
        $or: [{ 'name.en': updateData.destinationName }, { 'name.zh': updateData.destinationName }],
      });
      if (!destinationExists) {
        return res.status(400).json({
          errors: [{ field: 'destinationName', message: 'Please select a destination for this image' }],
        });
      }
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('updateGalleryItem error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Remove a memory photo (requireOwnership already confirmed ownership/Admin)
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Gallery.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('deleteGalleryItem error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = {
  getActiveGallery,
  getManageGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
