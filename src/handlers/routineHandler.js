const User = require('../models/User');
const { getText } = require('../utils/i18n');
const { getCategoryKeyboard, getEnvironmentKeyboard } = require('./startHandler');

// Simple in-memory session storage (in production, use Redis)
const userSessions = new Map();

async function routineHandler(ctx) {
  try {
    const telegramId = ctx.from.id.toString();
    const callbackData = ctx.callbackQuery.data;
    
    let user = await User.findOne({ telegramId });
    if (!user) {
      await ctx.answerCbQuery(getText('error_occurred'));
      return;
    }

    const language = user.language;
    let session = userSessions.get(telegramId) || {};

    if (callbackData.startsWith('environment_')) {
      await handleEnvironmentSelection(ctx, user, session);
    } else if (callbackData.startsWith('routine_')) {
      await handleCategorySelection(ctx, user, session);
    }

    await ctx.answerCbQuery();

  } catch (error) {
    console.error('Error in routineHandler:', error);
    await ctx.answerCbQuery(getText('error_occurred'));
  }
}

async function handleEnvironmentSelection(ctx, user, session) {
  const environment = ctx.callbackQuery.data.replace('environment_', '');
  const language = user.language;
  
  session.environment = environment;
  userSessions.set(user.telegramId, session);

  await ctx.editMessageText(
    getText('choose_category', language),
    {
      reply_markup: getCategoryKeyboard(language)
    }
  );
}

async function handleCategorySelection(ctx, user, session) {
  const category = ctx.callbackQuery.data.replace('routine_', '');
  const language = user.language;
  
  session.category = category;
  userSessions.set(user.telegramId, session);

  // Simple routine response (we'll improve this later)
  const routineText = `🏋️ Here's your ${getText(category, language)} routine!\n\n` +
    `1️⃣ Exercise 1 - 3x12\n` +
    `2️⃣ Exercise 2 - 3x10\n` +
    `3️⃣ Exercise 3 - 3x15\n\n` +
    `Environment: ${getText(session.environment, language)}`;

  await ctx.editMessageText(
    routineText,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: getText('alternative_routine', language), 
              callback_data: 'alternative_routine' 
            }
          ],
          [
            { 
              text: getText('too_easy', language), 
              callback_data: 'feedback_too_easy' 
            },
            { 
              text: getText('perfect', language), 
              callback_data: 'feedback_perfect' 
            },
            { 
              text: getText('too_hard', language), 
              callback_data: 'feedback_too_hard' 
            }
          ],
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

  // Save to user history
  const workout = {
    category: session.category,
    environment: session.environment,
    difficulty: user.difficulty,
    exercises: ['Exercise 1', 'Exercise 2', 'Exercise 3'],
    date: new Date()
  };

  user.workoutHistory.push(workout);
  user.lastWorkout = {
    category: session.category,
    environment: session.environment,
    date: new Date(),
    exercises: ['Exercise 1', 'Exercise 2', 'Exercise 3']
  };

  await user.save();
}

module.exports = routineHandler;