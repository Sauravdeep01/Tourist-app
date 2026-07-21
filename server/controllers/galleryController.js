const Gallery = require('../models/Gallery');

// Photo grid for Gallery
const getActiveGallery = async (req, res) => {
  try {
    const items = await Gallery.find({ active: true })
      .select('imageUrl caption tourTag destinationTag order')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error('getActiveGallery error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Add a memory photo from a past tour (Owner or Admin)
const createGalleryItem = async (req, res) => {
  try {
    const newItem = await Gallery.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('createGalleryItem error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

// Edit caption/tags/order of an existing photo (Owner or Admin)
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      { $set: req.body },
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

// Remove a memory photo (Owner or Admin)
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
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
