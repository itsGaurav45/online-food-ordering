import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: {
    type: String,
    required: true
  },
  itemsList: {
    type: Array,
    default: []
  },
  amount: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Card', 'COD'],
    default: 'UPI'
  },
  status: {
    type: String,
    enum: ['New', 'Preparing', 'Delivering', 'Delivered', 'Cancelled'],
    default: 'New'
  },
  statusBadge: {
    type: String,
    default: 'badge-yellow'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
