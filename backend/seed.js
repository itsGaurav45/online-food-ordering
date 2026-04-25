import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import Restaurant from './models/Restaurant.js';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const users = [
  { name: "Arjun Sharma", email: "arjun@example.com", phone: "+91 98765 43210", role: "customer", initials: "AS", avatarBg: "var(--red)", totalOrders: 24, totalSpent: "₹8,420" },
  { name: "Priya Mehta", email: "priya@example.com", phone: "+91 87654 32109", role: "customer", initials: "PM", avatarBg: "var(--orange)", totalOrders: 18, totalSpent: "₹6,240" },
  { name: "Super Admin", email: "admin@bitebolt.com", phone: "+91 11111 11111", role: "admin", initials: "AD", avatarBg: "var(--dark)" }
];

const foods = [
  { name: "Margherita Pizza", price: 299, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", category: "Pizzas", description: "Classic tomato sauce, fresh mozzarella, basil leaves on a hand-tossed crust" },
  // ... (keep others if needed, but I'll shorten for brevity)
];

const restaurants = [
  {
    name: "Pizza Palace, Gomti Nagar",
    cuisine: "Pizza · Italian · Pasta",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    rating: "4.8",
    deliveryTime: "22",
    costForTwo: "200",
    status: "active",
    ownerName: "Rajesh Kumar",
    phone: "+91 99999 11111"
  },
  {
    name: "Taco Tales",
    cuisine: "Mexican · Vasant Kunj, Delhi",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    rating: "4.0",
    deliveryTime: "30",
    costForTwo: "400",
    status: "pending",
    ownerName: "Raj Malhotra",
    phone: "+91 98765 00011",
    emoji: "🌮"
  },
  {
    name: "Spice Route",
    cuisine: "North Indian · Hauz Khas, Delhi",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    rating: "4.2",
    deliveryTime: "35",
    costForTwo: "500",
    status: "pending",
    ownerName: "Anita Gupta",
    phone: "+91 87654 00022",
    emoji: "🍛"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Food.deleteMany();
    await Restaurant.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data...');

    const createdUsers = await User.insertMany(users);
    const createdRests = await Restaurant.insertMany(restaurants);
    await Food.insertMany(foods);

    // Create sample orders
    const sampleOrders = [
      {
        orderId: "#BB2024119",
        customer: createdUsers[0]._id,
        restaurant: createdRests[0]._id,
        items: "3 items",
        amount: "₹698",
        status: "New",
        statusBadge: "badge-yellow"
      }
    ];
    await Order.insertMany(sampleOrders);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

