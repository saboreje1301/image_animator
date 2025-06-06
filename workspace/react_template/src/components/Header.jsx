import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-white text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 p-1 rounded">
              AnimateAI
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Beta</span>
          </div>
          
          <nav>
            <ul className="flex space-x-6 text-sm">
              <li><a href="#" className="hover:text-white/80 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white/80 transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-white/80 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white/80 transition-colors">Help</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;