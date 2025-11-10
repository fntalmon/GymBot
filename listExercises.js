const mongoose = require('mongoose');
const fs = require('fs');
const Exercise = require('./src/models/Exercise');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const exercises = await Exercise.find({});
    const json = JSON.stringify(exercises, null, 2);

    fs.writeFileSync('exercises.json', json, 'utf8');
    console.log(`✅ Archivo guardado con ${exercises.length} ejercicios en exercises.json`);

    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
