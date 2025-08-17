'use client'

import { useEffect, useState } from 'react'
import { Edit3, Trash2, Plus, Settings } from 'lucide-react'
import Link from 'next/link'

interface AdminActionsProps {
  articleId?: string
  articleSlug?: string
  className?: string
}

export default function AdminActions({ articleId, articleSlug, className = '' }: AdminActionsProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (response.ok) {
        setIsAdmin(true)
      }
    } catch (error) {
      // User is not admin, which is fine
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!articleId) return
    
    if (confirm('Sind Sie sicher, dass Sie diesen Artikel löschen möchten?')) {
      try {
        // Redirect to admin dashboard after delete action
        window.location.href = `/dashboard-xy934k2_admin?delete=${articleId}`
      } catch (error) {
        console.error('Delete error:', error)
        alert('Fehler beim Löschen des Artikels')
      }
    }
  }

  // Don't render anything while loading or if not admin
  if (loading || !isAdmin) {
    return null
  }

  return (
    <div className={`admin-actions ${className}`}>
      {/* Floating Admin Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            {/* Dashboard Link */}
            <Link
              href="/dashboard-xy934k2_admin"
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Dashboard
            </Link>

            {/* New Article Link */}
            <Link
              href="/dashboard-xy934k2_admin/artikel/neu"
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neuer Artikel
            </Link>

            {/* Article-specific actions */}
            {articleId && (
              <>
                <hr className="border-gray-200" />
                
                <div className="text-xs text-gray-500 font-medium">
                  Artikel-Aktionen:
                </div>
                
                {/* Edit Article */}
                <Link
                  href={`/dashboard-xy934k2_admin/artikel/${articleId}/bearbeiten`}
                  className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Bearbeiten
                </Link>

                {/* Delete Article */}
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors w-full text-left"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Löschen
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified inline admin actions for article previews
export function InlineAdminActions({ articleId, className = '' }: { articleId: string, className?: string }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          setIsAdmin(true)
        }
      } catch (error) {
        // User is not admin
      }
    }

    checkAdminStatus()
  }, [])

  if (!isAdmin) {
    return null
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <Link
        href={`/dashboard-xy934k2_admin/artikel/${articleId}/bearbeiten`}
        className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
        title="Artikel bearbeiten"
      >
        <Edit3 className="w-3 h-3 mr-1" />
        Bearbeiten
      </Link>
    </div>
  )
}