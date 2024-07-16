// db.js
const {mongoose, mongo} = require('../helper/includes');


const connectDB = async () => {
  try {
    await mongoose.connect(mongo.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected');
    

    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;

