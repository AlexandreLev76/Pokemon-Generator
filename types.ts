export interface Pokemon {
  id: string;
  name: string;
  rarity: string;
  imageUrl: string; // base64 data URL
  timestamp: string; // ISO 8601 string
}

export interface TrainerData {
  trainerId: string;
  tokens: number;
  collectedPokemon: Pokemon[];
}

export interface PokemonGenerationRequest {
  prompt: string;
  trainerId: string;
  seed?: number;
}

export interface PokemonGenerationResponse {
  name: string;
  rarity: string;
  image: string; // base64 data URL (will be data:image/png;base64,...)
  timestamp: string; // ISO 8601 string
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}