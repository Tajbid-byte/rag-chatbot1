import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { chatAPI, documentAPI } from '../services/api'

export const useChat = () => {
  const [messages, setMessages] = useState([{
    id: uuidv4(),
    role: 'assistant',
    content: '👋 Hello! I am your AI document assistant powered by FREE Groq AI. Upload a PDF and ask me anything!',
    sources: [],
    timestamp: new Date()
  }])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => uuidv4())
  const [uploadedDocs, setUploadedDocs] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return
    const userMessage = { id: uuidv4(), role: 'user', content: content.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await chatAPI.sendMessage(content, sessionId)
      setMessages(prev => [...prev, {
        id: uuidv4(), role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        has_context: response.has_context,
        timestamp: new Date()
      }])
    } catch (err) {
      setError(err.message)
      setMessages(prev => [...prev, {
        id: uuidv4(), role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        sources: [], isError: true, timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, sessionId])

  const uploadDocument = useCallback(async (file) => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    try {
      const result = await documentAPI.upload(file, setUploadProgress)
      setUploadedDocs(prev => [...prev, {
        id: result.doc_id, filename: result.filename,
        chunks: result.chunks_created, uploadedAt: new Date()
      }])
      setMessages(prev => [...prev, {
        id: uuidv4(), role: 'assistant',
        content: `✅ ${result.filename} uploaded! Created ${result.chunks_created} chunks. Ask me anything!`,
        sources: [], timestamp: new Date()
      }])
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const clearChat = useCallback(async () => {
    await chatAPI.clearHistory(sessionId)
    setMessages([{
      id: uuidv4(), role: 'assistant',
      content: '🔄 Chat cleared!',
      sources: [], timestamp: new Date()
    }])
  }, [sessionId])

  const clearDocuments = useCallback(async () => {
    await documentAPI.clear()
    setUploadedDocs([])
  }, [])

  return {
    messages, isLoading, isUploading, uploadProgress,
    uploadedDocs, error, sessionId,
    sendMessage, uploadDocument, clearChat, clearDocuments
  }
}
