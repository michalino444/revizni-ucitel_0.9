'use client'
import { useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (input.trim() === '') return
    
    const userMsg: Message = { role: 'user', content: input }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      })
      const data = await res.json()
      const aiMsg: Message = { role: 'assistant', content: data.message }
      setMessages([...newMsgs, aiMsg])
    } catch (err) {
      console.error(err)
      const errMsg: Message = { role: 'assistant', content: 'Chyba. Zkus znovu.' }
      setMessages([...newMsgs, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
          AI Učitel - Revizní Technik Elektro
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-32">
              Začni konverzaci o revizích E2A, E2B, strojů nebo VN!
            </p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right mb-4' : 'text-left mb-4'}>
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-600">
                Učitel píše...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            placeholder="Napiš zprávu..."
            disabled={isLoading}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? 'Odesílám...' : 'Odeslat'}
          </button>
        </div>
      </div>
    </div>
  )
}
