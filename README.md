# GymBot - AI-Powered Fitness Assistant# 🏋️‍♂️ GymBot - Your Personal Telegram Fitness Assistant



![Node.js](https://img.shields.io/badge/Node.js-18+-green)![Node.js](https://img.shields.io/badge/Node.js-18+-green)

![Telegram Bot](https://img.shields.io/badge/Telegram-Bot%20API-blue)![Telegram Bot](https://img.shields.io/badge/Telegram-Bot%20API-blue)

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

![License](https://img.shields.io/badge/License-MIT-yellow)![License](https://img.shields.io/badge/License-MIT-yellow)



A sophisticated Telegram bot designed to generate personalized workout routines with intelligent difficulty adaptation and multilingual support. Built with Node.js, Telegraf.js, and MongoDB, featuring a comprehensive database of over 90 exercises across multiple fitness categories.A comprehensive **Telegram bot** that generates personalized workout routines for gym and home training. Built with **Node.js**, **Telegraf.js**, and **MongoDB**, featuring multilingual support (Spanish/English) and intelligent difficulty adjustment.



## Overview## 🚀 Features



GymBot is a comprehensive fitness assistant that leverages a database of 92 exercises to create customized workout plans tailored to individual user preferences. The system features dynamic difficulty adjustment based on user feedback, detailed exercise instructions with video references, and persistent workout history tracking.### � **Core Functionality**

- **Personalized Workouts**: AI-generated routines based on user preferences

## Key Features- **Multiple Environments**: Gym, Home, and Cardio workouts

- **5 Exercise Categories**: Full Body, Chest & Biceps, Back & Triceps, Legs & Shoulders, Core

**Personalized Workout Generation**- **Difficulty Levels**: Beginner, Intermediate, Advanced with automatic progression

- Creates routines based on muscle groups, environment (gym/home), and user fitness level- **Multilingual**: Full Spanish and English support

- Supports full-body workouts and targeted muscle group training

- Adapts to user preferences and equipment availability### 📊 **Smart Features**

- **Workout History**: Track your fitness journey with detailed statistics

**Intelligent Difficulty Adaptation**- **Feedback System**: Rate workouts to improve future recommendations

- Automatically adjusts workout intensity based on real-time user feedback- **Progress Tracking**: Monitor workout streaks and difficulty progression

- Three-tier progression system (Beginner, Intermediate, Advanced)- **User Profiles**: Personalized settings and preferences

- Prevents plateaus through continuous challenge optimization

### 🎮 **User Experience**

**Comprehensive Exercise Database**- **Intuitive Navigation**: Clear menu flow with back buttons

- 92 professionally curated exercises across 6 major categories- **Responsive Design**: Fast and smooth interactions

- Detailed instructions, form tips, and alternative exercises- **Rich Content**: Detailed exercise descriptions with tips and alternatives

- Video references for proper technique demonstration- **Video Support**: Exercise video links for proper form



**Multilingual Support**## 🛠️ Tech Stack

- Complete Spanish and English language support

- Seamless language switching through settings- **Backend**: Node.js with Telegraf.js framework

- Culturally appropriate terminology and instructions- **Database**: MongoDB Atlas for cloud storage

- **Architecture**: MVC pattern with services layer

**Workout History & Analytics**- **APIs**: Telegram Bot API

- Tracks all completed workouts with timestamps and difficulty levels- **Hosting**: Ready for Render.com or Railway deployment

- Provides insights on total workouts, categories trained, and difficulty progression

- Enables long-term progress monitoring## 📱 Bot Commands & Navigation



## Technology Stack### Main Menu

```

**Backend Infrastructure**💪 Start Workout → Choose Environment → Select Category → Get Routine

- Node.js - Runtime environment📊 View History → See statistics and recent workouts

- Telegraf - Telegram Bot API framework⚙️ Settings → Language, Difficulty, Clear History

- MongoDB - NoSQL database for user data and exercise storage```

- Mongoose - MongoDB object modeling and validation

### Workout Flow

**Architecture**```

- Service-oriented architecture separating business logic from bot handlers1. Start Workout

- Modular exercise management system2. Choose Environment: 🏋️ Gym | 🏠 Home | 🏃 Cardio

- Scalable difficulty progression algorithm3. Select Category: 💪 Full Body | 🫸 Chest & Biceps | 🫷 Back & Triceps | 🦵 Legs & Shoulders | 🫸 Core

- RESTful data access patterns4. Get Personalized Routine

5. Provide Feedback: 😊 Too Easy | 👍 Perfect | 😰 Too Hard

## Exercise Database6. Options: 🔄 New Routine | 🏠 Menu

```

The bot supports 92 exercises distributed across the following categories:

## 🏗️ Project Structure

| Category | Exercise Count | Environments |

|----------|---------------|--------------|```

| Chest & Biceps | 15 | Gym, Home, Both |GymBot/

| Back & Triceps | 16 | Gym, Home, Both |├── src/

| Legs & Shoulders | 15 | Gym, Home, Both |│   ├── index.js              # Main bot entry point & handlers

| Core | 16 | Home, Both |│   ├── models/

| Cardio | 15 | Gym, Home, Both |│   │   ├── User.js           # User schema & model

| Yoga | 15 | Home, Both |│   │   └── Exercise.js       # Exercise schema & model

│   ├── services/

Each exercise includes:│   │   ├── RoutineService.js # Workout generation logic

- Multilingual name and description│   │   └── UserService.js    # User management & statistics

- Difficulty-specific sets and reps│   ├── data/

- Execution tips and common mistakes│   │   ├── exercises-full.json    # Complete exercise database (15 exercises)

- Alternative exercises│   │   └── exercises-sample.json  # Sample data for testing

- Video demonstration link│   ├── utils/

│   │   └── database.js       # MongoDB connection & seeding

## Installation│   └── scripts/

│       └── seedDatabase.js   # Database initialization script

### Prerequisites├── package.json

├── .env                      # Environment variables

- Node.js (v14 or higher)└── README.md

- MongoDB instance (local or MongoDB Atlas)```

- Telegram Bot Token (obtain from [@BotFather](https://t.me/botfather))

## 🔧 Installation & Setup

### Setup Instructions

### 1. Prerequisites

1. Clone the repository:- Node.js 18+ installed

```bash- MongoDB Atlas account

git clone https://github.com/yourusername/GymBot.git- Telegram Bot Token from [@BotFather](https://t.me/botfather)

cd GymBot

```### 2. Clone & Install

```bash

2. Install dependencies:git clone https://github.com/your-username/GymBot.git

```bashcd GymBot

npm installnpm install

``````



3. Configure environment variables:### 3. Environment Configuration

Create a `.env` file:

Create a `.env` file in the root directory:```env

BOT_TOKEN=your_telegram_bot_token_here

```envMONGODB_URI=your_mongodb_atlas_connection_string

BOT_TOKEN=your_telegram_bot_tokenNODE_ENV=production

MONGO_URI=your_mongodb_connection_string```

NODE_ENV=production

```### 4. Database Setup

```bash

4. Seed the exercise database:# Seed the database with exercises

```bashnpm run seed

node seedNewExercises.js```

```

### 5. Run the Bot

5. Start the bot:```bash

```bash# Development

npm startnpm run dev

```

# Production

## Usagenpm start

```

### Available Commands

## �️ Database Schema

- `/start` - Initialize the bot and set language preference

- `/nueva_rutina` - Generate a new workout routine### User Collection

- `/historial` - View workout history```javascript

- `/estadisticas` - Display progress statistics{

- `/configuracion` - Modify user settings (language, difficulty)  telegramId: String,

  name: String,

### Workout Flow  username: String,

  language: String, // 'es' | 'en'

1. **Category Selection** - Choose target muscle groups or full-body workout  difficulty: String, // 'beginner' | 'intermediate' | 'advanced'

2. **Environment Selection** - Select gym-based or home-based exercises  joinDate: Date,

3. **Routine Confirmation** - Review generated workout plan  workoutHistory: [{

4. **Workout Execution** - Follow exercise instructions with sets and reps    category: String,

5. **Feedback Submission** - Rate workout difficulty (too easy, perfect, too hard)    environment: String,

6. **Automatic Adjustment** - System adapts future workouts based on performance feedback    exercises: [String],

    difficulty: String,

## Difficulty Levels    date: Date

  }]

The bot implements a three-tier difficulty system with automatic progression:}

```

**Beginner**

- Lower volume (fewer sets and reps)### Exercise Collection

- Foundational movement patterns```javascript

- Extended rest periods{

- Focus on form and technique  name: { es: String, en: String },

  category: String, // 'chest_biceps', 'back_triceps', 'legs_shoulders', 'core', 'cardio'

**Intermediate**  environment: String, // 'gym', 'home', 'both'

- Moderate volume and intensity  difficulty: {

- Varied exercise selection    beginner: { sets: Number, reps: String },

- Balanced progression    intermediate: { sets: Number, reps: String },

- Introduction to advanced techniques    advanced: { sets: Number, reps: String }

  },

**Advanced**  description: { es: String, en: String },

- High volume training  tips: { es: String, en: String },

- Complex movement patterns  alternatives: { es: [String], en: [String] },

- Minimal rest periods  videoUrl: String

- Maximum muscle engagement}

```

The system automatically adjusts difficulty based on user feedback, ensuring continuous progression without plateaus or overtraining.

## 💾 Exercise Database

## Database Schema

The bot includes **15 comprehensive exercises** covering all categories:

### User Model

```javascript### 🫸 Chest & Biceps (3 exercises)

{- Push-ups / Flexiones

  telegramId: String (unique),- Bicep Curls / Curl de Bíceps  

  name: String,- Chest Press / Press de Pecho

  username: String,

  language: String, // 'es' | 'en'### 🫷 Back & Triceps (3 exercises)

  difficulty: String, // 'beginner' | 'intermediate' | 'advanced'- Pull-ups / Dominadas

  workoutHistory: [{- Tricep Dips / Fondos de Tríceps

    routineId: String,- Bent Over Row / Remo Inclinado

    category: String,

    environment: String,### 🦵 Legs & Shoulders (3 exercises)

    difficulty: String,- Squats / Sentadillas

    feedback: String, // 'too_easy' | 'perfect' | 'too_hard'- Shoulder Press / Press de Hombros

    completedAt: Date- Lunges / Zancadas

  }],

  stats: {### 🫸 Core (3 exercises)

    totalWorkouts: Number,- Plank / Plancha

    categoriesTrained: [String],- Russian Twists / Giros Rusos

    currentStreak: Number- Mountain Climbers / Escaladores

  },

  createdAt: Date,### � Cardio (3 exercises)

  updatedAt: Date- Burpees

}- Jumping Jacks / Saltos de Tijera

```- High Knees / Rodillas Altas



### Exercise Model## 🌟 Key Features Breakdown

```javascript

{### Intelligent Routine Generation

  name: {- **Automatic Exercise Selection**: Based on category, environment, and difficulty

    en: String,- **Progressive Difficulty**: Automatically adjusts based on user feedback

    es: String- **Variety**: Never get the same routine twice with smart randomization

  },

  difficulty: {### Multilingual Support

    beginner: {- **Complete Translation**: All text, exercise names, and descriptions

      sets: Number,- **Cultural Adaptation**: Proper terminology for Spanish and English users

      reps: String- **Seamless Switching**: Change language anytime in settings

    },

    intermediate: {### User Analytics

      sets: Number,- **Workout Tracking**: Complete history with dates and categories

      reps: String- **Streak Monitoring**: Track consecutive workout days

    },- **Progress Visualization**: See difficulty progression over time

    advanced: {

      sets: Number,## 🚀 Deployment

      reps: String

    }### Render.com (Recommended)

  },1. Fork this repository

  description: {2. Create new Web Service on Render

    en: String,3. Connect your GitHub repository

    es: String4. Set environment variables

  },5. Deploy automatically

  tips: {

    en: String,### Railway

    es: String1. Fork this repository

  },2. Create new project on Railway

  alternatives: {3. Connect GitHub repository

    en: [String],4. Add environment variables

    es: [String]5. Deploy with one click

  },

  category: String, // 'chest_biceps' | 'back_triceps' | 'legs_shoulders' | 'core' | 'cardio' | 'yoga'### Manual VPS

  environment: String, // 'gym' | 'home' | 'both'```bash

  videoUrl: String,# Install PM2 for process management

  createdAt: Date,npm install -g pm2

  updatedAt: Date

}# Start bot with PM2

```pm2 start src/index.js --name "gymbot"



## Project Structure# Save PM2 configuration

pm2 save

```pm2 startup

GymBot/```

├── src/

│   ├── models/## 🧪 Testing

│   │   ├── User.js              # User schema and model

│   │   └── Exercise.js          # Exercise schema and model### Manual Testing Checklist

│   ├── services/- [ ] Bot starts without errors

│   │   ├── UserService.js       # User management and statistics- [ ] Language selection works

│   │   └── RoutineService.js    # Workout generation logic- [ ] All workout categories generate routines

│   └── data/- [ ] Feedback system adjusts difficulty

│       └── exercises-expansion.json  # Exercise database seed data- [ ] History displays correctly

├── index.js                     # Main bot entry point and handlers- [ ] Settings changes persist

├── seedNewExercises.js          # Database seeding script

├── listExercises.js             # Database verification utility### Database Verification

├── package.json                 # Dependencies and scripts```bash

├── .env                         # Environment configuration# Check exercises in database

└── README.md                    # Project documentationnpm run verify-db

``````



## Development Roadmap## 🤝 Contributing



### Completed Features1. Fork the repository

- Core bot functionality with Telegram integration2. Create feature branch (`git checkout -b feature/amazing-feature`)

- Dynamic routine generation algorithm3. Commit changes (`git commit -m 'Add amazing feature'`)

- Intelligent difficulty adaptation system4. Push to branch (`git push origin feature/amazing-feature`)

- Comprehensive exercise database (92 exercises)5. Open Pull Request

- Workout history and statistics tracking

- Multilingual support (Spanish/English)## 📄 License

- Confirmation screens and improved UX flow

- Feedback-based difficulty adjustmentThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



### Planned Enhancements## 👤 Author

- Progress visualization with charts and graphs

- Custom workout creation and exercise substitution**Federico**

- Achievement and badge system for motivation- GitHub: [@your-username](https://github.com/your-username)

- Social features (workout sharing, leaderboards)- Portfolio: [Your Portfolio](https://your-portfolio.com)

- REST API for web dashboard integration

- Mobile app companion## 🙏 Acknowledgments

- Integration with fitness tracking devices

- Nutrition recommendations- [Telegraf.js](https://telegraf.js.org/) - Modern Telegram Bot Framework

- Training program templates- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud Database

- [Render.com](https://render.com/) - Easy Deployment Platform

## Deployment

---

### Render.com (Recommended)

1. Fork this repository to your GitHub account<p align="center">

2. Create a new Web Service on Render  <strong>Made with ❤️ for fitness enthusiasts worldwide</strong>

3. Connect your GitHub repository</p>

4. Configure environment variables (BOT_TOKEN, MONGO_URI)

5. Deploy automatically<p align="center">

  <a href="#gymbot---your-personal-telegram-fitness-assistant">⬆️ Back to Top</a>

### Railway</p>
1. Fork this repository
2. Create a new project on Railway
3. Connect your GitHub repository
4. Add environment variables
5. Deploy with one click

### Manual VPS Deployment
```bash
# Install PM2 for process management
npm install -g pm2

# Start bot with PM2
pm2 start index.js --name "gymbot"

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## Contributing

Contributions are welcome and appreciated. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request with a detailed description

Please ensure your code follows the existing style and includes appropriate documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions, feedback, or collaboration opportunities:
- GitHub Issues: [Project Issues](https://github.com/yourusername/GymBot/issues)
- LinkedIn: [Your LinkedIn Profile]
- Email: your.email@example.com

## Acknowledgments

- Exercise data curated from reputable fitness sources and professional trainers
- Video demonstrations linked from certified fitness professionals
- Built with the Telegram Bot API and modern Node.js ecosystem
- MongoDB Atlas for reliable cloud database hosting

---

**Disclaimer**: This bot is designed for educational and informational purposes. Always consult with qualified healthcare professionals before starting any new fitness program. The creators are not responsible for any injuries or health issues that may arise from using this application.
