import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '@/Config/Api';

export default function SalesmanNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  const refresh = async () => {
    try {
      const [list, unread] = await Promise.all([axios.get(`${BASE_URL}/api/salesman/notifications`, config()), axios.get(`${BASE_URL}/api/salesman/notifications/unread-count`, config())]);
      setItems(list.data.data || []); setCount(Number(unread.data.count) || 0); setError('');
    } catch { setError('Unable to load notifications. Try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    refresh(); const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', escape);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); window.removeEventListener('keydown', escape); };
  }, []);
  const read = async (item: any) => {
    try {
      if (!item.is_read) await axios.put(`${BASE_URL}/api/salesman/notifications/${item.id}/read`, {}, config());
      await refresh();
      setOpen(false);
      navigate(`/salesman/order-details/${item.order_id}?source=${item.order_source === 'admin' ? 'admin' : 'salesman'}`);
    } catch { setError('Unable to mark notification read. Please retry.'); }
  };
  const readAll = async () => {
    try { await axios.put(`${BASE_URL}/api/salesman/notifications/read-all`, {}, config()); await refresh(); }
    catch { setError('Unable to mark notifications read.'); }
  };
  return <div className="relative">
    <button type="button" aria-label={`Notifications (${count} unread)`} aria-expanded={open} onClick={() => { setOpen(!open); refresh(); }} className="relative p-2 rounded-lg hover:bg-white/10">
      <Bell size={22} />{count > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{count > 99 ? '99+' : count}</span>}
    </button>
    {open && <section aria-label="Notifications" className="absolute right-0 top-12 w-[min(22rem,90vw)] max-h-[70vh] overflow-auto bg-white text-gray-900 shadow-xl rounded-xl border z-50 p-3">
      <div className="flex justify-between items-center mb-3"><strong>Notifications</strong><button onClick={() => setOpen(false)} aria-label="Close notifications">×</button></div>
      {count > 0 && <button onClick={readAll} className="text-sm text-blue-700 mb-2">Mark all as read</button>}
      {error && <p role="alert">{error} <button onClick={refresh}>Retry</button></p>}
      {loading ? <p>Loading notifications…</p> : !items.length ? <p>No notifications yet.</p> : items.map(item => <button key={item.id} onClick={() => read(item)} className={`block w-full text-left p-3 rounded-lg mb-1 ${item.is_read ? 'bg-white' : 'bg-blue-50'}`}>
        <strong className="text-sm">{item.title}</strong><p className="text-sm">{item.message}</p><time className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</time>
      </button>)}
    </section>}
  </div>;
}
