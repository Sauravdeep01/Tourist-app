const mongoose = require('mongoose');
const chalk = require("chalk")

// Connect to MongoDB using the MONGO_URI env variable
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green(`DB Connected`));
  } catch (error) {
    console.error(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
