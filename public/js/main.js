//Add recipe 
const addRecipeForm = document.getElementById('addRecipeForm');
if (addRecipeForm) {
  addRecipeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log("Submit button clicked!");

    const titleField = document.getElementById('title');
    const descriptionField = document.getElementById('description');

    const formData = {
      title: titleField.value,
      description: descriptionField.value
    };

    console.log("Sending data:", formData);

    try {
      const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Recipe saved successfully');
        alert('Recipe saved successfully! You can check it in the recipes page.');
        window.location.href = '/recipes.html';
      } else {
        console.error('Failed to save recipe');
        alert('Error saving the recipe!');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error connecting to the server!');
    }
  });
} else {
  console.error("addRecipeForm not found!");
}

//Logout button 
const authButtons = document.getElementById('authButtons');
if (authButtons) {
  fetch('/user')
    .then(response => response.json())
    .then(data => {
      if (data.loggedIn) {
        authButtons.innerHTML = `
                      <span class="navbar-text"> ${data.user.displayName}</span>
                      <button id="logoutBtn" class="btn btn-outline-danger ml-2">Logout</button>
                  `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
          window.location.href = '/logout';
        });
      } else {
        authButtons.innerHTML = `<button id="loginBtn" class="btn btn-outline-primary">Login</button>`;
        document.getElementById('loginBtn').addEventListener('click', () => {
          window.location.href = '/auth/google';
        });
      }
    })
    .catch(err => console.error('Error fetching user data:', err));
}

//fetching recipes and adding them in recipe cards
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/recipes')
    .then(response => response.json())
    .then(recipes => {
      const container = document.getElementById('recipes-container');

      if (recipes && Array.isArray(recipes)) {
        recipes.forEach(recipe => {
          const recipeCard = document.createElement('div');
          recipeCard.classList.add('recipe-card');
          recipeCard.style.border = '2px solid black';
          recipeCard.style.margin = '10px';
          recipeCard.style.padding = '10px';
          recipeCard.style.fontSize = '18px';
          recipeCard.style.maxWidth = '500px';

          recipeCard.innerHTML = `
            <h5>${recipe.title}</h5>
            <p>${recipe.description}</p>  <!-- Use description here -->
          `;

          container.appendChild(recipeCard);
        });
      } else {
        console.error("No recipes found or invalid data format.");
      }
    })
    .catch(error => {
      console.error('Error fetching recipes:', error);
    });
});