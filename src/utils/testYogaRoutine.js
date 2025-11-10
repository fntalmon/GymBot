const mongoose = require('mongoose');
require('dotenv').config();
const RoutineService = require('../services/RoutineService');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected for yoga routine test');
    const routine = await RoutineService.generateRoutine('yoga', 'home', 'beginner', 'es');
    console.log('\n🧘 Rutina Yoga (beginner, ES):');
    routine.exercises.forEach(ex => {
      console.log(`- ${ex.number}. ${ex.name} | ${ex.sets}`);
    });
  } catch (e) {
    console.error('Error testing yoga routine', e);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Closed connection');
  }
})();