# Project Tasks

This document tracks all tasks for the project, categorized by their status.

## Done
- [x] Bootstrapped project management files (`tasks.md`, `general-objectives.md`, `styling-guide.md`).
- [x] Updated `AGENT.md` to enforce `tasks.md` updates.
- [x] Removed chat-specific components (`MessageInput.tsx`, `ChatWindow.tsx`) and related logic from `App.tsx`.
- [x] Removed `services/geminiService.ts` and chat-related types from `types.ts`.
- [x] Updated `metadata.json` and `index.html` titles for the Pokémon theme.
- [x] Defined `Pokemon` and `TrainerData` types in `types.ts`.
- [x] Created `services/indexedDbService.ts` for local data persistence (tokens, collection).
- [x] Created `services/pokemonApi.ts` for external Pokémon generation API integration, including authentication.
- [x] Refactored `App.tsx` to introduce Pokémon-specific state (tokens, trainerId, generatedPokemon, collectedPokemon) and removed chat logic.
- [x] Implemented `useEffect` in `App.tsx` to load/initialize `trainerData` from IndexedDB on mount.
- [x] Created `components/TokenDisplay.tsx` to display current token balance.
- [x] Created `components/PokemonGenerator.tsx` with prompt input, "Generate Pokémon" button, and display for generated Pokémon.
- [x] Implemented `handleGeneratePokemon` in `App.tsx` to call `pokemonApi`, deduct tokens, and update `generatedPokemon` state.
- [x] Implemented "Add to Collection" functionality in `App.tsx` for generated Pokémon, adding it to `collectedPokemon` and saving to IndexedDB.
- [x] Designed and implemented the UI for displaying the user's collected Pokémon (`PokemonCollection.tsx`).
- [x] Implemented Pokémon resale functionality, refunding 5 tokens per Pokémon when a Pokémon is sold from the collection.
- [x] Implemented robust error handling for API responses (400, 401, 403, 429, 500) and display user-friendly messages using the `Modal` component.
- [x] Ensured all user interactions requiring confirmation or displaying information use the custom `Modal` component (including API errors, token shortages, and input validation).
- [x] Added a visual indicator/animation when a Pokémon is successfully added to the collection.
- [x] Make sure the application is responsive and accessible across different devices.
- [x] We don't need a describe for create a pokemon, we just need to click on the button
- [x] Implement a clear separation or navigation between the "Generate" and "Collection" views.
- [x] Enhance the `PokemonCollection` view with filtering/sorting options.
- [x] Improve network error handling for 'Failed to fetch' scenarios in `pokemonApi.ts`.
- [x] The resale price must be different depending on the rarity (the rarer the Pokémon, the more expensive it is)

## In Progress
- [x] We can pull 5 pokemons at the same time

## Planned