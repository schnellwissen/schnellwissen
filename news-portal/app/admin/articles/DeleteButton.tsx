'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  id: string;
  title?: string;
}

export default function DeleteButton({ id, title }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmMessage = title 
      ? `Sind Sie sicher, dass Sie den Artikel "${title}" löschen möchten?`
      : 'Sind Sie sicher, dass Sie diesen Artikel löschen möchten?';
      
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/articles/${id}`, {
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