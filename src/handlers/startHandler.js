const User = require('../models/User');
const { getText, getLanguageKeyboard } = require('../utils/i18n');

async function startHandler(ctx) {
  try {
    const telegramId = ctx.from.id.toString();
    const firstName = ctx.from.first_name;
    const username = ctx.from.username;

    // Find or create user
    let user = await User.findOne({ telegramId });
    
    if (!user) {
      // New user - show language selection
      await ctx.reply(getText('welcome_new'), {
        reply_markup: getLanguageKeyboard()
      });
      return;
    }

    // Existing user - show main menu
    const lastWorkoutText = user.lastWorkout 
      ? `${user.lastWorkout.category} (${user.lastWorkout.date.toLocaleDateString()})`
      : 'None yet';

    await ctx.reply(
      getText('welcome_back', user.language, {
        name: firstName,
        lastWorkout: lastWorkoutText
      }),
      {
        reply_markup: getMainMenuKeyboard(user.language)
      }
    );

  } catch (error) {
    console.error('Error in startHandler:', error);
    await ctx.reply(getText('error_occurred'));
  }
}

function getMainMenuKeyboard(language = 'en') {
  return {
    inline_keyboard: [
      [
        { 
          text: getText('choose_environment', language), 
          callback_data: 'choose_environment' 
        }
      ],
      [
        { 
          text: "📊 History", 
          callback_data: 'show_history' 
        },
        { 
          text: getText('choose_language', language), 
          callback_data: 'change_language' 
        }
      ]
    ]
  };
}

function getEnvironmentKeyboard(language = 'en') {
  return {
    inline_keyboard: [
      [
        { 
          text: getText('gym', language), 
          callback_data: 'environment_gym' 
        },
        { 
          text: getText('home', language), 
          callback_data: 'environment_home' 
        }
      ],
      [
        { 
          text: getText('back_to_menu', language), 
          callback_data: 'start_menu' 
        }
      ]
    ]
  };
}

function getCategoryKeyboard(language = 'en') {
  return {
    inline_keyboard: [
      [
        { 
          text: getText('full_body', language), 
          callback_data: 'routine_full_body' 
        }
      ],
      [
        { 
          text: getText('chest_biceps', language), 
          callback_data: 'routine_chest_biceps' 
        },
        { 
          text: getText('back_triceps', language), 
          callback_data: 'routine_back_triceps' 
        }
      ],
      [
        { 
          text: getText('legs_shoulders', language), 
          callback_data: 'routine_legs_shoulders' 
        },
        { 
          text: getText('core', language), 
          callback_data: 'routine_core' 
        }
      ],
      [
        { 
          text: getText('cardio', language), 
          callback_data: 'routine_cardio' 
        },
        { 
          text: getText('yoga', language), 
          callback_data: 'routine_yoga' 
        }
      ],
      [
        { 
          text: getText('back_to_menu', language), 
          callback_data: 'start_menu' 
        }
      ]
    ]
  };
}

module.exports = {
  startHandler,
  getMainMenuKeyboard,
  getEnvironmentKeyboard, 
  getCategoryKeyboard
};