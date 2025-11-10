const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
require('dotenv').config();

const exercisesData = require('../data/exercises-full.json');

async function seedFullDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('🗑️ Cleared existing exercises');

    // Insert new exercises
    const exercises = await Exercise.insertMany(exercisesData);
    console.log(`✅ Inserted ${exercises.length} exercises`);

    // Show exercise distribution
    const distribution = {};
    exercises.forEach(exercise => {
      const key = `${exercise.category} (${exercise.environment})`;
      distribution[key] = (distribution[key] || 0) + 1;
    });

    console.log('\n📊 Exercise distribution:');
    Object.entries(distribution).forEach(([key, count]) => {
      console.log(`${key}: ${count} exercises`);
    });

    // Summary by category
    const byCategory = {};
    exercises.forEach(exercise => {
      byCategory[exercise.category] = (byCategory[exercise.category] || 0) + 1;
    });

    console.log('\n🎯 By category:');
    Object.entries(byCategory).forEach(([category, count]) => {
      console.log(`• ${category}: ${count} exercises`);
    });

    console.log('\n🎉 Full database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedFullDatabase();
}

module.exports = seedFullDatabase;