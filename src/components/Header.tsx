import React from 'react';
import { Zap, Mic } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-red-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Revolt Motors</h1>
              <p className="text-sm text-gray-600">Voice Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-red-600">
            <Mic className="w-5 h-5" />
            <span className="text-sm font-medium">Rev AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;