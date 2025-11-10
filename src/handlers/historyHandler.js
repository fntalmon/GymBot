const User = require('../models/User');
const { getText } = require('../utils/i18n');

async function historyHandler(ctx) {
  try {
    const telegramId = ctx.from.id.toString();
    
    let user = await User.findOne({ telegramId });
    if (!user) {
      await ctx.reply(getText('error_occurred'));
      return;
    }

    const language = user.language;

    if (user.workoutHistory.length === 0) {
      await ctx.reply(
        "📊 No workouts yet! Let's get started with your first routine.",
        {
          reply_markup: {
            inline_keyboard: [[
              { 
                text: getText('back_to_menu', language), 
                callback_data: 'start_menu' 
              }
            ]]
          }
        }
      );
      return;
    }

    // Generate history message
    let message = `📊 *Your Workout History*\n\n`;
    message += `Total workouts: ${user.workoutHistory.length}\n\n`;

    // Show last 5 workouts
    const recentWorkouts = user.workoutHistory.slice(-5).reverse();
    message += '📝 *Recent workouts:*\n';

    recentWorkouts.forEach((workout, index) => {
      const categoryText = getText(workout.category, language);
      const environmentText = getText(workout.environment, language);
      const date = workout.date.toLocaleDateString();
      
      message += `${index + 1}. ${categoryText} (${environmentText}) - ${date}\n`;
    });

    await ctx.reply(message, {
      parse_mode: 'Markdown',
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
    });

  } catch (error) {
    console.error('Error in historyHandler:', error);
    await ctx.reply(getText('error_occurred'));
  }
}

async function handleHistoryCallback(ctx) {
  const telegramId = ctx.from.id.toString();

  try {
    const user = await User.findOne({ telegramId });
    const language = user?.language || 'en';

    await historyHandler(ctx);
    await ctx.answerCbQuery();

  } catch (error) {
    console.error('Error in handleHistoryCallback:', error);
    await ctx.answerCbQuery(getText('error_occurred'));
  }
}

module.exports = {
  historyHandler,
  handleHistoryCallback
};