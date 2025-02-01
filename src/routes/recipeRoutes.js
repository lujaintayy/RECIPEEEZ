const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Get recipes
router.get('/', recipeController.getRecipes);

// POST/ADD a recipe
router.post('/', recipeController.addRecipe);

module.exports = router;