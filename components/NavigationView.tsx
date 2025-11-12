import React from 'react';
import Button from './Button';
import { Sparkles, LayoutGrid } from 'lucide-react';

interface NavigationViewProps {
  activeView: 'generate' | 'collection';
  onSwitchView: (view: 'generate' | 'collection') => void;
}

const NavigationView: React.FC<NavigationViewProps> = ({ activeView, onSwitchView }) => {
  return (
    <nav className="flex justify-center space-x-4 mb-6 w-full max-w-xl">
      <Button
        onClick={() => onSwitchView('generate')}
        variant={activeView === 'generate' ? 'primary' : 'secondary'}
        className="flex-1"
      >
        <Sparkles className="h-5 w-5 mr-2" />
        Generate Pokémon
      </Button>
      <Button
        onClick={() => onSwitchView('collection')}
        variant={activeView === 'collection' ? 'primary' : 'secondary'}
        className="flex-1"
      >
        <LayoutGrid className="h-5 w-5 mr-2" />
        Your Collection
      </Button>
    </nav>
  );
};

export default NavigationView;