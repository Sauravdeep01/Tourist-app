const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImages() {
  const file1 = path.join(__dirname, '../../client/public/Homepage/012a2e94950d06bbaf6d3827a499eb24.jpg');
  const file2 = path.join(__dirname, '../../client/public/Homepage/4815d66ce64d66e250b63ab5c81c2fe4.jpg');

  try {
    console.log('Uploading image 1 to Cloudinary...');
    const res1 = await cloudinary.uploader.upload(file1, {
      folder: 'bodhipath_homepage'
    });
    console.log('IMAGE 1 URL:', res1.secure_url);

    console.log('Uploading image 2 to Cloudinary...');
    const res2 = await cloudinary.uploader.upload(file2, {
      folder: 'bodhipath_homepage'
    });
    console.log('IMAGE 2 URL:', res2.secure_url);

    console.log('UPLOAD COMPLETE!');
  } catch (err) {
    console.error('Upload Error:', err);
  }
}

uploadImages();
