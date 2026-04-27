import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const owners = [
  {
    name: "Pizza Palace Lucknow",      // MUST match restaurant name exactly
    email: "restaurant@bitebolt.com",   // demo button ka email
    password: "restaurant123",
    phone: "+91 94150 11111",
    role: "restaurant",
    initials: "PP",
    avatarBg: "var(--red)"
  },
  {
    name: "Tunday Kababi",
    email: "tunday@bitebolt.com",
    password: "restaurant123",
    phone: "+91 94150 55555",
    role: "restaurant",
    initials: "TK",
    avatarBg: "var(--orange)"
  },
  {
    name: "Green Bowl Lucknow",
    email: "greenbowl@bitebolt.com",
    password: "restaurant123",
    phone: "+91 94150 14141",
    role: "restaurant",
    initials: "GB",
    avatarBg: "var(--green)"
  }
];

const seedOwners = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB...');

    for (const ownerData of owners) {
      // Delete existing if any
      await User.deleteOne({ email: ownerData.email });
      // Create fresh (bcrypt pre-save hook will hash password)
      const user = new User(ownerData);
      await user.save();
      console.log(`✅ Created owner: ${ownerData.email} | password: ${ownerData.password}`);
    }

    console.log('\n🎉 Restaurant owners seeded! Demo login ready.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedOwners();
