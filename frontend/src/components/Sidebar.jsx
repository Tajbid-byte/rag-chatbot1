import FileUpload from './FileUpload'

const Sidebar = ({ uploadedDocs, onUpload, isUploading, uploadProgress, onClearDocs, onClearChat }) => {
  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm">🤖</div>
          <div>
            <h1 className="font-bold text-white text-sm">RAG Chatbot</h1>
            <p className="text-xs text-gray-400">Powered by Groq FREE</p>
          </div>
        </div>
      </div>

      <FileUpload onUpload={onUpload} isUploading={isUploading} uploadProgress={uploadProgress} />

      <div className="flex-1 overflow-y-auto px-4">
        {uploadedDocs.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              📚 Documents ({uploadedDocs.length})
            </h3>
            <div className="space-y-2">
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 text-sm mt-0.5">📕</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-200 truncate">{doc.filename}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.chunks} chunks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-4xl mb-2">📂</p>
            <p className="text-xs text-gray-500">No documents uploaded yet</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 space-y-2">
        {uploadedDocs.length > 0 && (
          <button onClick={onClearDocs}
            className="w-full text-xs px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800 rounded-lg transition-colors">
            🗑️ Clear All Documents
          </button>
        )}
        <button onClick={onClearChat}
          className="w-full text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 rounded-lg transition-colors">
          💬 Clear Chat History
        </button>
        <div className="text-center pt-2">
          <p className="text-xs text-gray-600">⚡ Llama 3.1 70B</p>
        </div>
      </div>
    </div>
  )
}
export default Sidebar
