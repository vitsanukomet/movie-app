/**
 * Database Seed Script
 * เพิ่มข้อมูลผู้ใช้ admin และหนังตัวอย่าง
 * 
 * Usage: npm run db:seed
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'moviesdb',
};

// Sample movies data (Google sample videos)
const moviesData = [
  {
    title: "Big Buck Bunny",
    description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore!",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    subtitle: "Animation, Short"
  },
  {
    title: "Elephant Dream",
    description: "The first Blender Open Movie from 2006.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    subtitle: "Animation, Sci-Fi"
  },
  {
    title: "For Bigger Blazes",
    description: "HBO GO now icons icons icons. Icons Icons Icons Icons Icons Icons Icons Icons Icons Icons.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    subtitle: "Advertisement"
  },
  {
    title: "For Bigger Escape",
    description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscape.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscape.jpg",
    subtitle: "Advertisement"
  },
  {
    title: "For Bigger Fun",
    description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    subtitle: "Advertisement"
  },
  {
    title: "For Bigger Joyrides",
    description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    subtitle: "Advertisement"
  },
  {
    title: "For Bigger Meltdowns",
    description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    subtitle: "Advertisement"
  },
  {
    title: "Sintel",
    description: "Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    subtitle: "Animation, Fantasy"
  },
  {
    title: "Subaru Outback On Street And Dirt",
    description: "Smoking Tire takes the all-new Subaru Outback to the wide open spaces to see what it's made of.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    subtitle: "Automotive"
  },
  {
    title: "Tears of Steel",
    description: "Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    subtitle: "Sci-Fi, Drama"
  },
  {
    title: "Volkswagen GTI Review",
    description: "The Smoking Tire heads out to California to test the Volkswagen GTI.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
    subtitle: "Automotive"
  },
  {
    title: "We Are Going On Bullrun",
    description: "The Smoking Tire is going on the 2010 Bullrun Live Rally in a 2011 Dodge Charger SRT8.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
    subtitle: "Automotive"
  },
  {
    title: "What care can you get for a grand?",
    description: "The Smoking Tire meets up with Chris and Jorge from CJP Power.",
    source_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    thumb_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WhatCarCanYouGetForAGrand.jpg",
    subtitle: "Automotive"
  }
];

const seedDatabase = async () => {
  let connection;

  try {
    console.log('🔧 Connecting to database...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to database');

    // Create admin user
    console.log('');
    console.log('👤 Creating admin user...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
      await connection.execute(
        `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
        ['admin', hashedPassword, 'admin@movieapp.com', 'admin']
      );
      console.log('✅ Admin user created');
      console.log(`   Username: admin`);
      console.log(`   Password: ${adminPassword}`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️  Admin user already exists, skipping...');
      } else {
        throw err;
      }
    }

    // Create test user
    console.log('');
    console.log('👤 Creating test user...');
    const userPassword = 'user123';
    const userHashedPassword = await bcrypt.hash(userPassword, 10);

    try {
      await connection.execute(
        `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
        ['testuser', userHashedPassword, 'test@movieapp.com', 'user']
      );
      console.log('✅ Test user created');
      console.log(`   Username: testuser`);
      console.log(`   Password: ${userPassword}`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️  Test user already exists, skipping...');
      } else {
        throw err;
      }
    }

    // Seed movies
    console.log('');
    console.log('🎬 Seeding movies...');
    
    for (const movie of moviesData) {
      try {
        await connection.execute(
          `INSERT INTO movies (title, description, source_url, thumb_url, subtitle) 
           VALUES (?, ?, ?, ?, ?)`,
          [movie.title, movie.description, movie.source_url, movie.thumb_url, movie.subtitle]
        );
        console.log(`   ✓ Added: ${movie.title}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`   ℹ️ Skipped (exists): ${movie.title}`);
        } else {
          console.log(`   ⚠️ Error adding ${movie.title}: ${err.message}`);
        }
      }
    }

    console.log('');
    console.log('🎉 Database seeding completed!');
    console.log('');
    console.log('You can now start the server: npm start');
    console.log('');
    console.log('Test credentials:');
    console.log('  Admin:  admin / admin123');
    console.log('  User:   testuser / user123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

seedDatabase();

