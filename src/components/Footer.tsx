import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Revolt Motors Voice Assistant</h3>
            <p className="text-gray-400 text-sm">
              Powered by Gemini Live API - Real-time voice interaction
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://revoltmotors.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Revolt Motors</span>
            </a>
            <a
              href="https://ai.google.dev/gemini-api/docs/live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Gemini Live API</span>
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>© 2024 Revolt Motors Voice Assistant. Built for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;