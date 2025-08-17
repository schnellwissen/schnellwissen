'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, Image as ImageIcon, Link as LinkIcon, Bold, Italic, List, AlignLeft, AlignCenter, Quote, Code, FileCode } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Schreiben Sie hier...",
  className = ""
}: RichTextEditorProps) {
  const [quill, setQuill] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsClient(true)
    setHtmlContent(value)
  }, [])

  // Toggle between visual and HTML mode
  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching from HTML to visual mode
      if (quill) {
        quill.root.innerHTML = htmlContent
        onChange(htmlContent)
      }
    } else {
      // Switching from visual to HTML mode
      if (quill) {
        setHtmlContent(quill.root.innerHTML)
      } else {
        setHtmlContent(value)
      }
    }
    setIsHtmlMode(!isHtmlMode)
  }

  // Handle HTML content change
  const handleHtmlChange = (newHtml: string) => {
    setHtmlContent(newHtml)
    onChange(newHtml)
  }

  useEffect(() => {
    if (!isClient) return

    const initQuill = async () => {
      try {
        // Dynamically import Quill to avoid SSR issues
        const { default: Quill } = await import('quill')
        
        // Import Quill styles - removed due to build issues
        // The styles will be loaded manually or through global CSS

        if (editorRef.current && !quill) {
          // Custom toolbar configuration
          const toolbarOptions = [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
          ]

          const quillInstance = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder,
            modules: {
              toolbar: {
                container: toolbarOptions,
                handlers: {
                  image: function() {
                    const input = document.createElement('input')
                    input.setAttribute('type', 'file')
                    input.setAttribute('accept', 'image/*')
                    input.click()

                    input.onchange = async () => {
                      const file = input.files?.[0]
                      if (file) {
                        // Convert image to base64 for demo purposes
                        // In production, you would upload to your server
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          const range = quillInstance.getSelection()
                          if (range) {
                            quillInstance.insertEmbed(range.index, 'image', e.target?.result)
                          }
                        }
                        reader.readAsDataURL(file)
                      }
                    }
                  }
                }
              }
            }
          })

          // Set initial content
          if (value) {
            quillInstance.root.innerHTML = value
          }

          // Listen for changes
          quillInstance.on('text-change', () => {
            const html = quillInstance.root.innerHTML
            onChange(html)
          })

          setQuill(quillInstance)
        }
      } catch (error) {
        console.error('Error initializing Quill:', error)
      }
    }

    initQuill()
  }, [isClient, value, onChange, placeholder, quill])

  // Update editor content when value prop changes
  useEffect(() => {
    if (quill && value !== quill.root.innerHTML && !isHtmlMode) {
      quill.root.innerHTML = value
    }
    if (isHtmlMode) {
      setHtmlContent(value)
    }
  }, [value, quill, isHtmlMode])

  // Always show the full editor with HTML mode, even during SSR
  if (!isClient) {
    return (
      <div className={`bg-white border border-gray-300 rounded-lg ${className}`}>
        {/* Custom Toolbar */}
        <div className="border-b border-gray-300 p-2 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">HTML Modus</span>
          </div>
          <button
            type="button"
            className="px-3 py-1 text-sm bg-blue-600 text-white border border-blue-600 rounded transition-colors"
          >
            <FileCode className="w-4 h-4 inline mr-1" />
            HTML
          </button>
        </div>

        {/* HTML Editor */}
        <div className="p-0">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Fügen Sie hier Ihren HTML-Code ein..."
            className="w-full h-96 p-4 border-0 font-mono text-sm resize-none focus:outline-none bg-gray-50"
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace' }}
          />
          <div className="p-3 bg-gray-100 border-t text-xs text-gray-600">
            <strong>HTML Modus:</strong> Fügen Sie kompletten HTML-Code ein, inklusive Bilder, Tabellen und erweiterte Formatierung.
            <br />
            <strong>Tipp:</strong> Sie können ganze HTML-Artikel mit &lt;img&gt;, &lt;table&gt;, &lt;figure&gt; und anderen Tags einfügen.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-300 rounded-lg ${className}`}>
      {/* Custom Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {isHtmlMode ? 'HTML Modus' : 'Visueller Modus'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleHtmlMode}
            className={`px-3 py-1 text-sm border rounded transition-colors ${
              isHtmlMode 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300'
            }`}
          >
            <FileCode className="w-4 h-4 inline mr-1" />
            HTML
          </button>
        </div>
      </div>

      {/* Editor Content */}
      {isHtmlMode ? (
        <div className="p-0">
          <textarea
            ref={textareaRef}
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            placeholder="Fügen Sie hier Ihren HTML-Code ein..."
            className="w-full h-96 p-4 border-0 font-mono text-sm resize-none focus:outline-none bg-gray-50"
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace' }}
          />
          <div className="p-3 bg-gray-100 border-t text-xs text-gray-600">
            <strong>HTML Modus:</strong> Fügen Sie kompletten HTML-Code ein, inklusive Bilder, Tabellen und erweiterte Formatierung.
            <br />
            <strong>Tipp:</strong> Sie können ganze HTML-Artikel mit &lt;img&gt;, &lt;table&gt;, &lt;figure&gt; und anderen Tags einfügen.
          </div>
        </div>
      ) : (
        <div ref={editorRef} className="min-h-[300px]" />
      )}
    </div>
  )
}