const mongoose = require('mongoose');

// Define the schema for a saved trip
const tripSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['hiking', 'cycling'], 
    required: true 
  },
  coordinates: [  
    { lat: Number, lng: Number }
  ],
  day1: [  // Optional – used only for cycling trips
    { lat: Number, lng: Number }
  ],
  day2: [  // Optional – used only for cycling trips
    { lat: Number, lng: Number }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Trip', tripSchema);
// This schema supports both hiking (coordinates only)
// and cycling (coordinates + day1 + day2 for color display)