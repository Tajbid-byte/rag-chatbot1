import { useEffect } from 'react'
import { useChat } from './hooks/useChat'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

function App() {
  const {
    messages, isLoading, isUploading, uploadProgress,
    uploadedDocs, error, sendMessage, uploadDocument,
    clearChat, clearDocuments
  } = useChat()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/health`)
      .catch(() => {})
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar
        uploadedDocs={uploadedDocs}
        onUpload={uploadDocument}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onClearDocs={clearDocuments}
        onClearChat={clearChat}
      />
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          hasDocuments={uploadedDocs.length > 0}
        />
      </div>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-700 text-red-200 text-sm px-4 py-3 rounded-xl shadow-xl max-w-sm z-50">
          <p>⚠️ {error}</p>
        </div>
      )}
    </div>
  )
}

export default App
