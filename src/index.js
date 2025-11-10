const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models and services
const User = require('./models/User');
const Exercise = require('./models/Exercise');
const RoutineService = require('./services/RoutineService');
const UserService = require('./services/UserService');
const ExerciseService = require('./services/ExerciseService');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Simple handlers for now
bot.start(async (ctx) => {
  try {
    const telegramId = ctx.from.id.toString();
    const firstName = ctx.from.first_name;

    // Find or create user
    let user = await User.findOne({ telegramId });
    
    if (!user) {
      // New user - show language selection
      await ctx.reply('🤖 ¡Hola! ¡Bienvenido a GymBot!\n\nHello! Welcome to GymBot!\n\nChoose your language / Elige tu idioma:', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🇪🇸 Español', callback_data: 'lang_es' },
              { text: '🇺🇸 English', callback_data: 'lang_en' }
            ]
          ]
        }
      });
      return;
    }

    // Existing user - show main menu
    const existingUser = await User.findOne({ telegramId });
    
    const mainMenuText = existingUser.language === 'es' 
      ? `¡Hola ${firstName}! 🏋️‍♂️\n\n🎯 ¿Qué quieres hacer hoy?`
      : `Hello ${firstName}! 🏋️‍♂️\n\n🎯 What would you like to do today?`;

    const mainMenu = {
      inline_keyboard: [
        [
          { 
            text: existingUser.language === 'es' ? '💪 Empezar Entrenamiento' : '💪 Start Workout', 
            callback_data: 'start_workout' 
          }
        ],
        [
          { 
            text: existingUser.language === 'es' ? '📊 Ver Mi Historial' : '📊 View My History', 
            callback_data: 'show_history' 
          }
        ],
        [
          { 
            text: existingUser.language === 'es' ? '⚙️ Configuración' : '⚙️ Settings', 
            callback_data: 'settings' 
          }
        ]
      ]
    };

    await ctx.reply(mainMenuText, {
      reply_markup: mainMenu
    });

  } catch (error) {
    console.error('Error in start:', error);
    await ctx.reply('❌ Hubo un error. Intenta /start de nuevo.');
  }
});

// Language selection
bot.action(['lang_es', 'lang_en'], async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Answer the callback query
    
    const language = ctx.callbackQuery.data === 'lang_es' ? 'es' : 'en';
    const telegramId = ctx.from.id.toString();
    const firstName = ctx.from.first_name;
    const username = ctx.from.username;

    // Create user
    const user = new User({
      telegramId,
      firstName,
      username,
      language,
      difficulty: 'intermediate',
      joinDate: new Date()
    });
    
    await user.save();

    const welcomeText = language === 'es' 
      ? `¡Perfecto ${firstName}! 🎉\n\n¡Bienvenido a GymBot! Soy tu asistente personal de gimnasio.\n\n¿Qué tipo de entrenamiento prefieres hoy?`
      : `Perfect ${firstName}! 🎉\n\nWelcome to GymBot! I'm your personal gym assistant.\n\nWhat type of workout do you prefer today?`;

    const mainMenu = {
      inline_keyboard: [
        [
          { text: language === 'es' ? '🏋️ Gimnasio' : '🏋️ Gym Workout', callback_data: 'workout_gym' },
          { text: language === 'es' ? '🏠 Casa' : '🏠 Home Workout', callback_data: 'workout_home' }
        ],
        [
          { text: '🏃 Cardio', callback_data: 'workout_cardio' },
          { text: language === 'es' ? '📊 Historial' : '📊 History', callback_data: 'show_history' }
        ]
      ]
    };

    await ctx.editMessageText(welcomeText, {
      reply_markup: mainMenu
    });

  } catch (error) {
    console.error('Error in language selection:', error);
    await ctx.reply('❌ Error. Try /start again.');
  }
});

// Start workout - show environment selection
bot.action('start_workout', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const environmentText = user.language === 'es' 
      ? '🏋️‍♂️ ¿Dónde vas a entrenar hoy?'
      : '🏋️‍♂️ Where are you training today?';

    const environmentMenu = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '🏋️ Gimnasio' : '🏋️ Gym Workout', 
            callback_data: 'workout_gym' 
          },
          { 
            text: user.language === 'es' ? '🏠 Casa' : '🏠 Home Workout', 
            callback_data: 'workout_home' 
          }
        ],
        [
          { 
            text: '🏃 Cardio', 
            callback_data: 'workout_cardio' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🔙 Volver al Menú Principal' : '🔙 Back to Main Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(environmentText, {
      reply_markup: environmentMenu
    });

  } catch (error) {
    console.error('Error in start workout:', error);
    await ctx.reply('❌ Error.');
  }
});

// Back to main menu handler
bot.action('back_to_main', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });
    const firstName = ctx.from.first_name;

    const mainMenuText = user.language === 'es' 
      ? `¡Hola ${firstName}! 🏋️‍♂️\n\n🎯 ¿Qué quieres hacer hoy?`
      : `Hello ${firstName}! 🏋️‍♂️\n\n🎯 What would you like to do today?`;

    const mainMenu = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '💪 Empezar Entrenamiento' : '💪 Start Workout', 
            callback_data: 'start_workout' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '📊 Ver Mi Historial' : '📊 View My History', 
            callback_data: 'show_history' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '⚙️ Configuración' : '⚙️ Settings', 
            callback_data: 'settings' 
          }
        ]
      ]
    };

    await ctx.editMessageText(mainMenuText, {
      reply_markup: mainMenu
    });

  } catch (error) {
    console.error('Error going back to main:', error);
    await ctx.reply('❌ Error.');
  }
});

// Workout selection handlers
bot.action(['workout_gym', 'workout_home', 'workout_cardio'], async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Answer the callback query
    
    const workoutType = ctx.callbackQuery.data.replace('workout_', '');
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    // Show category selection for gym and home workouts
    if (workoutType === 'gym' || workoutType === 'home') {
      const categoryText = user.language === 'es' 
        ? `🎯 ${workoutType === 'gym' ? 'Gimnasio' : 'Casa'}\n\n¿Qué tipo de entrenamiento prefieres?`
        : `🎯 ${workoutType === 'gym' ? 'Gym' : 'Home'}\n\nWhat type of workout do you prefer?`;

      const categoryMenu = {
        inline_keyboard: [
          [
            { 
              text: user.language === 'es' ? '💪 Cuerpo Completo' : '💪 Full Body', 
              callback_data: `routine_${workoutType}_full_body` 
            }
          ],
          [
            { 
              text: user.language === 'es' ? '🫸 Pecho & Bíceps' : '🫸 Chest & Biceps', 
              callback_data: `routine_${workoutType}_chest_biceps` 
            },
            { 
              text: user.language === 'es' ? '🫷 Espalda & Tríceps' : '🫷 Back & Triceps', 
              callback_data: `routine_${workoutType}_back_triceps` 
            }
          ],
          [
            { 
              text: user.language === 'es' ? '🦵 Piernas & Hombros' : '🦵 Legs & Shoulders', 
              callback_data: `routine_${workoutType}_legs_shoulders` 
            },
            { 
              text: user.language === 'es' ? '🫸 Core' : '🫸 Core', 
              callback_data: `routine_${workoutType}_core` 
            }
          ],
          [
            { 
              text: user.language === 'es' ? '🧘 Yoga' : '🧘 Yoga', 
              callback_data: `routine_${workoutType}_yoga` 
            }
          ],
          [
            { 
              text: user.language === 'es' ? '🔙 Volver' : '🔙 Back', 
              callback_data: 'start_workout' 
            }
          ]
        ]
      };

      await ctx.editMessageText(categoryText, {
        reply_markup: categoryMenu
      });
    } else if (workoutType === 'cardio') {
      // Generate cardio routine directly
      await generateRoutine(ctx, user, 'cardio', workoutType === 'gym' ? 'gym' : 'home');
    }

  } catch (error) {
    console.error('Error in workout selection:', error);
    await ctx.reply('❌ Error. Try /start again.');
  }
});

// Category routine handlers
bot.action(/^routine_/, async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Important: Answer the callback query
    
    console.log(`🔍 Raw callback_data: "${ctx.callbackQuery.data}"`);
    const parts = ctx.callbackQuery.data.split('_');
    console.log(`🔍 Split parts:`, parts);
    
    // Fix: Join everything after index 2 to reconstruct category name
    const environment = parts[1]; // 'gym' or 'home'
    const category = parts.slice(2).join('_'); // 'full_body', 'chest_biceps', etc.
    
    console.log(`🔍 Parsed - environment: "${environment}", category: "${category}"`);
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    // Show confirmation before generating routine
    const categoryNames = {
      es: {
        full_body: 'Cuerpo Completo',
        chest_biceps: 'Pecho & Bíceps',
        back_triceps: 'Espalda & Tríceps',
        legs_shoulders: 'Piernas & Hombros',
        core: 'Core',
        yoga: 'Yoga',
        cardio: 'Cardio'
      },
      en: {
        full_body: 'Full Body',
        chest_biceps: 'Chest & Biceps',
        back_triceps: 'Back & Triceps',
        legs_shoulders: 'Legs & Shoulders',
        core: 'Core',
        yoga: 'Yoga',
        cardio: 'Cardio'
      }
    };

    const environmentNames = {
      es: { gym: 'Gimnasio', home: 'Casa' },
      en: { gym: 'Gym', home: 'Home' }
    };

    const confirmText = user.language === 'es' 
      ? `🎯 <b>Confirmar Entrenamiento</b>\n\n📍 ${environmentNames.es[environment]}\n🎯 ${categoryNames.es[category]}\n⚡ Nivel: ${user.difficulty === 'beginner' ? 'Principiante' : user.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}\n\n¿Quieres empezar este entrenamiento?`
      : `🎯 <b>Confirm Workout</b>\n\n📍 ${environmentNames.en[environment]}\n🎯 ${categoryNames.en[category]}\n⚡ Level: ${user.difficulty}\n\nDo you want to start this workout?`;

    const confirmButtons = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '✅ Sí, empezar' : '✅ Yes, start', 
            callback_data: `confirm_routine_${environment}_${category}` 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🔄 Cambiar Categoría' : '🔄 Change Category', 
            callback_data: `workout_${environment}` 
          },
          { 
            text: user.language === 'es' ? '🏠 Menú Principal' : '🏠 Main Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(confirmText, {
      reply_markup: confirmButtons,
      parse_mode: 'HTML'
    });

  } catch (error) {
    console.error('Error in routine generation:', error);
    await ctx.answerCbQuery('❌ Error');
    await ctx.reply('❌ Error generating routine. Try again.');
  }
});

// Confirm routine handler
bot.action(/^confirm_routine_/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const parts = ctx.callbackQuery.data.split('_');
    const environment = parts[2];
    const category = parts.slice(3).join('_');
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    console.log(`🎯 Confirmed routine: category=${category}, environment=${environment}, user=${user.firstName}`);
    await generateRoutine(ctx, user, category, environment);

  } catch (error) {
    console.error('Error confirming routine:', error);
    await ctx.reply('❌ Error. Try again.');
  }
});

// Generate routine function
async function generateRoutine(ctx, user, category, environment) {
  try {
    // Show loading message
    const loadingText = user.language === 'es' 
      ? '⏳ Generando tu rutina personalizada...'
      : '⏳ Generating your personalized routine...';
    
    await ctx.editMessageText(loadingText);

    // Generate routine using RoutineService
    console.log(`🎯 Generating routine: category=${category}, environment=${environment}, difficulty=${user.difficulty}`);
    const routine = await RoutineService.generateRoutine(category, environment, user.difficulty, user.language);

    if (!routine || !routine.exercises || routine.exercises.length === 0) {
      const noExercisesText = user.language === 'es' 
        ? '❌ No se encontraron ejercicios para esta categoría. Intenta otra opción.'
        : '❌ No exercises found for this category. Try another option.';
      
      await ctx.editMessageText(noExercisesText);
      return;
    }

    // Format routine message
    const routineText = formatRoutineMessage(routine, user.language);

    // Create workout action buttons (no feedback here)
    const workoutButtons = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '✅ Terminar Entrenamiento' : '✅ Finish Workout', 
            callback_data: `finish_workout_${routine.id}_${category}_${environment}` 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🔄 Nueva Rutina' : '🔄 New Routine', 
            callback_data: `new_routine_${category}_${environment}` 
          },
          { 
            text: user.language === 'es' ? '🏠 Menú Principal' : '🏠 Main Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(routineText, {
      reply_markup: workoutButtons,
      parse_mode: 'HTML'
    });

    // Don't save workout to history yet - wait for user to finish

  } catch (error) {
    console.error('Error in generateRoutine:', error);
    const errorText = user.language === 'es' 
      ? '❌ Error generando rutina. Intenta de nuevo.'
      : '❌ Error generating routine. Try again.';
    
    await ctx.editMessageText(errorText);
  }
}

// Format routine message
function formatRoutineMessage(routine, language = 'es') {
  const title = language === 'es' 
    ? `🎯 <b>Tu Rutina ${routine.category === 'cardio' ? 'de Cardio' : routine.category === 'full_body' ? 'de Cuerpo Completo' : routine.category === 'yoga' ? 'de Yoga' : routine.category}</b>`
    : `🎯 <b>Your ${routine.category === 'cardio' ? 'Cardio' : routine.category === 'full_body' ? 'Full Body' : routine.category === 'yoga' ? 'Yoga' : routine.category} Routine</b>`;

  const environment = language === 'es' 
    ? `📍 ${routine.environment === 'gym' ? 'Gimnasio' : 'Casa'}`
    : `📍 ${routine.environment === 'gym' ? 'Gym' : 'Home'}`;

  const difficulty = language === 'es' 
    ? `⚡ Dificultad: ${routine.difficulty === 'beginner' ? 'Principiante' : routine.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}`
    : `⚡ Difficulty: ${routine.difficulty}`;

  let exercisesText = language === 'es' ? '\n<b>Ejercicios:</b>\n' : '\n<b>Exercises:</b>\n';

  routine.exercises.forEach((exercise, index) => {
    exercisesText += `\n${exercise.number}. <b>${exercise.name}</b>\n`;
    exercisesText += `   ${exercise.sets}\n`;
    if (exercise.alternatives && exercise.alternatives.length > 0) {
      exercisesText += `   <i>${language === 'es' ? 'Alternativas' : 'Alternatives'}: ${exercise.alternatives.join(', ')}</i>\n`;
    }
    if (exercise.tips) {
      exercisesText += `   💡 ${exercise.tips}\n`;
    }
    if (exercise.video) {
      exercisesText += `   🎥 <a href="${exercise.video}">Video</a>\n`;
    }
  });

  const motivationalText = language === 'es' 
    ? '\n💪 <i>¡Dale que puedes! Cada repetición te acerca a tu objetivo.</i>'
    : '\n💪 <i>You got this! Every rep brings you closer to your goal.</i>';

  return `${title}\n${environment}\n${difficulty}${exercisesText}${motivationalText}`;
}

// Finish workout handler - shows feedback screen
bot.action(/^finish_workout_/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const parts = ctx.callbackQuery.data.split('_');
    const routineId = parts[2];
    const category = parts.slice(3, -1).join('_'); // Everything between routineId and environment
    const environment = parts[parts.length - 1];
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const feedbackText = user.language === 'es' 
      ? `🎉 <b>¡Entrenamiento Completado!</b>\n\n💪 ¡Felicitaciones! Has terminado tu rutina.\n\n¿Como te fue? Tu feedback me ayuda a mejorar tus próximas rutinas.`
      : `🎉 <b>Workout Completed!</b>\n\n💪 Congratulations! You've finished your routine.\n\nHow did it go? Your feedback helps me improve your next routines.`;

    const feedbackButtons = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '😊 Muy Fácil' : '😊 Too Easy', 
            callback_data: `workout_feedback_too_easy_${routineId}_${category}_${environment}` 
          },
          { 
            text: user.language === 'es' ? '👍 Perfecto' : '👍 Perfect', 
            callback_data: `workout_feedback_perfect_${routineId}_${category}_${environment}` 
          },
          { 
            text: user.language === 'es' ? '😰 Muy Difícil' : '😰 Too Hard', 
            callback_data: `workout_feedback_too_hard_${routineId}_${category}_${environment}` 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '⏭️ Omitir Feedback' : '⏭️ Skip Feedback', 
            callback_data: `workout_feedback_skip_${routineId}_${category}_${environment}` 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🏠 Menú Principal' : '🏠 Main Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(feedbackText, {
      reply_markup: feedbackButtons,
      parse_mode: 'HTML'
    });

  } catch (error) {
    console.error('Error in finish workout:', error);
    await ctx.reply('❌ Error finishing workout.');
  }
});

// Workout feedback handlers
bot.action(/^workout_feedback_/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const parts = ctx.callbackQuery.data.split('_');
    
    // Handle feedback types that may contain underscores (like 'too_easy', 'too_hard')
    let feedbackType;
    let routineIdIndex;
    
    if (parts[2] === 'too' && parts[3] === 'easy') {
      feedbackType = 'too_easy';
      routineIdIndex = 4;
    } else if (parts[2] === 'too' && parts[3] === 'hard') {
      feedbackType = 'too_hard';
      routineIdIndex = 4;
    } else if (parts[2] === 'perfect') {
      feedbackType = 'perfect';
      routineIdIndex = 3;
    } else if (parts[2] === 'skip') {
      feedbackType = 'skip';
      routineIdIndex = 3;
    } else {
      // Fallback for unexpected format
      feedbackType = parts[2];
      routineIdIndex = 3;
    }
    
    const routineId = parts[routineIdIndex];
    const category = parts.slice(routineIdIndex + 1, -1).join('_'); // Everything between routineId and environment
    const environment = parts[parts.length - 1];
    
    console.log(`📝 Workout feedback - type: "${feedbackType}", routineId: "${routineId}", category: "${category}", environment: "${environment}"`);
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    // Generate routine to get exercises (we need this for history)
    const routine = await RoutineService.generateRoutine(category, environment, user.difficulty, user.language);
    const exerciseNames = routine ? routine.exercises.map(ex => ex.name) : [];

    // Save workout to history first
    await UserService.addWorkoutToHistory(user.telegramId, {
      category,
      environment,
      exercises: exerciseNames,
      difficulty: user.difficulty,
      date: new Date()
    });

    // Process feedback and adjust difficulty
    let newDifficulty = user.difficulty;
    let feedbackMessage = '';

    if (feedbackType !== 'skip') {
      switch (feedbackType) {
        case 'too_easy':
          newDifficulty = UserService.increaseDifficulty(user.difficulty);
          if (newDifficulty !== user.difficulty) {
            feedbackMessage = user.language === 'es' 
              ? '📈 ¡Perfecto! Aumenté tu dificultad. ¡Sigues creciendo!'
              : '📈 Perfect! I increased your difficulty. Keep growing!';
          } else {
            feedbackMessage = user.language === 'es' 
              ? '🏆 ¡Ya estás en el nivel máximo! ¡Eres una máquina!'
              : '🏆 You\'re already at the maximum level! You\'re a machine!';
          }
          break;
        case 'too_hard':
          newDifficulty = UserService.decreaseDifficulty(user.difficulty);
          if (newDifficulty !== user.difficulty) {
            feedbackMessage = user.language === 'es' 
              ? '📉 Entendido, reduje un poco la dificultad. ¡Vamos paso a paso!'
              : '📉 Got it, I reduced the difficulty a bit. Let\'s go step by step!';
          } else {
            feedbackMessage = user.language === 'es' 
              ? '🟢 ¡Ya estás en el nivel mínimo! ¡Empezamos desde lo básico!'
              : '🟢 You\'re already at the minimum level! We start from the basics!';
        }
          break;
        case 'perfect':
          feedbackMessage = user.language === 'es' 
            ? '🎯 ¡Excelente! Mantenemos este nivel. ¡Sigue así!'
            : '🎯 Excellent! We\'ll keep this level. Keep it up!';
          break;
      }

      // Update user difficulty if changed
      if (newDifficulty !== user.difficulty) {
        await UserService.updateDifficulty(user.telegramId, newDifficulty);
      }

      // Save feedback
      await UserService.addFeedbackToLastWorkout(user.telegramId, {
        type: feedbackType,
        routineId,
        date: new Date()
      });
    } else {
      feedbackMessage = user.language === 'es' 
        ? '✅ ¡Entrenamiento guardado! Sin feedback esta vez.'
        : '✅ Workout saved! No feedback this time.';
    }

    // Show feedback confirmation
    const thanksText = user.language === 'es' 
      ? `${feedbackMessage}\n\n✨ ¡Gracias! ¿Qué quieres hacer ahora?`
      : `${feedbackMessage}\n\n✨ Thanks! What would you like to do now?`;

    const nextActionButtons = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '💪 Nuevo Entrenamiento' : '💪 New Workout', 
            callback_data: 'start_workout' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '📊 Ver Historial' : '📊 View History', 
            callback_data: 'show_history' 
          },
          { 
            text: user.language === 'es' ? '🏠 Menú Principal' : '🏠 Main Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(thanksText, {
      reply_markup: nextActionButtons
    });

  } catch (error) {
    console.error('Error in workout feedback:', error);
    await ctx.reply('❌ Error processing feedback.');
  }
});

// New routine handler
bot.action(/^new_routine_/, async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Answer the callback query
    
    const parts = ctx.callbackQuery.data.split('_');
    const category = parts.slice(2, -1).join('_'); // Everything between 'new_routine_' and the last part (environment)
    const environment = parts[parts.length - 1];
    
    console.log(`🔄 New routine requested - category: "${category}", environment: "${environment}"`);
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    await generateRoutine(ctx, user, category, environment);

  } catch (error) {
    console.error('Error in new routine generation:', error);
    await ctx.reply('❌ Error generating new routine.');
  }
});

// Back to main menu handler
bot.action('back_to_main', async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Answer the callback query
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const mainMenu = {
      inline_keyboard: [
        [
          { text: user.language === 'es' ? '🏋️ Gimnasio' : '🏋️ Gym Workout', callback_data: 'workout_gym' },
          { text: user.language === 'es' ? '🏠 Casa' : '🏠 Home Workout', callback_data: 'workout_home' }
        ],
        [
          { text: '🏃 Cardio', callback_data: 'workout_cardio' },
          { text: user.language === 'es' ? '📊 Historial' : '📊 History', callback_data: 'show_history' }
        ],
        [
          { text: user.language === 'es' ? '⚙️ Configuración' : '⚙️ Settings', callback_data: 'settings' }
        ]
      ]
    };

    const welcomeText = user.language === 'es' 
      ? `🤖 ¡Hola ${ctx.from.first_name}! ¿Qué tipo de entrenamiento quieres hoy?`
      : `🤖 Hello ${ctx.from.first_name}! What type of workout do you want today?`;

    await ctx.editMessageText(welcomeText, {
      reply_markup: mainMenu
    });

  } catch (error) {
    console.error('Error returning to main menu:', error);
    await ctx.reply('❌ Error. Try /start again.');
  }
});

// History handler
bot.action('show_history', async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Answer the callback query
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const stats = await UserService.getUserStats(telegramId);
    const recentWorkouts = user.workoutHistory.slice(-5).reverse(); // Last 5 workouts

    let historyText = user.language === 'es' 
      ? `📊 <b>Tu Historial de Entrenamientos</b>\n\n`
      : `📊 <b>Your Workout History</b>\n\n`;

    historyText += user.language === 'es' 
      ? `📈 <b>Estadísticas:</b>\n`
      : `📈 <b>Statistics:</b>\n`;

    historyText += user.language === 'es' 
      ? `• Total entrenamientos: ${stats.totalWorkouts}\n`
      : `• Total workouts: ${stats.totalWorkouts}\n`;

    historyText += user.language === 'es' 
      ? `• Racha actual: ${stats.recentStreak} días\n`
      : `• Current streak: ${stats.recentStreak} days\n`;

    historyText += user.language === 'es' 
      ? `• Dificultad actual: ${user.difficulty === 'beginner' ? 'Principiante' : user.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}\n\n`
      : `• Current difficulty: ${user.difficulty}\n\n`;

    if (recentWorkouts.length > 0) {
      historyText += user.language === 'es' 
        ? `🕒 <b>Entrenamientos Recientes:</b>\n`
        : `🕒 <b>Recent Workouts:</b>\n`;

      recentWorkouts.forEach((workout, index) => {
        const date = new Date(workout.date).toLocaleDateString();
        const categoryName = user.language === 'es' 
          ? (workout.category === 'cardio' ? 'Cardio' : 
             workout.category === 'full_body' ? 'Cuerpo Completo' : 
             workout.category)
          : workout.category;
        
        historyText += `${index + 1}. ${categoryName} (${workout.environment === 'gym' ? (user.language === 'es' ? 'Gimnasio' : 'Gym') : (user.language === 'es' ? 'Casa' : 'Home')}) - ${date}\n`;
      });
    } else {
      historyText += user.language === 'es' 
        ? `💭 Aún no tienes entrenamientos registrados.\n¡Comienza tu primera rutina!`
        : `💭 No workouts recorded yet.\nStart your first routine!`;
    }

    const backButton = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '� Nuevo Entrenamiento' : '💪 New Workout', 
            callback_data: 'start_workout' 
          },
          { 
            text: user.language === 'es' ? '🏠 Menú Principal' : '🏠 Main Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(historyText, {
      reply_markup: backButton,
      parse_mode: 'HTML'
    });

  } catch (error) {
    console.error('Error showing history:', error);
    await ctx.reply('❌ Error showing history.');
  }
});

// Settings handler
bot.action('settings', async (ctx) => {
  try {
    await ctx.answerCbQuery(); // Answer the callback query
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const settingsText = user.language === 'es' 
      ? `⚙️ <b>Configuración</b>\n\n📋 <b>Tu perfil actual:</b>\n• Idioma: ${user.language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}\n• Dificultad: ${user.difficulty === 'beginner' ? 'Principiante' : user.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}\n• Miembro desde: ${new Date(user.createdAt).toLocaleDateString()}\n\n¿Qué querés cambiar?`
      : `⚙️ <b>Settings</b>\n\n📋 <b>Your current profile:</b>\n• Language: ${user.language === 'es' ? '🇪🇸 Spanish' : '🇺🇸 English'}\n• Difficulty: ${user.difficulty}\n• Member since: ${new Date(user.createdAt).toLocaleDateString()}\n\nWhat would you like to change?`;

    const settingsMenu = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '🌍 Cambiar Idioma' : '🌍 Change Language', 
            callback_data: 'change_language' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '⚡ Cambiar Dificultad' : '⚡ Change Difficulty', 
            callback_data: 'change_difficulty' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🗑️ Borrar Historial' : '🗑️ Clear History', 
            callback_data: 'clear_history' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🔙 Volver al Menú' : '🔙 Back to Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(settingsText, {
      reply_markup: settingsMenu,
      parse_mode: 'HTML'
    });

  } catch (error) {
    console.error('Error showing settings:', error);
    await ctx.reply('❌ Error showing settings.');
  }
});

// Change language handler
bot.action('change_language', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const languageText = user.language === 'es' 
      ? '🌍 Elige tu nuevo idioma:'
      : '🌍 Choose your new language:';

    const languageMenu = {
      inline_keyboard: [
        [
          { text: '🇪🇸 Español', callback_data: 'set_lang_es' },
          { text: '🇺🇸 English', callback_data: 'set_lang_en' }
        ],
        [
          { 
            text: user.language === 'es' ? '🔙 Volver a Settings' : '🔙 Back to Settings', 
            callback_data: 'settings' 
          }
        ]
      ]
    };

    await ctx.editMessageText(languageText, {
      reply_markup: languageMenu
    });

  } catch (error) {
    console.error('Error in change language:', error);
    await ctx.reply('❌ Error.');
  }
});

// Set language handlers
bot.action(['set_lang_es', 'set_lang_en'], async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const newLanguage = ctx.callbackQuery.data === 'set_lang_es' ? 'es' : 'en';
    const telegramId = ctx.from.id.toString();
    
    await User.findOneAndUpdate(
      { telegramId },
      { language: newLanguage }
    );

    const confirmText = newLanguage === 'es' 
      ? '✅ ¡Idioma cambiado a Español!'
      : '✅ Language changed to English!';

    const backButton = {
      inline_keyboard: [
        [
          { 
            text: newLanguage === 'es' ? '🔙 Volver a Settings' : '🔙 Back to Settings', 
            callback_data: 'settings' 
          }
        ]
      ]
    };

    await ctx.editMessageText(confirmText, {
      reply_markup: backButton
    });

  } catch (error) {
    console.error('Error setting language:', error);
    await ctx.reply('❌ Error.');
  }
});

// Change difficulty handler
bot.action('change_difficulty', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const difficultyText = user.language === 'es' 
      ? '⚡ Elige tu nuevo nivel de dificultad:'
      : '⚡ Choose your new difficulty level:';

    const difficultyMenu = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '🟢 Principiante' : '🟢 Beginner', 
            callback_data: 'set_diff_beginner' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🟡 Intermedio' : '🟡 Intermediate', 
            callback_data: 'set_diff_intermediate' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🔴 Avanzado' : '🔴 Advanced', 
            callback_data: 'set_diff_advanced' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🔙 Volver a Settings' : '🔙 Back to Settings', 
            callback_data: 'settings' 
          }
        ]
      ]
    };

    await ctx.editMessageText(difficultyText, {
      reply_markup: difficultyMenu
    });

  } catch (error) {
    console.error('Error in change difficulty:', error);
    await ctx.reply('❌ Error.');
  }
});

// Set difficulty handlers
bot.action(['set_diff_beginner', 'set_diff_intermediate', 'set_diff_advanced'], async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const newDifficulty = ctx.callbackQuery.data.replace('set_diff_', '');
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });
    
    await User.findOneAndUpdate(
      { telegramId },
      { difficulty: newDifficulty }
    );

    const difficultyNames = {
      es: { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' },
      en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
    };

    const confirmText = user.language === 'es' 
      ? `✅ ¡Dificultad cambiada a ${difficultyNames.es[newDifficulty]}!`
      : `✅ Difficulty changed to ${difficultyNames.en[newDifficulty]}!`;

    const backButton = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '🔙 Volver a Settings' : '🔙 Back to Settings', 
            callback_data: 'settings' 
          }
        ]
      ]
    };

    await ctx.editMessageText(confirmText, {
      reply_markup: backButton
    });

  } catch (error) {
    console.error('Error setting difficulty:', error);
    await ctx.reply('❌ Error.');
  }
});

// Clear history handler
bot.action('clear_history', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });

    if (!user) {
      await ctx.reply('❌ Usuario no encontrado. Usa /start');
      return;
    }

    const confirmText = user.language === 'es' 
      ? '⚠️ ¿Estás seguro de que quieres borrar todo tu historial de entrenamientos?\n\nEsta acción no se puede deshacer.'
      : '⚠️ Are you sure you want to clear all your workout history?\n\nThis action cannot be undone.';

    const confirmMenu = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '✅ Sí, borrar todo' : '✅ Yes, clear all', 
            callback_data: 'confirm_clear_history' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '❌ No, cancelar' : '❌ No, cancel', 
            callback_data: 'settings' 
          }
        ],
        [
          { 
            text: user.language === 'es' ? '🏠 Menú Principal' : '🏠 Main Menu', 
            callback_data: 'back_to_main' 
          }
        ]
      ]
    };

    await ctx.editMessageText(confirmText, {
      reply_markup: confirmMenu
    });

  } catch (error) {
    console.error('Error in clear history:', error);
    await ctx.reply('❌ Error.');
  }
});

// Confirm clear history
bot.action('confirm_clear_history', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ telegramId });
    
    await User.findOneAndUpdate(
      { telegramId },
      { workoutHistory: [] }
    );

    const successText = user.language === 'es' 
      ? '✅ ¡Historial borrado exitosamente!'
      : '✅ History cleared successfully!';

    const backButton = {
      inline_keyboard: [
        [
          { 
            text: user.language === 'es' ? '🔙 Volver a Settings' : '🔙 Back to Settings', 
            callback_data: 'settings' 
          }
        ]
      ]
    };

    await ctx.editMessageText(successText, {
      reply_markup: backButton
    });

  } catch (error) {
    console.error('Error clearing history:', error);
    await ctx.reply('❌ Error.');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('❌ Bot error:', err);
  if (ctx?.reply) {
    ctx.reply('❌ Something went wrong. Please try /start again.');
  }
});

// Start bot
bot.launch()
  .then(() => console.log('��� GymBot is running!'))
  .catch(err => console.error('❌ Failed to start bot:', err));

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
