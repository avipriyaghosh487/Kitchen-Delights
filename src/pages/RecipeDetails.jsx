import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
      const data = await response.json();
      setRecipe(data.data.recipe);
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.some((fav) => fav.id === id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite) {
      const newFavorites = favorites.filter((fav) => fav.id !== id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push({ id: recipe.id, title: recipe.title, image_url: recipe.image_url });
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  if (!recipe) return <div className="container mx-auto mt-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <img src={recipe.image_url} alt={recipe.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{recipe.title}</h1>
          <button
            onClick={toggleFavorite}
            className={`mb-4 px-4 py-2 rounded-md ${
              isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white transition duration-300`}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Ingredients:</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.quantity} {ingredient.unit} {ingredient.description}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Instructions:</h2>
          <p className="text-gray-600 mb-4">{recipe.publisher}</p>
          <a 
            href={recipe.source_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-600 transition duration-300"
          >
            Original Recipe
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;