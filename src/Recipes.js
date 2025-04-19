import React, { useEffect, useState } from 'react';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/recipes')
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;
