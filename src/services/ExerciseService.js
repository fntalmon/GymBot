const Exercise = require('../models/Exercise');

class ExerciseService {
  
  /**
   * Get exercises by filters
   */
  static async getExercises(filters = {}) {
    try {
      const query = {};
      
      if (filters.category) {
        query.category = filters.category;
      }
      
      if (filters.environment) {
        query.$or = [
          { environment: filters.environment },
          { environment: 'both' }
        ];
      }
      
      if (filters.difficulty) {
        query.difficulty = { $in: [filters.difficulty, 'intermediate'] }; // Include intermediate as fallback
      }
      
      if (filters.muscleGroup) {
        query.muscleGroup = filters.muscleGroup;
      }

      const exercises = await Exercise.find(query);
      return exercises;
      
    } catch (error) {
      console.error('Error getting exercises:', error);
      return [];
    }
  }

  /**
   * Get random exercises from a category
   */
  static async getRandomExercises(category, environment, difficulty, count = 5) {
    try {
      const exercises = await this.getExercises({
        category,
        environment,
        difficulty
      });

      // Shuffle and return requested count
      const shuffled = this.shuffleArray(exercises);
      return shuffled.slice(0, count);
      
    } catch (error) {
      console.error('Error getting random exercises:', error);
      return [];
    }
  }

  /**
   * Get exercises by muscle group with balanced selection
   */
  static async getExercisesByMuscleGroups(muscleGroups, environment, difficulty) {
    try {
      let allExercises = [];

      for (const [muscleGroup, count] of Object.entries(muscleGroups)) {
        const exercises = await this.getExercises({
          muscleGroup,
          environment,
          difficulty
        });

        const selected = this.shuffleArray(exercises).slice(0, count);
        allExercises.push(...selected);
      }

      return this.shuffleArray(allExercises);
      
    } catch (error) {
      console.error('Error getting exercises by muscle groups:', error);
      return [];
    }
  }

  /**
   * Search exercises by name or description
   */
  static async searchExercises(searchTerm, language = 'en') {
    try {
      const regex = new RegExp(searchTerm, 'i'); // Case insensitive
      
      const exercises = await Exercise.find({
        $or: [
          { [`name.${language}`]: regex },
          { [`description.${language}`]: regex },
          { [`alternative.${language}`]: regex }
        ]
      });

      return exercises;
      
    } catch (error) {
      console.error('Error searching exercises:', error);
      return [];
    }
  }

  /**
   * Get exercise statistics
   */
  static async getExerciseStats() {
    try {
      const stats = await Exercise.aggregate([
        {
          $group: {
            _id: {
              category: '$category',
              environment: '$environment',
              difficulty: '$difficulty'
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.category': 1, '_id.environment': 1, '_id.difficulty': 1 }
        }
      ]);

      // Also get total counts
      const totalStats = await Exercise.aggregate([
        {
          $group: {
            _id: null,
            totalExercises: { $sum: 1 },
            categories: { $addToSet: '$category' },
            environments: { $addToSet: '$environment' },
            difficulties: { $addToSet: '$difficulty' }
          }
        }
      ]);

      return {
        detailed: stats,
        summary: totalStats[0] || {
          totalExercises: 0,
          categories: [],
          environments: [],
          difficulties: []
        }
      };
      
    } catch (error) {
      console.error('Error getting exercise stats:', error);
      return { detailed: [], summary: {} };
    }
  }

  /**
   * Add new exercise to database
   */
  static async addExercise(exerciseData) {
    try {
      const exercise = new Exercise(exerciseData);
      await exercise.save();
      
      console.log(`✅ Added new exercise: ${exercise.name.en}`);
      return exercise;
      
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }
  }

  /**
   * Update existing exercise
   */
  static async updateExercise(exerciseId, updateData) {
    try {
      const exercise = await Exercise.findByIdAndUpdate(
        exerciseId,
        updateData,
        { new: true }
      );
      
      if (!exercise) {
        throw new Error('Exercise not found');
      }
      
      return exercise;
      
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  }

  /**
   * Delete exercise
   */
  static async deleteExercise(exerciseId) {
    try {
      const exercise = await Exercise.findByIdAndDelete(exerciseId);
      
      if (!exercise) {
        throw new Error('Exercise not found');
      }
      
      console.log(`🗑️ Deleted exercise: ${exercise.name.en}`);
      return exercise;
      
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }

  /**
   * Get exercises suitable for home workout
   */
  static async getHomeExercises(category = null, difficulty = 'intermediate') {
    try {
      const filters = {
        environment: 'home',
        difficulty
      };
      
      if (category) {
        filters.category = category;
      }
      
      return this.getExercises(filters);
      
    } catch (error) {
      console.error('Error getting home exercises:', error);
      return [];
    }
  }

  /**
   * Get exercises suitable for gym workout
   */
  static async getGymExercises(category = null, difficulty = 'intermediate') {
    try {
      const filters = {
        environment: 'gym',
        difficulty
      };
      
      if (category) {
        filters.category = category;
      }
      
      return this.getExercises(filters);
      
    } catch (error) {
      console.error('Error getting gym exercises:', error);
      return [];
    }
  }

  /**
   * Format exercise for display in bot
   */
  static formatExerciseForBot(exercise, language = 'en', difficulty = 'intermediate', index = 1) {
    const name = exercise.name[language] || exercise.name.en;
    const alternative = exercise.alternative[language] || exercise.alternative.en;
    const sets = exercise.sets[difficulty] || exercise.sets.intermediate;
    const tips = exercise.tips[language] || exercise.tips.en;
    const restTime = exercise.restTime[difficulty] || exercise.restTime.intermediate;

    return {
      number: index,
      name,
      sets,
      alternative,
      video: exercise.videoUrl,
      tips,
      restTime
    };
  }

  /**
   * Utility: Shuffle array
   */
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get exercise recommendations based on user history
   */
  static async getRecommendedExercises(user, category, environment) {
    try {
      // Get user's recent exercises to avoid repetition
      const recentExercises = user.workoutHistory
        .slice(-3)
        .flatMap(workout => workout.exercises);

      // Get all exercises for the category
      let exercises = await this.getExercises({
        category,
        environment,
        difficulty: user.difficulty
      });

      // Filter out recently done exercises for variety
      exercises = exercises.filter(exercise => {
        const exerciseName = exercise.name[user.language] || exercise.name.en;
        return !recentExercises.includes(exerciseName);
      });

      // If no new exercises, return all exercises
      if (exercises.length === 0) {
        exercises = await this.getExercises({
          category,
          environment,
          difficulty: user.difficulty
        });
      }

      return exercises;
      
    } catch (error) {
      console.error('Error getting recommended exercises:', error);
      return [];
    }
  }
}

module.exports = ExerciseService;