// models/Map.js
const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    default: mongoose.Types.ObjectId 
  },
  tile: { 
    type: String, 
    required: true, 
    trim: true 
  },
  alto: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  ancho: { 
    type: Number, 
    required: true, 
    min: 0 
  }
});

module.exports = mongoose.model('Map', mapSchema);
