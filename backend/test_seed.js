import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import Food from './models/Food.js';

dotenv.config();

const testSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Create a restaurant owner
    const owner = new User({
      name: "Test Restaurant", // The name must match the restaurant name for the /mine route to work based on our current logic
      email: "owner@test.com",
      phone: "+91 88888 88888",
      role: "restaurant",
      password: "password123", // Will be hashed by pre-save hook
      initials: "TR",
      avatarBg: "var(--red)"
    });
    await owner.save();

    // Create a restaurant
    const restaurant = new Restaurant({
      name: "Test Restaurant",
      cuisine: "Test Cuisine",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      rating: "5.0",
      deliveryTime: "30",
      costForTwo: "500",
      status: "active",
      ownerName: "Test Owner",
      phone: "+91 88888 88888",
      email: "owner@test.com"
    });
    const savedRest = await restaurant.save();

    // Create food
    const food = new Food({
      name: "Test Pizza",
      price: 299,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      category: "Pizzas",
      description: "A delicious test pizza",
      restaurant: savedRest._id
    });
    await food.save();

    // Create a customer
    const customer = new User({
      name: "Test Customer",
      email: "customer@test.com",
      phone: "+91 99999 99999",
      role: "customer",
      password: "password123",
      initials: "TC",
      avatarBg: "var(--blue)"
    });
    await customer.save();

    console.log('Test data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testSeed();
