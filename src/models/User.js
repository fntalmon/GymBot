const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  username: String,
  language: {
    type: String,
    enum: ['en', 'es'],
    default: 'en'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  preferredEnvironment: {
    type: String,
    enum: ['gym', 'home'],
    default: 'gym'
  },
  lastWorkout: {
    type: {
      category: String,
      environment: String,
      date: Date,
      exercises: [String]
    }
  },
  workoutHistory: [{
    category: String,
    environment: String,
    difficulty: String,
    exercises: [String],
    feedback: {
      type: {
        type: String,
        enum: ['too_easy', 'perfect', 'too_hard'],
      },
      routineId: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    totalWorkouts: {
      type: Number,
      default: 0
    },
    favoriteCategory: String,
    currentStreak: {
      type: Number,
      default: 0
    },
    lastWorkoutDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);