'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  articleId: string;
  articleTitle: string;
}

export default function DeleteButton({ articleId, articleTitle }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Sind Sie sicher, dass Sie den Artikel "${articleTitle}" löschen möchten?`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Fehler beim Löschen des Artikels');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Fehler beim Löschen des Artikels');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isDeleting ? 'Löschen...' : 'Löschen'}
    </button>
  );
}