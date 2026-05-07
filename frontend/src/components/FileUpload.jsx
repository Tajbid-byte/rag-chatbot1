import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import LoadingSpinner from './LoadingSpinner'

const FileUpload = ({ onUpload, isUploading, uploadProgress }) => {
  const [dragError, setDragError] = useState(null)

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setDragError(null)
    if (rejectedFiles.length > 0) {
      setDragError('Please upload PDF files only (max 10MB)')
      return
    }
    if (acceptedFiles.length > 0) {
      try {
        await onUpload(acceptedFiles[0])
      } catch (err) {
        setDragError(err.message)
      }
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isUploading
  })

  return (
    <div className="p-4">
      <div {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-400 bg-blue-500/10' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}
          ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="space-y-3">
            <div className="flex justify-center"><LoadingSpinner size="lg" color="blue" /></div>
            <p className="text-sm text-gray-300">Processing PDF...</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-xs text-gray-400">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-4xl">{isDragActive ? '📂' : '📄'}</div>
            <div>
              <p className="text-sm font-medium text-gray-200">
                {isDragActive ? 'Drop your PDF here!' : 'Upload PDF Document'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Drag and drop or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">PDF only - Max 10MB</p>
            </div>
          </div>
        )}
      </div>
      {dragError && <p className="text-red-400 text-xs mt-2 text-center">{dragError}</p>}
    </div>
  )
}
export default FileUpload
