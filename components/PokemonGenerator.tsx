import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import { Pokemon } from '../types';

interface PokemonGeneratorProps {
  tokens: number;
  generateCost: number; // New prop for generation cost
  onGenerate: (quantity: number) => Promise<void>; // Updated: takes quantity
  onAddToCollection: (pokemon: Pokemon) => void;
  generatedPokemon: Pokemon[]; // Changed to an array
  isLoading: boolean;
  onInputError: (message: string) => void;
  pokemonBeingAddedId: string | null; // ID of the Pokémon being added (for animation)
  onPokemonAddAnimationEnd: (pokemonId: string) => void; // Callback when animation finishes, now takes ID
}

const ANIMATION_DURATION = 500; // ms, matches Tailwind transition duration

const PokemonGenerator: React.FC<PokemonGeneratorProps> = ({
  tokens,
  generateCost,
  onGenerate,
  onAddToCollection,
  generatedPokemon,
  isLoading,
  onInputError,
  pokemonBeingAddedId,
  onPokemonAddAnimationEnd,
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const animationTimeoutsRef = useRef<Map<string, number>>(new Map()); // Map to hold timeout IDs per Pokémon

  // Effect to handle the fade-out animation and clear pokemonBeingAddedId
  // This effect is now more generic to trigger on any new pokemonBeingAddedId
  useEffect(() => {
    if (pokemonBeingAddedId) {
      // Clear any existing timeout for this specific pokemon to prevent multiple calls
      if (animationTimeoutsRef.current.has(pokemonBeingAddedId)) {
        window.clearTimeout(animationTimeoutsRef.current.get(pokemonBeingAddedId)!);
      }

      const timeoutId = window.setTimeout(() => {
        onPokemonAddAnimationEnd(pokemonBeingAddedId); // Notify parent to clear this specific generatedPokemon
        animationTimeoutsRef.current.delete(pokemonBeingAddedId);
      }, ANIMATION_DURATION);
      animationTimeoutsRef.current.set(pokemonBeingAddedId, timeoutId);
    }

    return () => {
      // Clear all timeouts on unmount
      animationTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
      animationTimeoutsRef.current.clear();
    };
  }, [pokemonBeingAddedId, onPokemonAddAnimationEnd]);

  const handleGenerateClick = async () => {
    const totalCost = selectedQuantity * generateCost;
    if (tokens < totalCost) {
      onInputError(`You need ${totalCost} tokens to generate ${selectedQuantity} Pokémon. You currently have ${tokens}.`);
      return;
    }
    await onGenerate(selectedQuantity);
  };

  const handleAddToCollectionClick = (pokemon: Pokemon) => {
    onAddToCollection(pokemon); // App.tsx will set pokemonBeingAddedId and handle actual collection
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Generate Your Pokémon!</h2>
        <p className="text-gray-600 text-center mb-6">
          Choose a quantity and click the button below to generate new Pokémon!
        </p>
        
        <div className="flex items-center justify-center mb-6 space-x-4">
          <label htmlFor="quantity-select" className="text-lg font-medium text-gray-700">Quantity:</label>
          <select
            id="quantity-select"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800"
            aria-label="Select quantity of Pokémon to generate"
            disabled={isLoading}
          >
            {[1, 2, 3, 4, 5].map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleGenerateClick}
          loading={isLoading}
          disabled={isLoading || tokens < (selectedQuantity * generateCost)}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              Generate Pokémon ({selectedQuantity * generateCost} Tokens)
            </>
          )}
        </Button>
      </div>

      {generatedPokemon.length > 0 && (
        <div className="max-w-4xl w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Generated Pokémon:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPokemon.map((pokemon) => {
              const isBeingAdded = pokemonBeingAddedId === pokemon.id;
              // Note: pokemon will be removed from generatedPokemon array by App.tsx
              // AFTER its animation completes via onPokemonAddAnimationEnd.
              // So, we only need to apply the opacity transition.
              return (
                <div
                  key={pokemon.id}
                  className={`bg-white rounded-lg shadow-xl p-6 text-center relative transition-opacity duration-${ANIMATION_DURATION} ease-out ${
                    isBeingAdded ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ willChange: 'opacity' }} // Performance hint for animation
                >
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="w-48 h-48 object-contain mx-auto mb-4 border border-gray-200 rounded-md p-2"
                  />
                  <p className="text-xl font-semibold text-gray-900">{pokemon.name}</p>
                  <p className="text-md text-gray-700 mb-4">Rarity: {pokemon.rarity}</p>
                  <Button
                    onClick={() => handleAddToCollectionClick(pokemon)}
                    disabled={isLoading || isBeingAdded}
                    className="w-full sm:w-auto"
                    variant="secondary"
                  >
                    {isBeingAdded ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" /> Added!
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-5 w-5 mr-2" /> Add to Collection
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Placeholder for when no pokemon generated yet */}
      {generatedPokemon.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">Your generated Pokémon will appear here!</p>
          <p className="text-sm">Select a quantity and click 'Generate Pokémon' to create new creatures.</p>
        </div>
      )}
    </div>
  );
};

export default PokemonGenerator;