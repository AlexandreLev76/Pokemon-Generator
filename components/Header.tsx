import React from 'react';
import { Pocket } from 'lucide-react'; // Changed from Sparkles to Pocket

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center sm:justify-start">
        <Pocket className="h-8 w-8 mr-3 text-yellow-300" /> {/* Updated icon */}
        <h1 className="text-2xl font-bold tracking-tight text-center sm:text-left">
          Pokémon Generation & Collection
        </h1>
      </div>
    </header>
  );
};

export default Header;