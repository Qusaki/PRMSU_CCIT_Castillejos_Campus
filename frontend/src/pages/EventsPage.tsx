import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface EventItem {
  id: number;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image_urls: string[];
}

function EventPageSlider({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 1) {
    return (
      <div className="h-56 sm:h-64 overflow-hidden rounded-xl bg-gray-100">
        <img src={images[0]} alt={title} className="w-full h-full object-contain transition-transform duration-500" />
      </div>
    );
  }

  return (
    <div className="h-56 sm:h-64 relative overflow-hidden rounded-xl bg-gray-100">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`${title} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-white scale-110' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events/`)
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-prmsu-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-prmsu-gold hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              All Campus Events
            </h1>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl">
              Stay updated with everything happening at PRMSU CCIT Castillejos Campus.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-prmsu-maroon"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-500">No events posted yet</h2>
            <p className="text-gray-400 mt-2">Check back later for upcoming campus events.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                {event.image_urls && event.image_urls.length > 0 ? (
                  <EventPageSlider images={event.image_urls} title={event.title} />
                ) : (
                  <div className="h-56 sm:h-64 bg-gradient-to-br from-prmsu-maroon/10 to-prmsu-gold/10 flex items-center justify-center rounded-t-2xl">
                    <Calendar className="w-14 h-14 text-prmsu-maroon/20" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-prmsu-dark mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-prmsu-gold" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-prmsu-gold" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
