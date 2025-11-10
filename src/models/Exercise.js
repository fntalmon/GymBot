const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    es: { type: String, required: true }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'chest_biceps',
      'back_triceps', 
      'legs_shoulders',
      'core',
      'cardio',
      'yoga',
      'full_body'
    ]
  },
  environment: {
    type: String,
    required: true,
    enum: ['gym', 'home', 'both']
  },
  difficulty: {
    beginner: {
      sets: { type: Number, required: true },
      reps: { type: String, required: true }
    },
    intermediate: {
      sets: { type: Number, required: true },
      reps: { type: String, required: true }
    },
    advanced: {
      sets: { type: Number, required: true },
      reps: { type: String, required: true }
    }
  },
  description: {
    en: { type: String, required: true },
    es: { type: String, required: true }
  },
  tips: {
    en: { type: String, required: true },
    es: { type: String, required: true }
  },
  alternatives: {
    en: [{ type: String }],
    es: [{ type: String }]
  },
  videoUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
exerciseSchema.index({ category: 1, environment: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);