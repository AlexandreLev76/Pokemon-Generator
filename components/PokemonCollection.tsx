import React, { useState, useMemo } from 'react';
import { Pokemon } from '../types';
import Button from './Button';
import { DollarSign, ArrowUpDown, Filter } from 'lucide-react';

interface PokemonCollectionProps {
  collectedPokemon: Pokemon[];
  onSellPokemon: (pokemon: Pokemon) => void; // Changed to accept full Pokemon object
  rarityResellValues: { [key: string]: number }; // New prop for dynamic resell values
  defaultResellValue: number; // New prop for default resell value fallback
}

// Define the order of rarities for sorting
const rarityOrder: { [key: string]: number } = {
  'F': 0, 'E': 1, 'D': 2, 'C': 3, 'B': 4, 'A': 5, 'S': 6, 'S+': 7,
};

const PokemonCollection: React.FC<PokemonCollectionProps> = ({
  collectedPokemon,
  onSellPokemon,
  rarityResellValues, // Destructure new prop
  defaultResellValue, // Destructure new prop
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'timestamp'>('timestamp');
  const [filterRarity, setFilterRarity] = useState<string>('all');

  const availableRarities = useMemo(() => {
    const rarities = Array.from(new Set(collectedPokemon.map(p => p.rarity))).sort((a, b) => rarityOrder[a] - rarityOrder[b]);
    return ['all', ...rarities];
  }, [collectedPokemon]);

  const filteredAndSortedPokemon = useMemo(() => {
    let result = [...collectedPokemon];

    // Apply filter
    if (filterRarity !== 'all') {
      result = result.filter(pokemon => pokemon.rarity === filterRarity);
    }

    // Apply sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'rarity') {
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      } else if (sortBy === 'timestamp') {
        // Newest first
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return 0;
    });

    return result;
  }, [collectedPokemon, sortBy, filterRarity]);

  return (
    <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-6 mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Collection</h2>

      {collectedPokemon.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0 w-full sm:w-auto">
            <ArrowUpDown className="h-5 w-5 text-gray-600" />
            <label htmlFor="sortBy" className="text-gray-700 font-medium whitespace-nowrap">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'rarity' | 'timestamp')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 flex-grow sm:flex-grow-0"
              aria-label="Sort collection by"
            >
              <option value="timestamp">Date (Newest)</option>
              <option value="name">Name (A-Z)</option>
              <option value="rarity">Rarity (F-S+)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-600" />
            <label htmlFor="filterRarity" className="text-gray-700 font-medium whitespace-nowrap">Filter Rarity:</label>
            <select
              id="filterRarity"
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 flex-grow sm:flex-grow-0"
              aria-label="Filter collection by rarity"
            >
              {availableRarities.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'All Rarities' : rarity}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {collectedPokemon.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg mb-2">You haven't collected any Pokémon yet!</p>
          <p className="text-sm">Generate some new creatures to start your collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPokemon.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p className="text-lg">No Pokémon match your current filter and sort criteria.</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            filteredAndSortedPokemon.map((pokemon) => {
              const sellValue = rarityResellValues[pokemon.rarity] || defaultResellValue;
              return (
                <div
                  key={pokemon.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain mb-4 border border-gray-200 rounded-md p-1"
                  />
                  <p className="text-xl font-semibold text-gray-900 mb-1">{pokemon.name}</p>
                  <p className="text-sm text-gray-600 mb-3">Rarity: {pokemon.rarity}</p>
                  <p className="text-xs text-gray-400 mb-4">
                    Collected: {new Date(pokemon.timestamp).toLocaleDateString()}
                  </p>
                  <Button
                    onClick={() => onSellPokemon(pokemon)}
                    variant="secondary"
                    size="sm"
                    className="w-full flex items-center justify-center text-green-700 bg-green-50 hover:bg-green-100"
                  >
                    <DollarSign className="h-4 w-4 mr-1" /> Sell ({sellValue} Tokens)
                  </Button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonCollection;