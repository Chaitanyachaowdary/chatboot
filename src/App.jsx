// gemini-chatbot/src/App.jsx
import React from 'react';
import GeminiChatbot from './components/GeminiChatbot.jsx'; // Import your chatbot component

function App() {
  return (
    <div className="min-h-screen bg-primary-dark text-text-light flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <GeminiChatbot />
    </div>
  );
}

export default App;