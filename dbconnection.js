const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = mongoose.connect(process.env.MONGO_URI)

module.exports = connectDB;