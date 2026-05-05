import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Users, Calendar, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventCount, setEventCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const eventsRes = await fetch(`${API_BASE_URL}/api/events/`);
        if (eventsRes.ok) {
          const events = await eventsRes.json();
          setEventCount(events.length);
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    { title: 'Total Admins', value: '1', icon: <Users className="w-6 h-6 text-blue-500" /> },
    {
      title: 'Events',
      value: eventCount !== null ? String(eventCount) : '...',
      icon: <Calendar className="w-6 h-6 text-green-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Welcome back, {user?.username}!</h2>
          <p className="text-gray-500 mt-1">Here's what's happening today.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-medium">Admin Access Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/admin/events')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Add New Event
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
            <Users className="w-5 h-5" />
            Manage Admins
          </button>
        </div>
      </div>
    </div>
  );
}
