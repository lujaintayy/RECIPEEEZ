const Recipe = require('../models/recipeModel');

// Get all recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add  new recipe
exports.addRecipe = async (req, res) => {
  const { title, recipe } = req.body;
  try {
    const newRecipe = new Recipe({ title, recipe });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};