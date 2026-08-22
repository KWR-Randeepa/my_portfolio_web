import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Fix Windows DNS SRV lookup for Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe123!';

    const existing = await User.findOne({ username });
    
    if (existing) {
      console.log(`Admin user '${username}' already exists in Atlas database.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      username,
      password: hashedPassword
    });

    await admin.save();
    console.log(`Admin account '${username}' created successfully in MongoDB Atlas!`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedAdmin();