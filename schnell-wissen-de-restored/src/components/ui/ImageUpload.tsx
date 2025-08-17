'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle, Link2, Camera } from 'lucide-react'
import { uploadFile, validateImageFile, formatFileSize, getImageDimensions } from '@/lib/upload'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  className?: string
  accept?: string
  maxSize?: number
  placeholder?: string
}

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  className = '',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  placeholder = 'Klicken Sie hier oder ziehen Sie ein Bild herein'
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false
  })
  const [dragActive, setDragActive] = useState(false)
  const [imageInfo, setImageInfo] = useState<{
    dimensions?: { width: number; height: number }
    size?: number
    name?: string
  }>({})
  const [inputMode, setInputMode] = useState<'upload' | 'link'>('upload')
  const [linkUrl, setLinkUrl] = useState('')
  const [isValidatingLink, setIsValidatingLink] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Reset states
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false
    })

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setUploadState(prev => ({
        ...prev,
        error: validation.error || 'Invalid file'
      }))
      return
    }

    // Get image dimensions
    try {
      const dimensions = await getImageDimensions(file)
      setImageInfo({
        dimensions,
        size: file.size,
        name: file.name
      })
    } catch (error) {
      console.warn('Could not get image dimensions:', error)
    }

    // Start upload
    setUploadState(prev => ({
      ...prev,
      uploading: true,
      progress: 0
    }))

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 30, 90)
        }))
      }, 200)

      const result = await uploadFile(file)

      clearInterval(progressInterval)

      if (result.success && result.url) {
        setUploadState({
          uploading: false,
          progress: 100,
          error: null,
          success: true
        })
        onChange(result.url)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
        success: false
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false
    })
    setImageInfo({})
    onRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!uploadState.uploading && !value) {
      fileInputRef.current?.click()
    }
  }

  const handleLinkSubmit = async () => {
    if (!linkUrl.trim()) {
      setUploadState(prev => ({
        ...prev,
        error: 'Bitte geben Sie eine Bild-URL ein'
      }))
      return
    }

    setIsValidatingLink(true)
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false
    })

    try {
      // Validate URL format
      const url = new URL(linkUrl)
      
      // Check if it's an image URL (basic check)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
      const hasImageExtension = imageExtensions.some(ext => 
        url.pathname.toLowerCase().endsWith(ext)
      )
      
      // Also accept URLs from known image hosting services
      const imageHosts = ['unsplash.com', 'pexels.com', 'pixabay.com', 'imgur.com', 'cloudinary.com']
      const isImageHost = imageHosts.some(host => url.hostname.includes(host))
      
      if (!hasImageExtension && !isImageHost) {
        // Warn but don't block
        console.warn('URL might not be an image:', linkUrl)
      }

      // Set the URL
      onChange(linkUrl)
      setUploadState({
        uploading: false,
        progress: 100,
        error: null,
        success: true
      })
      setLinkUrl('')
    } catch (error) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: 'Ungültige URL. Bitte geben Sie eine gültige Bild-URL ein.',
        success: false
      })
    } finally {
      setIsValidatingLink(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Mode selector tabs - only show when no image is selected */}
      {!value && (
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              inputMode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Bild hochladen
          </button>
          <button
            type="button"
            onClick={() => setInputMode('link')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              inputMode === 'link'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Link2 className="w-4 h-4 inline mr-2" />
            Link einfügen
          </button>
        </div>
      )}

      {/* Upload area or image preview */}
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-64 object-cover rounded-lg border border-gray-300"
          />
          
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Bild entfernen"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image info overlay */}
          {imageInfo.dimensions && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {imageInfo.dimensions.width} × {imageInfo.dimensions.height}
              {imageInfo.size && ` • ${formatFileSize(imageInfo.size)}`}
            </div>
          )}

          {/* Success indicator */}
          {uploadState.success && (
            <div className="absolute top-2 left-2 p-1 bg-green-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
      ) : inputMode === 'link' ? (
        // Link input mode
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLinkSubmit()
                }
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isValidatingLink}
            />
            <button
              type="button"
              onClick={handleLinkSubmit}
              disabled={isValidatingLink || !linkUrl.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isValidatingLink ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Hinzufügen'
              )}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            <p>Fügen Sie einen direkten Link zu einem Bild ein.</p>
            <p className="mt-1">Unterstützte Formate: JPG, PNG, GIF, WebP, SVG</p>
          </div>
        </div>
      ) : (
        // Upload mode
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploadState.uploading ? 'pointer-events-none' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {uploadState.uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <span className="text-gray-600">Bild wird hochgeladen...</span>
              <div className="w-full max-w-xs mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">
                  {Math.round(uploadState.progress)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                {uploadState.error ? (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="text-gray-600 text-center mb-2">
                {placeholder}
              </p>
              <p className="text-sm text-gray-500 text-center">
                PNG, JPG, GIF, WebP bis zu {formatFileSize(maxSize)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {uploadState.error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm text-red-700">{uploadState.error}</span>
          </div>
        </div>
      )}

      {/* Success message */}
      {uploadState.success && !uploadState.error && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-sm text-green-700">
              Bild erfolgreich hochgeladen!
              {imageInfo.name && ` (${imageInfo.name})`}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}