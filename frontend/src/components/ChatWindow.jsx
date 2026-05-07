import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import LoadingSpinner from './LoadingSpinner'

const ChatWindow = ({ messages, isLoading, onSendMessage, hasDocuments }) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const suggestedQuestions = [
    "What is this document about?",
    "Summarize the key points",
    "What are the main conclusions?",
    "List important dates or facts"
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">AI Document Chat</h2>
            <p className="text-xs text-gray-400">
              {hasDocuments ? '🟢 Documents loaded - Ready to chat' : '🟡 Upload a PDF to get started'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full border border-green-800">
              FREE
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs">🤖</div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" color="blue" />
                <span className="text-sm text-gray-400">Thinking with Llama 3.1...</span>
              </div>
            </div>
          </div>
        )}

        {messages.length === 1 && hasDocuments && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-3 text-center">💡 Try asking:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button key={idx} onClick={() => onSendMessage(q)}
                  className="text-xs text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white transition-all hover:border-blue-600">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasDocuments ? "Ask anything about your documents..." : "Upload a PDF first..."}
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
          />
          <button type="submit" disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
              ${input.trim() && !isLoading ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>
            {isLoading ? <LoadingSpinner size="sm" color="white" /> : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-600 text-center mt-2">
          Press Enter to send - Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
export default ChatWindow
