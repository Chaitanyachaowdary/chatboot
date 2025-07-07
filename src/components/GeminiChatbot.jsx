// gemini-chatbot/src/components/GeminiChatbot.jsx

import React, { useState, useRef, useEffect } from 'react';

const GeminiChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form default submission (page reload)
    if (input.trim() === '' || isLoading) return; // Don't send empty messages or if AI is busy

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message
    setInput(''); // Clear input
    setIsLoading(true); // Show loading indicator

    try {
      // Make the API call to your backend serverless function
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }), // Send user's message
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage = { text: data.response, sender: 'ai' }; // AI's response
      setMessages((prevMessages) => [...prevMessages, aiMessage]); // Add AI message

    } catch (error) {
      console.error('Error communicating with Gemini AI:', error);
      const errorMessage = { text: `Error: ${error.message}. Please check your backend and API key.`, sender: 'system' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-secondary-dark rounded-lg shadow-xl flex flex-col h-[70vh] max-h-[800px] overflow-hidden border border-accent-blue-light">
      {/* Chat Messages Display Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-text-medium italic">
             Gemini  Personal Assistant for Chaitanya Yelamasetty 
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg break-words ${ // added break-words for long messages
                msg.sender === 'user'
                  ? 'bg-accent-blue-light text-white'
                  : msg.sender === 'ai'
                  ? 'bg-accent-blue text-text-light'
                  : 'bg-red-500 text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-accent-blue text-text-medium">
              AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-accent-blue-light bg-primary-dark">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
            className="flex-1 px-4 py-2 bg-secondary-dark border border-secondary-dark rounded-md text-text-light focus:outline-none focus:border-accent-blue-light disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-5 py-2 bg-accent-blue-light text-white font-semibold rounded-md hover:bg-accent-blue transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || input.trim() === ''}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeminiChatbot;