import { PokemonGenerationRequest, PokemonGenerationResponse } from '../types';

const POKEMON_API_ENDPOINT = 'https://epsi.journeesdecouverte.fr:22222/v1/generate';
const AUTH_TOKEN = 'EPSI'; // Hardcoded Bearer token as per documentation

/**
 * Calls the external Pokémon generation API.
 * @param prompt The textual description for the Pokémon.
 * @param trainerId The unique ID of the trainer.
 * @returns A Promise that resolves with the generated PokemonGenerationResponse.
 * @throws An error if the API request fails or returns an error status.
 */
export async function generatePokemon(
  prompt: string,
  trainerId: string,
): Promise<PokemonGenerationResponse> {
  const requestBody: PokemonGenerationRequest = {
    prompt,
    trainerId,
    // seed is optional, not included unless specifically needed for deterministic generation
  };

  try {
    const response = await fetch(POKEMON_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage: string;
      switch (response.status) {
        case 400:
          errorMessage = 'Bad Request - Please check your Pokémon description.';
          break;
        case 401:
          errorMessage = 'Unauthorized - Authentication failed. Please contact support.';
          break;
        case 403:
          errorMessage = 'Forbidden - Access to the Pokémon generation service is denied.';
          break;
        case 429:
          errorMessage = 'Too Many Requests - You\'ve hit the generation limit. Please wait and try again.';
          break;
        case 500:
          errorMessage = 'Internal Server Error - The Pokémon generation service encountered an issue. Please try again later.';
          break;
        default:
          errorMessage = `Failed to generate Pokémon: ${response.status} ${response.statusText || 'Unknown error'}`;
          break;
      }
      // Attempt to parse JSON error message if available and more specific
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If response is not JSON, use the status-based message
        console.warn('API error response was not JSON or could not be parsed:', e);
      }
      throw new Error(errorMessage);
    }

    const data: PokemonGenerationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Pokémon API call error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      // This often indicates network issues, CORS problems, or an unreachable server.
      throw new Error('Could not connect to the Pokémon generation service. Please check your internet connection, ensure the server is running, or try again later.');
    } else if (error instanceof Error) {
      // For errors thrown by the 'if (!response.ok)' block or other explicit errors
      throw error;
    }
    // Fallback for any other unexpected error types
    throw new Error('An unexpected error occurred during Pokémon generation. Please try again.');
  }
}