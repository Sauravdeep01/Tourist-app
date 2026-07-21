const cloudinary = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
};

const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
