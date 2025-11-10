const mongoose = require('mongoose');
require('dotenv').config();
const RoutineService = require('../services/RoutineService');

// Test routine generation to check for undefined values
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected for routine test');

    const routine = await RoutineService.generateRoutine('yoga', 'home', 'beginner', 'es');
    console.log('\n🧘 Generated Yoga Routine:');
    console.log('Category:', routine.category);
    console.log('Environment:', routine.environment);
    console.log('Difficulty:', routine.difficulty);
    console.log('Exercises:');
    routine.exercises.forEach(ex => {
      console.log(`- ${ex.number}. ${ex.name}`);
      console.log(`  Sets: ${ex.sets}`);
      console.log(`  Alternatives: ${ex.alternatives ? ex.alternatives.join(', ') : 'undefined'}`);
      console.log(`  Tips: ${ex.tips || 'undefined'}`);
      console.log(`  Video: ${ex.video || 'undefined'}`);
      console.log('');
    });

  } catch (e) {
    console.error('Error testing routine', e);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Closed connection');
  }
})();