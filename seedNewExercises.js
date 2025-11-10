require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('./src/models/Exercise');
const newExercises = require('./src/data/exercises-expansion.json');

async function seedNewExercises() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing exercise names to avoid duplicates
    const existingExercises = await Exercise.find({}, 'name.en name.es');
    const existingEnNames = new Set(existingExercises.map(ex => ex.name.en));
    const existingEsNames = new Set(existingExercises.map(ex => ex.name.es));

    console.log(`📊 Current exercises in DB: ${existingExercises.length}`);

    // Filter out exercises that already exist
    const exercisesToAdd = newExercises.filter(exercise => {
      const alreadyExists = existingEnNames.has(exercise.name.en) || 
                           existingEsNames.has(exercise.name.es);
      if (alreadyExists) {
        console.log(`⏭️  Skipping duplicate: ${exercise.name.en}`);
      }
      return !alreadyExists;
    });

    if (exercisesToAdd.length === 0) {
      console.log('ℹ️  No new exercises to add. All exercises already exist.');
      process.exit(0);
    }

    console.log(`\n🆕 Adding ${exercisesToAdd.length} new exercises:`);
    
    // Insert new exercises
    const inserted = await Exercise.insertMany(exercisesToAdd);
    
    console.log(`\n✅ Successfully added ${inserted.length} new exercises!`);
    
    // Show summary by category
    const categoryCounts = {};
    inserted.forEach(ex => {
      categoryCounts[ex.category] = (categoryCounts[ex.category] || 0) + 1;
    });
    
    console.log('\n📈 New exercises by category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: +${count}`);
    });

    // Show total count
    const totalExercises = await Exercise.countDocuments();
    console.log(`\n🎯 Total exercises in database: ${totalExercises}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
    process.exit(1);
  }
}

seedNewExercises();
