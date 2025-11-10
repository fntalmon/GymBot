# GymBot – Asistente de Fitness en Telegram


![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Telegram Bot](https://img.shields.io/badge/Telegram-Bot%20API-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![License](https://img.shields.io/badge/License-MIT-yellow)



GymBot es un bot de Telegram orientado a generar rutinas personalizadas según grupo muscular, entorno (casa o gimnasio) y nivel de dificultad, con soporte multilenguaje (ES/EN) y ajuste dinámico de intensidad basado en feedback del usuario. Incluye una base de datos de **92 ejercicios** estructurados con descripciones, tips, alternativas y enlaces a video.



## Produccion



Bot en producción: `@AssistantGym_bot`




## Características Principales



- Generación de rutinas por categoría o full-body

- Adaptación automática de dificultad (beginner / intermediate / advanced)

- Base de datos ampliada (92 ejercicios organizados en 6 categorías)

- Soporte bilingüe completo (Español / Inglés)

- Historial de entrenamientos y estadísticas básicas

- Ejercicios con alternativas y referencias en video

- Flujo de confirmación antes de iniciar y feedback al finalizar



## Categorías de Ejercicios


| Categoría         | Cantidad | Entornos soportados |

|------------------|----------|----------------------|

| Chest & Biceps   | 15       | Gym / Home / Both    |

| Back & Triceps   | 16       | Gym / Home / Both    |

| Legs & Shoulders | 15       | Gym / Home / Both    |

| Core             | 16       | Home / Both          |

| Cardio           | 15       | Gym / Home / Both    |

| Yoga             | 15       | Home / Both          |



## Flujo del Usuario


1. Selección de idioma

2. Selección de categoría y entorno

3. Generación de rutina y confirmación

4. Ejecución (sets / reps adaptados a dificultad)

5. Feedback (too easy / perfect / too hard)

6. Ajuste automático de nivel para próximas rutinas


## Niveles de Dificultad



- **Beginner**: Volumen reducido, foco en técnica

- **Intermediate**: Volumen moderado y variedad

- **Advanced**: Mayor número de series/repeticiones y combinación de patrones



El sistema evita saltos bruscos y plateaus mediante un control progresivo basado en feedback.


## Arquitectura



- Node.js + Telegraf para interacción con la API de Telegram

- MongoDB + Mongoose para modelos persistentes (usuarios / ejercicios)

- Servicios desacoplados (`RoutineService`, `UserService`, `ExerciseService`)

- Identificadores simples en rutinas para evitar problemas de parsing

- Diseño preparado para escalabilidad futura (API / visualizaciones / badges)


## Modelo de Datos (Resumen)


### Usuario

```javascript

{- Detailed instructions, form tips, and alternative exercises

  telegramId: String,

  language: 'es' | 'en',- Video references for proper technique demonstration- Creates routines based on muscle groups, environment (gym/home), and user fitness level- **Multilingual**: Full Spanish and English support

  difficulty: 'beginner' | 'intermediate' | 'advanced',

  workoutHistory: [{

    routineId: String,

    category: String,**Multilingual Support**- Supports full-body workouts and targeted muscle group training

    environment: String,

    difficulty: String,- Complete Spanish and English language support

    feedback: String, // too_easy | perfect | too_hard

    completedAt: Date- Seamless language switching through settings- Adapts to user preferences and equipment availability### 📊 **Smart Features**

  }],

  stats: {- Culturally appropriate terminology and instructions

    totalWorkouts: Number,

    categoriesTrained: [String],- **Workout History**: Track your fitness journey with detailed statistics

    currentStreak: Number

  }**Workout History & Analytics**

}

```


### Ejercicio

```javascript

{

  name: { en: String, es: String },

  difficulty: {

    beginner: { sets: Number, reps: String },

    intermediate: { sets: Number, reps: String },## Technology Stack- Three-tier progression system (Beginner, Intermediate, Advanced)- **User Profiles**: Personalized settings and preferences

    advanced: { sets: Number, reps: String }

  },

  description: { en: String, es: String },

  tips: { en: String, es: String },**Backend Infrastructure**- Prevents plateaus through continuous challenge optimization

  alternatives: { en: [String], es: [String] },

  category: String, // chest_biceps | back_triceps | legs_shoulders | core | cardio | yoga- Node.js - Runtime environment

  environment: String, // gym | home | both

  videoUrl: String

}



```

## Logros Técnicos



- Algoritmo de selección de ejercicios según categoría + entorno + nivel

- Sistema de ajuste de dificultad reactivo a feedback en tiempo real

- Internacionalización completa del contenido (nombres, descripciones, textos UI)

- Exportación y seed masivo de ejercicios sin duplicados

- Refactor de IDs y callback_data para resolver problemas de categorías con guiones- Service-oriented architecture separating business logic from bot handlers

- Flujo de confirmación y finalización mejorado para UX clara


## Roadmap Futuro (Potencial)

- Scalable difficulty progression algorithm

- Visualización gráfica de progreso

- Sistema de logros / gamificación

- Sustitución manual de ejercicios en rutina

- Integración con wearables / tracking externo

- API REST para panel web

- Recomendaciones nutricionales básicas





## Seguridad y Privacidad



- Variables sensibles en entorno (.env) no versionadas

- Sin almacenamiento de datos médicos

- Uso de conexiones seguras a base de dato



## Autor


**Federico Talmon** 

GitHub: [@fntalmon](https://github.com/fntalmon)  

LinkedIn: https://www.linkedin.com/in/federicotalmon/

Email: federicotalmon@gmail.com



## Licencia


Uso libre para evaluación y referencia. No orientado a uso comercial masivo.

© 2025 Federico Talmon.

