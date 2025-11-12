import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import Button from './components/Button';
import TokenDisplay from './components/TokenDisplay';
import PokemonGenerator from './components/PokemonGenerator';
import PokemonCollection from './components/PokemonCollection';
import NavigationView from './components/NavigationView'; // Import the new navigation component
import { Pokemon, TrainerData, PokemonGenerationResponse } from './types';
import { getTrainerData, saveTrainerData } from './services/indexedDbService';
import { generatePokemon } from './services/pokemonApi';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_TOKENS = 100;
const GENERATE_COST = 10;
const DEFAULT_RESELL_VALUE = 5; // Value refunded when selling a Pokémon if rarity not found

const RARITY_RESELL_VALUES: { [key: string]: number } = {
  'F': 2,
  'E': 3,
  'D': 5,
  'C': 7,
  'B': 10,
  'A': 15,
  'S': 20,
  'S+': 30,
};

function App() {
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  const [generatedPokemon, setGeneratedPokemon] = useState<Pokemon[]>([]); // Changed to an array
  const [collectedPokemon, setCollectedPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pokemonBeingAddedId, setPokemonBeingAddedId] = useState<string | null>(null); // Still tracks single for animation
  const [activeView, setActiveView] = useState<'generate' | 'collection'>('generate'); // New state for active view

  // Effect to load trainer data from IndexedDB on component mount
  useEffect(() => {
    const loadData = async () => {
      let currentTrainerId = localStorage.getItem('trainerId');
      if (!currentTrainerId) {
        currentTrainerId = uuidv4();
        localStorage.setItem('trainerId', currentTrainerId);
      }
      setTrainerId(currentTrainerId);

      const data = await getTrainerData(currentTrainerId);
      if (data) {
        setTokens(data.tokens);
        setCollectedPokemon(data.collectedPokemon);
      } else {
        // Initialize new trainer data if not found
        const initialData: TrainerData = {
          trainerId: currentTrainerId,
          tokens: INITIAL_TOKENS,
          collectedPokemon: [],
        };
        await saveTrainerData(initialData);
        setTokens(INITIAL_TOKENS);
        setCollectedPokemon([]);
      }
    };
    loadData();
  }, []); // Run only once on mount

  // Effect to save trainer data whenever tokens or collectedPokemon change
  useEffect(() => {
    if (trainerId) {
      const saveData = async () => {
        const dataToSave: TrainerData = { trainerId, tokens, collectedPokemon };
        await saveTrainerData(dataToSave);
      };
      saveData();
    }
  }, [trainerId, tokens, collectedPokemon]);

  const handleGeneratePokemon = useCallback(async (quantity: number = 1) => {
    if (!trainerId) {
      setErrorMessage('Trainer ID not set. Please refresh the page.');
      setShowErrorModal(true);
      return;
    }
    const totalCost = quantity * GENERATE_COST;
    if (tokens < totalCost) {
      setErrorMessage(`You need ${totalCost} tokens to generate ${quantity} Pokémon. You currently have ${tokens}.`);
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    setGeneratedPokemon([]); // Clear previously generated Pokémon
    setPokemonBeingAddedId(null); // Ensure animation state is reset

    try {
      // The API is designed to generate a random Pokemon if the prompt is an empty string
      const generationPromises = Array.from({ length: quantity }, () => generatePokemon("", trainerId));
      const responses: PokemonGenerationResponse[] = await Promise.all(generationPromises);

      const newPokemonBatch: Pokemon[] = responses.map(response => ({
        id: uuidv4(), // Assign a local unique ID
        name: response.name,
        rarity: response.rarity,
        imageUrl: response.image, // base64 image data
        timestamp: response.timestamp,
      }));

      setGeneratedPokemon(newPokemonBatch);
      setTokens((prev) => prev - totalCost); // Deduct tokens
    } catch (error: any) {
      console.error('Error generating Pokémon:', error);
      setErrorMessage(error.message || 'An unknown error occurred while generating the Pokémon.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [trainerId, tokens]);

  const handleAddToCollection = useCallback((pokemonToAdd: Pokemon) => {
    if (!collectedPokemon.find(p => p.id === pokemonToAdd.id)) { // Prevent duplicates
      setCollectedPokemon((prev) => [...prev, pokemonToAdd]);
      setPokemonBeingAddedId(pokemonToAdd.id); // Trigger animation in PokemonGenerator
      // Do NOT remove from generatedPokemon here; PokemonGenerator will signal when animation is done
    } else {
      setErrorMessage('This Pokémon is already in your collection!');
      setShowErrorModal(true);
    }
  }, [collectedPokemon]);

  const handlePokemonAddAnimationEnd = useCallback((pokemonIdToRemove: string) => {
    setPokemonBeingAddedId(null); // Reset the animation trigger
    // Now that animation is done, remove the Pokémon from the generated list
    setGeneratedPokemon((prev) => prev.filter(p => p.id !== pokemonIdToRemove));
  }, []);

  const handleSellPokemon = useCallback((pokemonToSell: Pokemon) => {
    setCollectedPokemon((prev) => prev.filter(p => p.id !== pokemonToSell.id));
    const actualResellValue = RARITY_RESELL_VALUES[pokemonToSell.rarity] || DEFAULT_RESELL_VALUE;
    setTokens((prev) => prev + actualResellValue); // Refund tokens based on rarity
  }, []);

  const handleInputError = useCallback((message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  }, []);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main id="main-content" className="flex-1 p-4 md:p-6 container mx-auto flex flex-col items-center">
        {trainerId ? (
          <>
            <TokenDisplay tokens={tokens} />
            <NavigationView activeView={activeView} onSwitchView={setActiveView} />

            {activeView === 'generate' ? (
              <PokemonGenerator
                tokens={tokens}
                generateCost={GENERATE_COST}
                onGenerate={handleGeneratePokemon}
                onAddToCollection={handleAddToCollection}
                generatedPokemon={generatedPokemon} // Now an array
                isLoading={isLoading}
                onInputError={handleInputError}
                pokemonBeingAddedId={pokemonBeingAddedId}
                onPokemonAddAnimationEnd={handlePokemonAddAnimationEnd}
              />
            ) : (
              <PokemonCollection
                collectedPokemon={collectedPokemon}
                onSellPokemon={handleSellPokemon}
                rarityResellValues={RARITY_RESELL_VALUES}
                defaultResellValue={DEFAULT_RESELL_VALUE}
              />
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 mt-20">Loading trainer data...</div>
        )}
      </main>

      <Modal isOpen={showErrorModal} onClose={handleCloseErrorModal} title="Error">
        <p className="text-red-600 mb-4">{errorMessage}</p>
        <p className="text-sm text-gray-600">Please try again. If the problem persists, check your network connection.</p>
        <div className="flex justify-end mt-6">
          <Button onClick={handleCloseErrorModal} variant="secondary">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;