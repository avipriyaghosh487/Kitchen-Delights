import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const debounce = (func, delay) => {
    return (...args) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const searchRecipes = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.trim().length < 3) {
        setRecipes([]);
        setError('Please enter at least 3 characters to search.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchQuery}`);
        const data = await response.json();

        if (data.results === 0) {
          setRecipes([]);
          setError('No recipes found. Try a different search term.');
        } else {
          setRecipes(data.data.recipes);
        }
      } catch (err) {
        setError('An error occurred while fetching recipes. Please try again.');
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchRecipes(value.toLowerCase().trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes(query.toLowerCase().trim());
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Kitchen Delights</h1>
      <form onSubmit={handleSubmit} className="mb-8 max-w-2xl mx-auto">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for recipes..."
            className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600 transition duration-300"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && <p className="text-center text-gray-600">Loading recipes...</p>}

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {!isLoading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{recipe.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{recipe.publisher}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;