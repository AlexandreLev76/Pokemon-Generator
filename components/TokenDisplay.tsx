import React from 'react';
import { DollarSign } from 'lucide-react';

interface TokenDisplayProps {
  tokens: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens }) => {
  return (
    <div className="flex items-center justify-center bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md mb-4 font-semibold text-lg">
      <DollarSign className="h-6 w-6 mr-2 text-green-600" />
      <span>Tokens: {tokens}</span>
    </div>
  );
};

export default TokenDisplay;