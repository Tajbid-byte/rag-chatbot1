import ReactMarkdown from 'react-markdown'

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user'
  const isError = message.isError

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0
            ${isUser ? 'bg-blue-600' : isError ? 'bg-red-800' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
            {isUser ? '👤' : '🤖'}
          </div>
          <div className={`rounded-2xl px-4 py-3 max-w-full
            ${isUser ? 'bg-blue-600 text-white rounded-br-sm'
              : isError ? 'bg-red-900/30 border border-red-800 text-red-200 rounded-bl-sm'
              : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-sm'}`}>
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 ml-9">
            <p className="text-xs text-gray-500 mb-1">📎 Sources:</p>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((source, idx) => (
                <span key={idx}
                  className="text-xs bg-gray-900 border border-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                  📄 {source.filename}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default MessageBubble
