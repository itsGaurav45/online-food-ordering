import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'restaurant', 'customer'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Suspended'],
    default: 'Active'
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: String,
    default: "₹0"
  },
  initials: {
    type: String
  },
  avatarBg: {
    type: String,
    default: "var(--gray2)"
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
