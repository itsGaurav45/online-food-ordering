import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import Food from './models/Food.js';
import User from './models/User.js';

dotenv.config();

// ─── RESTAURANTS ───────────────────────────────────────────────────────────────
const restaurants = [
  // 🍕 PIZZA
  {
    name: "Pizza Palace Lucknow",
    cuisine: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    rating: "4.5",
    deliveryTime: "30",
    deliveryFee: "Free",
    costForTwo: "600",
    discount: "20% OFF",
    promo: "PIZZA20",
    isPureVeg: false,
    status: "active",
    ownerName: "Rahul Sharma",
    phone: "+91 94150 11111",
    email: "pizzapalace@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Hazratganj, Lucknow",
    emoji: "🍕"
  },
  {
    name: "La Pino'z Lucknow",
    cuisine: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
    rating: "4.3",
    deliveryTime: "35",
    deliveryFee: "₹30",
    costForTwo: "550",
    discount: "30% OFF upto ₹75",
    promo: "LAPINOZ30",
    isPureVeg: false,
    status: "active",
    ownerName: "Vikash Gupta",
    phone: "+91 94150 22222",
    email: "lapinoz@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Gomti Nagar, Lucknow",
    emoji: "🍕"
  },

  // 🍔 BURGER
  {
    name: "Burger Point Lucknow",
    cuisine: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    rating: "4.4",
    deliveryTime: "25",
    deliveryFee: "Free",
    costForTwo: "400",
    discount: "15% OFF",
    promo: "BURGER15",
    isPureVeg: false,
    status: "active",
    ownerName: "Ankit Verma",
    phone: "+91 94150 33333",
    email: "burgerpoint@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Aliganj, Lucknow",
    emoji: "🍔"
  },
  {
    name: "Mad Over Burgers",
    cuisine: "Burger",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600",
    rating: "4.6",
    deliveryTime: "20",
    deliveryFee: "₹20",
    costForTwo: "450",
    discount: "Buy 1 Get 1",
    promo: "BOGO",
    isPureVeg: false,
    status: "active",
    ownerName: "Priya Singh",
    phone: "+91 94150 44444",
    email: "madoverburgers@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Indira Nagar, Lucknow",
    emoji: "🍔"
  },

  // 🍗 BIRYANI
  {
    name: "Tunday Kababi",
    cuisine: "Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
    rating: "4.8",
    deliveryTime: "40",
    deliveryFee: "Free",
    costForTwo: "700",
    discount: "10% OFF",
    promo: "TUNDAY10",
    isPureVeg: false,
    status: "active",
    ownerName: "Mohammad Usman",
    phone: "+91 94150 55555",
    email: "tunday@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Aminabad, Lucknow",
    emoji: "🍗"
  },
  {
    name: "Wahid Biryani House",
    cuisine: "Biryani",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600",
    rating: "4.7",
    deliveryTime: "45",
    deliveryFee: "₹40",
    costForTwo: "800",
    discount: "20% OFF on ₹500+",
    promo: "WAHID20",
    isPureVeg: false,
    status: "active",
    ownerName: "Abdul Wahid",
    phone: "+91 94150 66666",
    email: "wahidbiryani@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Chowk, Lucknow",
    emoji: "🍗"
  },

  // 🥡 CHINESE
  {
    name: "Chinese Wok Lucknow",
    cuisine: "Chinese",
    image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600",
    rating: "4.2",
    deliveryTime: "30",
    deliveryFee: "Free",
    costForTwo: "500",
    discount: "25% OFF",
    promo: "CHINESE25",
    isPureVeg: false,
    status: "active",
    ownerName: "Suresh Patel",
    phone: "+91 94150 77777",
    email: "chinesewok@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Gomti Nagar, Lucknow",
    emoji: "🥡"
  },
  {
    name: "Dragon House",
    cuisine: "Chinese",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600",
    rating: "4.1",
    deliveryTime: "35",
    deliveryFee: "₹30",
    costForTwo: "450",
    discount: "Flat ₹50 OFF",
    promo: "DRAGON50",
    isPureVeg: false,
    status: "active",
    ownerName: "Lin Wei",
    phone: "+91 94150 88888",
    email: "dragonhouse@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Hazratganj, Lucknow",
    emoji: "🥡"
  },

  // 🍣 SUSHI
  {
    name: "Sushi Zen Lucknow",
    cuisine: "Sushi",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600",
    rating: "4.5",
    deliveryTime: "45",
    deliveryFee: "₹50",
    costForTwo: "1200",
    discount: "10% OFF",
    promo: "SUSHI10",
    isPureVeg: false,
    status: "active",
    ownerName: "Tanaka Ryo",
    phone: "+91 94150 99999",
    email: "sushizen@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Gomti Nagar Extension, Lucknow",
    emoji: "🍣"
  },
  {
    name: "Tokyo Bites",
    cuisine: "Sushi",
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600",
    rating: "4.3",
    deliveryTime: "50",
    deliveryFee: "₹60",
    costForTwo: "1100",
    discount: "15% OFF above ₹1000",
    promo: "TOKYO15",
    isPureVeg: false,
    status: "active",
    ownerName: "Sakura Inoue",
    phone: "+91 94150 10101",
    email: "tokyobites@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Vibhuti Khand, Lucknow",
    emoji: "🍣"
  },

  // 🎂 DESSERTS
  {
    name: "Sweet Cravings Lucknow",
    cuisine: "Desserts",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600",
    rating: "4.6",
    deliveryTime: "20",
    deliveryFee: "Free",
    costForTwo: "300",
    discount: "20% OFF",
    promo: "SWEET20",
    isPureVeg: true,
    status: "active",
    ownerName: "Meera Agarwal",
    phone: "+91 94150 12121",
    email: "sweetcravings@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Hazratganj, Lucknow",
    emoji: "🎂"
  },
  {
    name: "Raj Kachori & Sweets",
    cuisine: "Desserts",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600",
    rating: "4.4",
    deliveryTime: "25",
    deliveryFee: "₹20",
    costForTwo: "250",
    discount: "Buy 2 Get 1",
    promo: "B2G1",
    isPureVeg: true,
    status: "active",
    ownerName: "Ramesh Kachori",
    phone: "+91 94150 13131",
    email: "rajkachori@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Chowk, Lucknow",
    emoji: "🎂"
  },

  // 🥗 HEALTHY
  {
    name: "Green Bowl Lucknow",
    cuisine: "Healthy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    rating: "4.7",
    deliveryTime: "25",
    deliveryFee: "Free",
    costForTwo: "550",
    discount: "10% OFF",
    promo: "HEALTHY10",
    isPureVeg: true,
    status: "active",
    ownerName: "Dr. Nidhi Rastogi",
    phone: "+91 94150 14141",
    email: "greenbowl@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Gomti Nagar, Lucknow",
    emoji: "🥗"
  },
  {
    name: "Fit & Fresh Kitchen",
    cuisine: "Healthy",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
    rating: "4.5",
    deliveryTime: "30",
    deliveryFee: "₹25",
    costForTwo: "500",
    discount: "Flat ₹60 OFF",
    promo: "FIT60",
    isPureVeg: false,
    status: "active",
    ownerName: "Saurabh Mishra",
    phone: "+91 94150 15151",
    email: "fitfresh@bitebolt.com",
    fssaiStatus: "Verified",
    location: "Indira Nagar, Lucknow",
    emoji: "🥗"
  }
];

// ─── FOOD ITEMS (category must match restaurants) ──────────────────────────────
const getFoodItems = (restMap) => [
  // Pizza Palace Lucknow
  { name: "Margherita Pizza", price: 249, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", category: "Pizza", description: "Classic tomato sauce with fresh mozzarella & basil", restaurant: restMap["Pizza Palace Lucknow"] },
  { name: "Pepperoni Feast", price: 349, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400", category: "Pizza", description: "Loaded with spicy pepperoni and extra cheese", restaurant: restMap["Pizza Palace Lucknow"] },
  { name: "Farm House Pizza", price: 329, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", category: "Pizza", description: "Fresh veggies on a crispy thin crust", restaurant: restMap["Pizza Palace Lucknow"] },

  // La Pino'z
  { name: "Double Decker Pizza", price: 399, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", category: "Pizza", description: "Two layers of crust with loaded toppings", restaurant: restMap["La Pino'z Lucknow"] },
  { name: "Cheese Burst Pizza", price: 449, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400", category: "Pizza", description: "Oozing cheese crust with golden bake", restaurant: restMap["La Pino'z Lucknow"] },

  // Burger Point
  { name: "Classic Veg Burger", price: 129, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400", category: "Burger", description: "Crispy patty with lettuce, tomato & mayo", restaurant: restMap["Burger Point Lucknow"] },
  { name: "Chicken Zinger", price: 179, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", category: "Burger", description: "Crispy fried chicken with spicy sauce", restaurant: restMap["Burger Point Lucknow"] },
  { name: "Double Smash Burger", price: 249, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400", category: "Burger", description: "Double beef smash patty with secret sauce", restaurant: restMap["Burger Point Lucknow"] },

  // Mad Over Burgers
  { name: "BBQ Bacon Burger", price: 299, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400", category: "Burger", description: "Smoky BBQ with crispy bacon strips", restaurant: restMap["Mad Over Burgers"] },
  { name: "Mushroom Swiss Burger", price: 259, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400", category: "Burger", description: "Sautéed mushrooms with Swiss cheese melt", restaurant: restMap["Mad Over Burgers"] },

  // Tunday Kababi
  { name: "Galouti Kebab", price: 350, image: "https://images.unsplash.com/photo-1599487489043-1d3c01a1e0b6?w=400", category: "Biryani", description: "Melt-in-mouth Lucknawi galouti kebab", restaurant: restMap["Tunday Kababi"] },
  { name: "Chicken Biryani", price: 280, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", category: "Biryani", description: "Slow-cooked Awadhi dum biryani", restaurant: restMap["Tunday Kababi"] },
  { name: "Seekh Kebab", price: 220, image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400", category: "Biryani", description: "Juicy lamb seekh kebab with mint chutney", restaurant: restMap["Tunday Kababi"] },

  // Wahid Biryani
  { name: "Mutton Biryani", price: 360, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400", category: "Biryani", description: "Rich mutton dum biryani with saffron rice", restaurant: restMap["Wahid Biryani House"] },
  { name: "Veg Biryani", price: 220, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400", category: "Biryani", description: "Aromatic basmati with mixed vegetables", restaurant: restMap["Wahid Biryani House"] },

  // Chinese Wok
  { name: "Veg Hakka Noodles", price: 149, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", category: "Chinese", description: "Stir-fried noodles with seasonal veggies", restaurant: restMap["Chinese Wok Lucknow"] },
  { name: "Chicken Manchurian", price: 229, image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400", category: "Chinese", description: "Crispy chicken in spicy Manchurian sauce", restaurant: restMap["Chinese Wok Lucknow"] },
  { name: "Fried Rice", price: 169, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", category: "Chinese", description: "Wok-tossed egg fried rice", restaurant: restMap["Chinese Wok Lucknow"] },

  // Dragon House
  { name: "Dimsums (6 pcs)", price: 199, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", category: "Chinese", description: "Steamed vegetable dimsums with chilli oil", restaurant: restMap["Dragon House"] },
  { name: "Dragon Spring Rolls", price: 179, image: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=400", category: "Chinese", description: "Crispy rolls with vegetable filling", restaurant: restMap["Dragon House"] },

  // Sushi Zen
  { name: "California Roll (8 pcs)", price: 499, image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400", category: "Sushi", description: "Crab, avocado & cucumber in seasoned rice", restaurant: restMap["Sushi Zen Lucknow"] },
  { name: "Salmon Nigiri (4 pcs)", price: 599, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", category: "Sushi", description: "Fresh salmon on hand-pressed sushi rice", restaurant: restMap["Sushi Zen Lucknow"] },
  { name: "Dragon Roll", price: 699, image: "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400", category: "Sushi", description: "Shrimp tempura topped with avocado slices", restaurant: restMap["Sushi Zen Lucknow"] },

  // Tokyo Bites
  { name: "Spicy Tuna Roll", price: 549, image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400", category: "Sushi", description: "Spicy tuna with sriracha mayo & cucumber", restaurant: restMap["Tokyo Bites"] },
  { name: "Veg Avocado Roll", price: 399, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400", category: "Sushi", description: "Creamy avocado with cucumber in sesame rice", restaurant: restMap["Tokyo Bites"] },

  // Sweet Cravings
  { name: "Chocolate Lava Cake", price: 199, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", category: "Desserts", description: "Warm molten chocolate cake with ice cream", restaurant: restMap["Sweet Cravings Lucknow"] },
  { name: "Gulab Jamun (4 pcs)", price: 99, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400", category: "Desserts", description: "Soft gulab jamun soaked in rose syrup", restaurant: restMap["Sweet Cravings Lucknow"] },
  { name: "Rasmalai (2 pcs)", price: 129, image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400", category: "Desserts", description: "Creamy rasmalai in chilled saffron milk", restaurant: restMap["Sweet Cravings Lucknow"] },

  // Raj Kachori
  { name: "Raj Kachori", price: 89, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", category: "Desserts", description: "Crispy kachori with curd, chutney & sev", restaurant: restMap["Raj Kachori & Sweets"] },
  { name: "Mango Kulfi", price: 79, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", category: "Desserts", description: "Traditional mango kulfi on a stick", restaurant: restMap["Raj Kachori & Sweets"] },

  // Green Bowl
  { name: "Quinoa Buddha Bowl", price: 349, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", category: "Healthy", description: "Quinoa, roasted veggies, hummus & tahini", restaurant: restMap["Green Bowl Lucknow"] },
  { name: "Kale & Avocado Salad", price: 299, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", category: "Healthy", description: "Fresh kale tossed with creamy avocado dressing", restaurant: restMap["Green Bowl Lucknow"] },
  { name: "Protein Smoothie Bowl", price: 279, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400", category: "Healthy", description: "High-protein smoothie bowl with granola", restaurant: restMap["Green Bowl Lucknow"] },

  // Fit & Fresh
  { name: "Grilled Chicken Salad", price: 329, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", category: "Healthy", description: "Lean grilled chicken with mixed greens & vinaigrette", restaurant: restMap["Fit & Fresh Kitchen"] },
  { name: "Oats & Egg Bowl", price: 199, image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400", category: "Healthy", description: "Power breakfast bowl with oats and boiled eggs", restaurant: restMap["Fit & Fresh Kitchen"] },
  { name: "Green Detox Wrap", price: 249, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", category: "Healthy", description: "Spinach wrap with tofu, sprouts & mint yogurt", restaurant: restMap["Fit & Fresh Kitchen"] },
];

// ─── SEED FUNCTION ─────────────────────────────────────────────────────────────
const seedRestaurants = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB...');

    // Delete old restaurant & food data only (keep users & orders)
    await Restaurant.deleteMany({});
    await Food.deleteMany({});
    console.log('🗑️  Cleared old restaurants and foods...');

    // Insert restaurants
    const inserted = await Restaurant.insertMany(restaurants);
    console.log(`🏪 Inserted ${inserted.length} restaurants`);

    // Build name → _id map
    const restMap = {};
    inserted.forEach(r => { restMap[r.name] = r._id; });

    // Insert food items
    const foodItems = getFoodItems(restMap);
    await Food.insertMany(foodItems);
    console.log(`🍽️  Inserted ${foodItems.length} food items`);

    console.log('\n🎉 All done! Lucknow restaurants seeded successfully.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seedRestaurants();
