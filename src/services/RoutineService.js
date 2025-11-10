const Exercise = require('../models/Exercise');

class RoutineService {
  
  /**
   * Generate a workout routine based on category, environment, and difficulty
   */
  static async generateRoutine(category, environment, difficulty, language = 'en') {
    try {
      console.log(`🔍 Generating routine for: ${category}, ${environment}, ${difficulty}`);

      let selectedExercises = [];

      if (category === 'full_body') {
        // For full body, mix exercises from different categories
        selectedExercises = await this.generateFullBodyRoutine(environment, difficulty);
      } else {
        // For specific category, get exercises from that category
        selectedExercises = await this.generateCategoryRoutine(
          category, 
          environment, 
          difficulty
        );
      }

      if (!selectedExercises || selectedExercises.length === 0) {
        throw new Error(`No exercises found for category: ${category}`);
      }

      // Format exercises for display
      const formattedExercises = this.formatRoutineForDisplay(selectedExercises, language, difficulty);
      
      // Return complete routine object
      return {
        category,
        environment,
        difficulty,
        language,
        exercises: formattedExercises,
        id: `${Date.now()}` // Simple timestamp ID to avoid parsing issues
      };

    } catch (error) {
      console.error('Error generating routine:', error);
      throw error;
    }
  }

  /**
   * Generate a full body routine with exercises from different categories
   */
  static async generateFullBodyRoutine(environment, difficulty) {
    console.log(`🔍 Generating full body routine for ${environment}`);
    
    // Get exercises from different categories for variety
    const categories = ['chest_biceps', 'back_triceps', 'legs_shoulders', 'core'];
    let exercises = [];

    for (const category of categories) {
      const categoryExercises = await Exercise.find({
        category,
        $or: [{ environment }, { environment: 'both' }]
      }).limit(2); // Get 2 exercises from each category
      
      exercises.push(...categoryExercises);
    }

    console.log(`📊 Found ${exercises.length} exercises for full body routine`);
    return this.shuffleArray(exercises).slice(0, 6); // Return 6 exercises total
  }

  /**
   * Generate routine for specific category
   */
  static async generateCategoryRoutine(category, environment, difficulty, routineConfig) {
    console.log(`🔍 generateCategoryRoutine called with:`, {
      category,
      environment, 
      difficulty
    });

    // Get exercises from the specific category
    const exercises = await Exercise.find({
      category,
      $or: [{ environment }, { environment: 'both' }]
    });
    
    console.log(`📊 Found ${exercises.length} exercises for category ${category}`);

    if (exercises.length === 0) {
      throw new Error(`No exercises found for category: ${category}`);
    }

    // Determine how many exercises to select based on category
    const exerciseCount = this.getExerciseCountForCategory(category);
    
    // Randomly select exercises
    const selected = this.shuffleArray(exercises).slice(0, exerciseCount);
    
    console.log(`🎯 Selected ${selected.length} exercises for routine`);
    return selected;
  }

  /**
   * Get number of exercises per category
   */
  static getExerciseCountForCategory(category) {
    const counts = {
      full_body: 6,
      chest_biceps: 5,
      back_triceps: 5, 
      legs_shoulders: 5,
      core: 4,
      cardio: 5
    };
    return counts[category] || 5;
  }

  /**
   * Get muscle group distribution for full body workouts
   */
  static getFullBodyDistribution() {
    return {
      chest: 2,
      back: 2, 
      legs: 2,
      shoulders: 1,
      core: 1
    };
  }

  /**
   * Format exercises for telegram display
   */
  static formatRoutineForDisplay(exercises, language, difficulty) {
    return exercises.map((exercise, index) => {
      const name = exercise.name[language] || exercise.name.en;
      const difficultyLevel = exercise.difficulty[difficulty] || exercise.difficulty.intermediate;
      const sets = difficultyLevel.sets;
      const reps = difficultyLevel.reps;

      return {
        number: index + 1,
        name,
        sets: `${sets} sets x ${reps}`,
        alternatives: exercise.alternatives[language] || exercise.alternatives.en,
        video: exercise.videoUrl,
        tips: exercise.tips[language] || exercise.tips.en,
        description: exercise.description[language] || exercise.description.en
      };
    });
  }

  /**
   * Get alternative routine by excluding some exercises
   */
  static async getAlternativeRoutine(category, environment, difficulty, language, excludeIds = []) {
    try {
      // Get exercises excluding the ones already shown
      const exercises = await Exercise.find({
        category,
        $or: [{ environment }, { environment: 'both' }],
        _id: { $nin: excludeIds }
      });

      if (exercises.length === 0) {
        // If no alternatives, return original query without exclusions
        return this.generateRoutine(category, environment, difficulty, language);
      }

      // Select exercises based on category requirements
      const selectedCount = this.getExerciseCountForCategory(category);
      const selectedExercises = this.shuffleArray(exercises).slice(0, selectedCount);

      return this.formatRoutineForDisplay(selectedExercises, language, difficulty);

    } catch (error) {
      console.error('Error getting alternative routine:', error);
      throw error;
    }
  }

  /**
   * Shuffle array utility
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
   * Get available categories
   */
  static getAvailableCategories() {
    return [
      'full_body',
      'chest_biceps', 
      'back_triceps',
      'legs_shoulders',
      'core',
      'cardio',
      'yoga'
    ];
  }

  /**
   * Get exercises count by category and environment for stats
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
        }
      ]);

      return stats;
    } catch (error) {
      console.error('Error getting exercise stats:', error);
      return [];
    }
  }

  /**
   * Create a personalized routine based on user history and preferences
   */
  static async getPersonalizedRoutine(user, environment) {
    try {
      const { language, difficulty, workoutHistory } = user;
      
      // Analyze user's workout history to suggest variety
      const recentCategories = workoutHistory
        .slice(-5)
        .map(workout => workout.category);
        
      // Find least recent category for variety
      const allCategories = this.getAvailableCategories();
      const suggestedCategory = allCategories.find(cat => 
        !recentCategories.includes(cat)
      ) || allCategories[0];

      return this.generateRoutine(suggestedCategory, environment, difficulty, language);
      
    } catch (error) {
      console.error('Error generating personalized routine:', error);
      throw error;
    }
  }
}

module.exports = RoutineService;