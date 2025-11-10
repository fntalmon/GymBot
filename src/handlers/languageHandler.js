const User = require('../models/User');
const { getText, getLanguageKeyboard } = require('../utils/i18n');
const { getMainMenuKeyboard } = require('./startHandler');

async function languageHandler(ctx) {
  try {
    const telegramId = ctx.from.id.toString();
    let user = await User.findOne({ telegramId });
    const currentLanguage = user?.language || 'en';

    await ctx.reply(
      getText('choose_language', currentLanguage),
      {
        reply_markup: getLanguageKeyboard()
      }
    );

  } catch (error) {
    console.error('Error in languageHandler:', error);
    await ctx.reply(getText('error_occurred'));
  }
}

async function handleLanguageSelection(ctx) {
  try {
    const telegramId = ctx.from.id.toString();
    const firstName = ctx.from.first_name;
    const username = ctx.from.username;
    const selectedLanguage = ctx.callbackQuery.data.replace('lang_', '');

    // Find or create user
    let user = await User.findOne({ telegramId });
    
    if (!user) {
      // Create new user
      user = new User({
        telegramId,
        firstName,
        username,
        language: selectedLanguage
      });
      
      await user.save();

      // Welcome new user and show main menu
      await ctx.editMessageText(
        getText('language_updated', selectedLanguage),
        { reply_markup: getMainMenuKeyboard(selectedLanguage) }
      );
      
    } else {
      // Update existing user's language
      user.language = selectedLanguage;
      await user.save();

      await ctx.editMessageText(
        getText('language_updated', selectedLanguage),
        { reply_markup: getMainMenuKeyboard(selectedLanguage) }
      );
    }

    await ctx.answerCbQuery();

  } catch (error) {
    console.error('Error in handleLanguageSelection:', error);
    await ctx.answerCbQuery(getText('error_occurred'));
  }
}

module.exports = {
  languageHandler,
  handleLanguageSelection
};