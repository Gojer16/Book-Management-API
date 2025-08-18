import { useState } from 'react';

interface UseImageUploadReturn {
  uploadImage: (file: File, bookId: string) => Promise<string | null>;
  isUploading: boolean;
  uploadError: string | null;
  clearError: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File, bookId: string): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('cover', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/books/${bookId}/upload-cover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();

      return data.book.coverUrl;

    } 
    catch (error) 
    {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const clearError = () => {
    setUploadError(null);
  };

  return {
    uploadImage,
    isUploading,
    uploadError,
    clearError,
  };
};
