require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const recipeRoutes = require('./routes/recipeRoutes');
const Recipe = require('./models/recipeModel');

app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../public')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use(session({
  secret: 'alll',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/recipes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/recipes.html'));
});

app.get('/addRecipes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/addrecipes.html'));
});

app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});

app.post('/add', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newRecipe = new Recipe({ title, description });
    await newRecipe.save();

    res.status(201).json({ message: "Recipe added successfully!" });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

app.post('/add-recipe', async (req, res) => {
  try {
    const { title, recipe } = req.body;

    if (!title || !recipe) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newRecipe = new Recipe({
      title,
      recipe
    });

    await newRecipe.save();

    res.status(201).json({ message: 'Recipe added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving recipe' });
  }
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});