const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  tags: { type: [String], default: [] }
});

module.exports = mongoose.model('Menu', menuSchema);
