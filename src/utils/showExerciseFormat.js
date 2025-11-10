const mongoose = require('mongoose');
require('dotenv').config();
const Exercise = require('../models/Exercise');

// Script to show exercise format in database
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get one exercise from each category to show format
    const categories = ['chest_biceps', 'back_triceps', 'legs_shoulders', 'core', 'cardio', 'yoga'];

    console.log('\n📋 FORMATO DE EJERCICIOS EN BASE DE DATOS\n');
    console.log('='.repeat(50));

    for (const category of categories) {
      const exercise = await Exercise.findOne({ category }).lean();
      if (exercise) {
        console.log(`\n🏷️  CATEGORÍA: ${category.toUpperCase()}`);
        console.log(JSON.stringify(exercise, null, 2));
        console.log('-'.repeat(30));
      }
    }

    console.log('\n📝 ESTRUCTURA DEL ESQUEMA:');
    console.log(`
{
  name: {
    en: String (required),
    es: String (required)
  },
  category: String (enum: chest_biceps, back_triceps, legs_shoulders, core, cardio, yoga, full_body),
  environment: String (enum: gym, home, both),
  difficulty: {
    beginner: {
      sets: Number (required),
      reps: String (required)
    },
    intermediate: {
      sets: Number (required),
      reps: String (required)
    },
    advanced: {
      sets: Number (required),
      reps: String (required)
    }
  },
  description: {
    en: String (required),
    es: String (required)
  },
  tips: {
    en: String (required),
    es: String (required)
  },
  alternatives: {
    en: [String],
    es: [String]
  },
  videoUrl: String (required),
  timestamps: true
}
    `);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Closed connection');
  }
})();