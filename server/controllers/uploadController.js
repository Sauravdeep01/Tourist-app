const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const ALLOWED_FOLDERS = ['gallery', 'destinations', 'tours'];

// Upload one image to Cloudinary and return its URL + public ID (Owner or Admin)
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errors: [{ field: 'image', message: 'Please select an image to upload' }] });
    }

    const folder = ALLOWED_FOLDERS.includes(req.body.folder) ? req.body.folder : 'misc';
    const result = await uploadBufferToCloudinary(req.file.buffer, `appl-travel/${folder}`);

    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('uploadImage error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

// Remove an image from Cloudinary once it's no longer used anywhere (Owner or Admin)
const removeImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ errors: [{ field: 'publicId', message: 'publicId is required' }] });
    }

    await deleteFromCloudinary(publicId);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('removeImage error:', error);
    res.status(500).json({ error: 'Image deletion failed' });
  }
};

module.exports = { uploadImage, removeImage };
