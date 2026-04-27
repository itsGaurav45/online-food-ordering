import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import Restaurant from './models/Restaurant.js';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const users = [
  { name: "Super Admin", email: "admin@bitebolt.com", phone: "+91 11111 11111", role: "admin", password: "admin123", initials: "AD", avatarBg: "var(--dark)" }
];

const foods = [];

const restaurants = [];


const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Food.deleteMany();
    await Restaurant.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data...');

    // Create users one by one so bcrypt pre-save hook fires
    const createdUsers = [];
    for (const u of users) {
      const user = await new User(u).save();
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users with hashed passwords`);

    const createdRests = await Restaurant.insertMany(restaurants);
    await Food.insertMany(foods);

    console.log('Database cleared and minimal users seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

