'use client';
import { warnOptionHasBeenMovedOutOfExperimental } from 'next/dist/server/config';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
  if (input.trim() === '') return;
  
  // Přidej uživatelovu zprávu
  const newMessages = [...messages, { role: 'user', content: input }];
  setMessages(newMessages);
  setInput('');
  
  try {
    // Zavolej API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: newMessages }),
    });
    
    const data = await response.json();
    
    // Přidej odpověď AI
    setMessages([...newMessages, { 
      role: 'assistant', 
      content: data.message 
    }]);
  } catch (error) {
    console.error('Chyba:', error);
    setMessages([...newMessages, { 
      role: 'assistant', 
      content: 'Omlouvám se, nastala chyba. Zkus to prosím znovu.' 
    }]);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          AI Učitel - Revizní Technik Elektro
        </h1>
        
        {/* Chat oblast */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-32">
              Začni konverzaci... Zeptej se na cokoliv o revizích E2A, E2B, strojů nebo VN zařízení!
            </p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input pole */}
        <div className="flex gap-2">
          <input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
  placeholder="Napiš svou zprávu..."
  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Odeslat
          </button>
        </div>
      </div>
    </div>
  );
}