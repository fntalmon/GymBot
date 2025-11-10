const messages = {
  en: {
    // Welcome messages
    welcome_new: "👋 Welcome to GymBot!\nI'm your personal workout assistant. I'll help you stay consistent and choose the right routines.\n\nFirst, let's set your language:",
    welcome_back: "👋 Welcome back, {name}!\nLast time you did: *{lastWorkout}*\n\nWhat would you like to do today?",
    
    // Language
    choose_language: "🌍 Choose your language:",
    language_updated: "✅ Language updated to English!",
    
    // Main menu
    choose_environment: "🏋️ Where do you want to workout today?",
    choose_category: "💪 What would you like to train today?",
    choose_difficulty: "⚡ What's your fitness level?",
    
    // Environments
    gym: "🏋️ Gym",
    home: "🏠 Home",
    
    // Categories
    full_body: "🏋️ Full Body",
    chest_biceps: "💪 Chest & Biceps",
    back_triceps: "🔙 Back & Triceps", 
    legs_shoulders: "🦵 Legs & Shoulders",
    core: "🅰️ Core/Abs",
    cardio: "🫀 Cardio",
    yoga: "🧘 Yoga/Stretching",
    
    // Difficulties
    beginner: "🟢 Beginner",
    intermediate: "🟡 Intermediate", 
    advanced: "🔴 Advanced",
    
    // Feedback
    feedback_thanks: "Thanks for the feedback! I'll adjust future workouts accordingly.",
    too_easy: "😅 Too easy",
    perfect: "👌 Perfect", 
    too_hard: "😮‍💨 Too hard",
    
    // Buttons
    get_routine: "🎯 Get Routine",
    alternative_routine: "🔄 Different Routine",
    back_to_menu: "⬅️ Back to Menu",
    
    // Errors and fallbacks
    fallback_message: "I didn't understand that. Use the menu below:",
    menu_button: "📋 Main Menu",
    error_occurred: "❌ Something went wrong. Please try again."
  },
  
  es: {
    // Welcome messages  
    welcome_new: "👋 ¡Bienvenido a GymBot!\nSoy tu asistente personal de entrenamientos. Te ayudo a mantener constancia y elegir las rutinas correctas.\n\nPrimero, elige tu idioma:",
    welcome_back: "👋 ¡Bienvenido de vuelta, {name}!\nLa última vez hiciste: *{lastWorkout}*\n\n¿Qué querés hacer hoy?",
    
    // Language
    choose_language: "🌍 Elige tu idioma:",
    language_updated: "✅ ¡Idioma actualizado a Español!",
    
    // Main menu
    choose_environment: "🏋️ ¿Dónde querés entrenar hoy?",
    choose_category: "💪 ¿Qué querés entrenar hoy?",
    choose_difficulty: "⚡ ¿Cuál es tu nivel?",
    
    // Environments
    gym: "🏋️ Gimnasio", 
    home: "🏠 Casa",
    
    // Categories
    full_body: "🏋️ Full Body",
    chest_biceps: "💪 Pecho y Bíceps",
    back_triceps: "🔙 Espalda y Tríceps",
    legs_shoulders: "🦵 Piernas y Hombros", 
    core: "🅰️ Core/Abdominales",
    cardio: "🫀 Cardio",
    yoga: "🧘 Yoga/Estiramiento",
    
    // Difficulties
    beginner: "🟢 Principiante",
    intermediate: "🟡 Intermedio",
    advanced: "🔴 Avanzado",
    
    // Feedback
    feedback_thanks: "¡Gracias por el feedback! Voy a ajustar los próximos entrenamientos.",
    too_easy: "😅 Muy fácil",
    perfect: "👌 Perfecto",
    too_hard: "😮‍💨 Muy difícil", 
    
    // Buttons
    get_routine: "🎯 Ver Rutina",
    alternative_routine: "🔄 Otra Rutina", 
    back_to_menu: "⬅️ Volver al Menú",
    
    // Errors and fallbacks
    fallback_message: "No entendí eso. Usá el menú de abajo:",
    menu_button: "📋 Menú Principal",
    error_occurred: "❌ Algo salió mal. Intentá de nuevo."
  }
};

function getText(key, language = 'en', params = {}) {
  const text = messages[language]?.[key] || messages.en[key] || key;
  
  // Replace parameters in text
  return text.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
}

function getLanguageKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "🇺🇸 English", callback_data: "lang_en" },
        { text: "🇪🇸 Español", callback_data: "lang_es" }
      ]
    ]
  };
}

module.exports = {
  getText,
  getLanguageKeyboard,
  messages
};