import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-blue-100 transition duration-300">
          Kitchen Delights
        </Link>
        <div className="space-x-4">
          {location.pathname.startsWith('/recipe/') ? (
            <>
              <Link to="/" className="text-white hover:text-blue-100 transition duration-300">Home</Link>
              <Link to="/favorites" className="text-white hover:text-blue-100 transition duration-300">Favorites</Link>
            </>
          ) : location.pathname === '/' ? (
            <Link to="/favorites" className="text-white hover:text-blue-100 transition duration-300">Favorites</Link>
          ) : (
            <Link to="/" className="text-white hover:text-blue-100 transition duration-300">Home</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;