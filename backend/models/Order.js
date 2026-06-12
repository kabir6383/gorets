const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [
    {
      id: { type: String, required: true },
      qty: { type: Number, required: true }
    }
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  promoCode: { type: String, default: null },
  paymentMethod: { type: String, required: true },
  diningMode: { type: String, required: true },
  tableNumber: { type: String, default: null },
  status: { type: String, default: 'placed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
