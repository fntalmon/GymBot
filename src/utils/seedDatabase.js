const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const exercisesData = require('../data/exercises-sample.json');
require('dotenv').config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('🗑️ Cleared existing exercises');

    // Insert new exercises
    await Exercise.insertMany(exercisesData);
    console.log(`✅ Inserted ${exercisesData.length} exercises`);

    // Show stats
    const stats = await Exercise.aggregate([
      {
        $group: {
          _id: {
            category: '$category',
            environment: '$environment'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.category': 1, '_id.environment': 1 }
      }
    ]);

    console.log('\n📊 Exercise distribution:');
    stats.forEach(stat => {
      console.log(`${stat._id.category} (${stat._id.environment}): ${stat.count} exercises`);
    });

    console.log('\n🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };