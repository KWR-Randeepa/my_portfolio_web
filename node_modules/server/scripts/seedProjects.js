import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
import Project from '../models/Project.js';

dotenv.config();

const initialProjects = [
  {
    title: 'MediFind',
    description: 'A digital pharmacy management and locator application built to execute high-speed, localized geospatial queries.',
    tags: ['Geospatial', 'Full-Stack', 'React', 'Node.js'],
  },
  {
    title: 'Urban Waste Management',
    description: 'A municipal efficiency platform targeting Colombo/Gampaha, pairing microservices with predictive machine learning for route optimization.',
    tags: ['Spring Boot', 'Flask', 'ML', 'Python'],
  },
  {
    title: 'Smart Study Desk',
    description: 'An interactive hardware IoT system built upon an Arduino Uno core, telemetry sensors, and a real-time Flutter app dashboard via Bluetooth.',
    tags: ['Arduino', 'Flutter', 'IoT', 'Telemetry'],
  },
  {
    title: 'Cosmic WebGL Sim',
    description: 'A three-dimensional space constellation simulation tracking line-segment nodes and rendering dynamic meteor interactions.',
    tags: ['Three.js', 'WebGL', 'JavaScript', '3D'],
  }
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Project.countDocuments();

    if (count > 0) {
      console.log(`Database already has ${count} projects. Skipping seed.`);
      process.exit(0);
    }

    await Project.insertMany(initialProjects);
    console.log('Seeded 4 initial portfolio projects into MongoDB Atlas successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Project seed error:', err);
    process.exit(1);
  }
};

seedProjects();
