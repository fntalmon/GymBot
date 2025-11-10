const User = require('../models/User');
const { getText } = require('../utils/i18n');

async function feedbackHandler(ctx) {
  try {
    const telegramId = ctx.from.id.toString();
    const feedbackType = ctx.callbackQuery.data.replace('feedback_', '');
    
    let user = await User.findOne({ telegramId });
    if (!user) {
      await ctx.answerCbQuery(getText('error_occurred'));
      return;
    }

    const language = user.language;

    // Save feedback to last workout
    if (user.workoutHistory.length > 0) {
      const lastWorkout = user.workoutHistory[user.workoutHistory.length - 1];
      lastWorkout.feedback = feedbackType;
      
      // Adjust user difficulty based on feedback
      await adjustUserDifficulty(user, feedbackType);
      
      await user.save();
    }

    // Send thank you message
    await ctx.editMessageText(
      getText('feedback_thanks', language),
      {
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: getText('back_to_menu', language), 
                callback_data: 'start_menu' 
              }
            ]
          ]
        }
      }
    );

    await ctx.answerCbQuery();

  } catch (error) {
    console.error('Error in feedbackHandler:', error);
    await ctx.answerCbQuery(getText('error_occurred'));
  }
}

/**
 * Adjust user difficulty based on feedback
 */
async function adjustUserDifficulty(user, feedbackType) {
  const currentDifficulty = user.difficulty;
  
  // Count recent feedback to make informed decisions
  const recentWorkouts = user.workoutHistory.slice(-5); // Last 5 workouts
  const feedbackCounts = {
    too_easy: 0,
    perfect: 0,
    too_hard: 0
  };

  recentWorkouts.forEach(workout => {
    if (workout.feedback) {
      feedbackCounts[workout.feedback]++;
    }
  });

  // Add current feedback
  feedbackCounts[feedbackType]++;

  // Determine if difficulty should change
  let newDifficulty = currentDifficulty;

  if (feedbackCounts.too_easy >= 3 && currentDifficulty !== 'advanced') {
    // User finds workouts too easy consistently
    if (currentDifficulty === 'beginner') {
      newDifficulty = 'intermediate';
    } else if (currentDifficulty === 'intermediate') {
      newDifficulty = 'advanced';
    }
  } else if (feedbackCounts.too_hard >= 3 && currentDifficulty !== 'beginner') {
    // User finds workouts too hard consistently
    if (currentDifficulty === 'advanced') {
      newDifficulty = 'intermediate';
    } else if (currentDifficulty === 'intermediate') {
      newDifficulty = 'beginner';
    }
  }

  // Update difficulty if changed
  if (newDifficulty !== currentDifficulty) {
    user.difficulty = newDifficulty;
    console.log(`User ${user.telegramId} difficulty adjusted from ${currentDifficulty} to ${newDifficulty}`);
  }
}

module.exports = {
  feedbackHandler,
  adjustUserDifficulty
};