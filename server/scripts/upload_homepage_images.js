const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const HOMEPAGE_IMAGES = [
  'varanasi1.jpg',
  'varanasi2.jpg',
  'bodh_gaya.jpg',
  'Ghora_Katora_Lake_in_Rajgir_Bihar_(cropped).jpg'
];

async function uploadImages() {
  for (const filename of HOMEPAGE_IMAGES) {
    const filePath = path.join(__dirname, '../../client/public/Homepage', filename);
    try {
      console.log(`Uploading ${filename} to Cloudinary...`);
      const res = await cloudinary.uploader.upload(filePath, {
        folder: 'bodhipath_homepage'
      });
      console.log(`${filename} URL:`, res.secure_url);
    } catch (err) {
      console.error(`Upload Error (${filename}):`, err);
    }
  }

  console.log('UPLOAD COMPLETE!');
}

uploadImages();
