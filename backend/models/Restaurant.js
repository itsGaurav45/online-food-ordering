import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    default: "4.0"
  },
  deliveryTime: {
    type: String,
    required: true
  },
  deliveryFee: {
    type: String,
    default: "Free"
  },
  costForTwo: {
    type: String,
    required: true
  },
  discount: {
    type: String
  },
  promo: {
    type: String
  },
  isPureVeg: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'suspended'],
    default: 'active'
  },
  ownerName: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  fssaiStatus: {
    type: String,
    enum: ['Verified', 'Pending', 'In Progress'],
    default: 'Pending'
  },
  location: {
    type: String
  },
  emoji: {
    type: String,
    default: '🍴'
  }
}, {
  timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
