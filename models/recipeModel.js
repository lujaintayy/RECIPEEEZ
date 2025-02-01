const mongoose = require('mongoose');

// Define the recipe schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

// Create the model using the schema
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
