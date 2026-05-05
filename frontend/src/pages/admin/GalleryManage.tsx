import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Image as ImageIcon, Plus, Trash2, X, Loader2, Upload, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface GalleryItem {
  id: number;
  filename: string;
  file_url: string;
  created_at: string;
}

export default function GalleryManage() {
  const { token } = useAuth();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Form state
  const [files, setFiles] = useState<FileList | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    setFiles(selected);
    if (selected) {
      const previews: string[] = [];
      for (let i = 0; i < selected.length; i++) {
        previews.push(URL.createObjectURL(selected[i]));
      }
      setFilePreviews(previews);
    } else {
      setFilePreviews([]);
    }
  };

  const resetForm = () => {
    setFiles(null);
    setFilePreviews([]);
    setError('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!files || files.length === 0) {
      setError('Please select at least one image to upload.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        resetForm();
        fetchImages();
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to upload images.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete image:', err);
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-prmsu-maroon" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Gallery Management</h2>
          <p className="text-gray-500 mt-1">Upload and manage campus gallery images.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-prmsu-maroon text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-sm"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Upload Images'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5"
        >
          <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Upload New Images</h3>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-prmsu-maroon/50 hover:bg-gray-50 transition-all">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">Click to select images</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP supported</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {filePreviews.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {filePreviews.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i}`} className="w-24 h-24 rounded-lg object-cover border border-gray-200 shadow-sm" />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-prmsu-maroon text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No images yet</h3>
          <p className="text-gray-400 mt-1">Click "Upload Images" to populate the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square bg-gray-50">
              <img
                src={img.file_url}
                alt={img.filename}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxUrl(img.file_url)}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                <span className="text-white text-xs truncate max-w-[70%]">
                  {new Date(img.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                  disabled={deleteId === img.id}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteId === img.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxUrl}
            alt="Full view"
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
