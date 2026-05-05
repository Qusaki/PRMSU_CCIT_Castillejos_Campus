import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, Trash2, X, MapPin, Clock, Loader2, ImagePlus, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface EventItem {
  id: number;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image_urls: string[];
  created_at: string | null;
  updated_at: string | null;
}

export default function EventsManage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImages(files);
    if (files) {
      const previews: string[] = [];
      for (let i = 0; i < files.length; i++) {
        previews.push(URL.createObjectURL(files[i]));
      }
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEventDate('');
    setVenue('');
    setImages(null);
    setImagePreviews([]);
    setError('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !eventDate || !venue) {
      setError('All text fields are required.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('event_date', new Date(eventDate).toISOString());
    formData.append('venue', venue);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/events/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        resetForm();
        fetchEvents();
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to create event.');
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
      const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
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
          <h2 className="text-2xl font-bold text-gray-900 font-display">Events Management</h2>
          <p className="text-gray-500 mt-1">Create, view, and delete campus events.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-prmsu-maroon text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-sm"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5"
        >
          <h3 className="text-lg font-bold text-gray-900 border-b pb-3">New Event</h3>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prmsu-maroon/30 focus:border-prmsu-maroon outline-none transition-all"
                placeholder="e.g., CCIT Tech Summit 2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prmsu-maroon/30 focus:border-prmsu-maroon outline-none transition-all"
                placeholder="e.g., CCIT Building, Room 201"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prmsu-maroon/30 focus:border-prmsu-maroon outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prmsu-maroon/30 focus:border-prmsu-maroon outline-none transition-all resize-none"
              placeholder="Describe the event..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images (optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-prmsu-maroon/50 hover:bg-gray-50 transition-all">
              <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreviews.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i}`} className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm" />
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
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No events yet</h3>
          <p className="text-gray-400 mt-1">Click "Add Event" to create your first campus event.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5 flex flex-col sm:flex-row gap-4">
                {/* Thumbnail */}
                {event.image_urls && event.image_urls.length > 0 && (
                  <img
                    src={event.image_urls[0]}
                    alt={event.title}
                    className="w-full sm:w-32 h-32 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                  />
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {event.venue}
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <div className="flex-shrink-0 flex items-start">
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deleteId === event.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete event"
                  >
                    {deleteId === event.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
