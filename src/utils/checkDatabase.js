const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const exercises = await Exercise.find({});
    console.log(`📊 Total exercises found: ${exercises.length}`);
    
    if (exercises.length === 0) {
      console.log('❌ NO EXERCISES FOUND! Database is empty.');
      return;
    }
    
    console.log('\n🎯 Categories in database:');
    const categories = [...new Set(exercises.map(e => e.category))];
    categories.forEach(cat => console.log(`• ${cat}`));
    
    console.log('\n🏠 Environments in database:');
    const environments = [...new Set(exercises.map(e => e.environment))];
    environments.forEach(env => console.log(`• ${env}`));
    
    console.log('\n📋 Sample exercises by category:');
    categories.forEach(category => {
      const exsInCat = exercises.filter(e => e.category === category);
      console.log(`\n${category} (${exsInCat.length} exercises):`);
      exsInCat.forEach(ex => {
        console.log(`  - ${ex.name.en} (${ex.environment})`);
      });
    });
    
    // Test specific search
    console.log('\n🔍 Testing cardio search:');
    const cardioExercises = await Exercise.find({ category: 'cardio' });
    console.log(`Found ${cardioExercises.length} cardio exercises`);
    
    console.log('\n🔍 Testing chest_biceps + gym search:');
    const chestGym = await Exercise.find({ 
      category: 'chest_biceps',
      $or: [
        { environment: 'gym' },
        { environment: 'both' }
      ]
    });
    console.log(`Found ${chestGym.length} chest_biceps gym exercises`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

checkDatabase();