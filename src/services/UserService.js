const User = require('../models/User');

class UserService {
  
  /**
   * Find or create a user from Telegram data
   */
  static async findOrCreateUser(telegramId, firstName, username = null) {
    try {
      let user = await User.findOne({ telegramId });
      
      if (!user) {
        user = new User({
          telegramId,
          firstName,
          username,
          language: 'en', // Default language
          difficulty: 'intermediate'
        });
        
        await user.save();
        console.log(`✅ Created new user: ${firstName} (${telegramId})`);
      } else {
        // Update user info if changed
        if (user.firstName !== firstName || user.username !== username) {
          user.firstName = firstName;
          user.username = username;
          await user.save();
        }
      }
      
      return user;
    } catch (error) {
      console.error('Error finding/creating user:', error);
      throw error;
    }
  }

  /**
   * Update user language preference
   */
  static async updateLanguage(telegramId, language) {
    try {
      const user = await User.findOneAndUpdate(
        { telegramId },
        { language },
        { new: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      console.error('Error updating user language:', error);
      throw error;
    }
  }

  /**
   * Update user difficulty level
   */
  static async updateDifficulty(telegramId, difficulty) {
    try {
      const user = await User.findOneAndUpdate(
        { telegramId },
        { difficulty },
        { new: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      console.error('Error updating user difficulty:', error);
      throw error;
    }
  }

  /**
   * Increase user difficulty level
   */
  static increaseDifficulty(currentDifficulty) {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(currentDifficulty);
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    return currentDifficulty; // Already at max
  }

  /**
   * Decrease user difficulty level
   */
  static decreaseDifficulty(currentDifficulty) {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(currentDifficulty);
    if (currentIndex > 0) {
      return levels[currentIndex - 1];
    }
    return currentDifficulty; // Already at min
  }

  /**
   * Add workout to user history
   */
  static async addWorkoutToHistory(telegramId, workoutData) {
    try {
      const user = await User.findOne({ telegramId });
      if (!user) {
        throw new Error('User not found');
      }

      const workout = {
        category: workoutData.category,
        environment: workoutData.environment,
        difficulty: workoutData.difficulty,
        exercises: workoutData.exercises,
        date: new Date()
      };

      user.workoutHistory.push(workout);
      
      // Update last workout
      user.lastWorkout = {
        category: workoutData.category,
        environment: workoutData.environment,
        date: new Date(),
        exercises: workoutData.exercises
      };

      await user.save();
      return user;
      
    } catch (error) {
      console.error('Error adding workout to history:', error);
      throw error;
    }
  }

  /**
   * Add feedback to last workout
   */
  static async addFeedbackToLastWorkout(telegramId, feedback) {
    try {
      const user = await User.findOne({ telegramId });
      if (!user || user.workoutHistory.length === 0) {
        throw new Error('User or workout not found');
      }

      // Add feedback to last workout
      const lastWorkout = user.workoutHistory[user.workoutHistory.length - 1];
      lastWorkout.feedback = feedback;

      // Auto-adjust difficulty based on consistent feedback
      await this.autoAdjustDifficulty(user, feedback);
      
      await user.save();
      return user;
      
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  /**
   * Auto-adjust user difficulty based on feedback patterns
   */
  static async autoAdjustDifficulty(user, newFeedback) {
    const recentWorkouts = user.workoutHistory.slice(-5);
    const feedbackCounts = {
      too_easy: 0,
      perfect: 0,
      too_hard: 0
    };

    // Count recent feedback including new one
    recentWorkouts.forEach(workout => {
      if (workout.feedback) {
        feedbackCounts[workout.feedback]++;
      }
    });
    
    feedbackCounts[newFeedback]++;

    const currentDifficulty = user.difficulty;
    let newDifficulty = currentDifficulty;

    // Adjust if consistent pattern (3+ of same feedback)
    if (feedbackCounts.too_easy >= 3 && currentDifficulty !== 'advanced') {
      newDifficulty = currentDifficulty === 'beginner' ? 'intermediate' : 'advanced';
    } else if (feedbackCounts.too_hard >= 3 && currentDifficulty !== 'beginner') {
      newDifficulty = currentDifficulty === 'advanced' ? 'intermediate' : 'beginner';
    }

    if (newDifficulty !== currentDifficulty) {
      user.difficulty = newDifficulty;
      console.log(`🎯 Auto-adjusted ${user.firstName}'s difficulty: ${currentDifficulty} → ${newDifficulty}`);
    }
  }

  /**
   * Get user workout statistics
   */
  static async getUserStats(telegramId) {
    try {
      const user = await User.findOne({ telegramId });
      if (!user) {
        return null;
      }

      const stats = {
        totalWorkouts: user.workoutHistory.length,
        favoriteCategory: null,
        recentStreak: 0,
        categoryCounts: {},
        feedbackStats: {
          too_easy: 0,
          perfect: 0,
          too_hard: 0
        }
      };

      // Calculate category distribution
      user.workoutHistory.forEach(workout => {
        stats.categoryCounts[workout.category] = (stats.categoryCounts[workout.category] || 0) + 1;
        
        if (workout.feedback) {
          stats.feedbackStats[workout.feedback]++;
        }
      });

      // Find favorite category
      if (Object.keys(stats.categoryCounts).length > 0) {
        stats.favoriteCategory = Object.keys(stats.categoryCounts).reduce((a, b) => 
          stats.categoryCounts[a] > stats.categoryCounts[b] ? a : b
        );
      }

      // Calculate current streak
      stats.recentStreak = this.calculateWorkoutStreak(user.workoutHistory);

      return stats;
      
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }

  /**
   * Calculate workout streak (consecutive days with workouts)
   */
  static calculateWorkoutStreak(workoutHistory) {
    if (workoutHistory.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    // Check each day going backwards
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dayWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === currentDate.getTime();
      });

      if (dayWorkouts.length > 0) {
        streak++;
      } else if (streak > 0) {
        // Found a gap after starting streak
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  /**
   * Get users who haven't worked out recently (for potential reminders)
   */
  static async getInactiveUsers(daysInactive = 3) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

      const inactiveUsers = await User.find({
        $or: [
          { 'stats.lastWorkoutDate': { $lt: cutoffDate } },
          { 'stats.lastWorkoutDate': { $exists: false } }
        ]
      });

      return inactiveUsers;
      
    } catch (error) {
      console.error('Error getting inactive users:', error);
      return [];
    }
  }

  /**
   * Get recommended next workout for user
   */
  static getRecommendedCategory(user) {
    if (user.workoutHistory.length === 0) {
      return 'full_body'; // Default for new users
    }

    // Get last 3 workouts
    const recentWorkouts = user.workoutHistory.slice(-3);
    const recentCategories = recentWorkouts.map(w => w.category);

    // Suggest variety based on what they haven't done recently
    const allCategories = ['full_body', 'chest_biceps', 'back_triceps', 'legs_shoulders', 'core', 'cardio', 'yoga'];
    const unusedCategories = allCategories.filter(cat => !recentCategories.includes(cat));

    if (unusedCategories.length > 0) {
      return unusedCategories[Math.floor(Math.random() * unusedCategories.length)];
    }

    // If all categories used recently, suggest full_body
    return 'full_body';
  }
}

module.exports = UserService;