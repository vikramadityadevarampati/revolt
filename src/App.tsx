import React from 'react';
import VoiceChat from './components/VoiceChat';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <VoiceChat />
      </main>
      <Footer />
    </div>
  );
}

export default App;