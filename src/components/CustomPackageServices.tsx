import React, { useState } from 'react';
export function readCustomServices(value: unknown): string[] {
  try { const data = typeof value === 'string' ? JSON.parse(value) : value; return Array.isArray(data) ? data.filter(item => typeof item === 'string') : []; } catch { return []; }
}
const predefined = ['catering', 'stage decoration', 'flower decoration', 'lighting', 'photography', 'videography', 'sound system', 'dj setup'];
export default function CustomPackageServices({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const add = () => {
    const service = name.trim().replace(/\s+/g, ' ');
    if (!service || service.length > 100 || value.length >= 50) { setError('Enter a service name (1–100 characters; maximum 50 custom services).'); return; }
    if ([...predefined, ...value.map(item => item.toLowerCase())].includes(service.toLowerCase())) { setError('This service already exists.'); return; }
    onChange([...value, service]); setName(''); setError('');
  };
  return <div className="mt-4 border-t pt-3">
    <label htmlFor="custom-package-service" className="block text-sm font-medium mb-2">Add a custom service</label>
    <div className="flex gap-2"><input id="custom-package-service" value={name} maxLength={100} onChange={event => setName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); add(); } }} placeholder="e.g. Valet Parking" className="border rounded-lg p-2 flex-1 min-w-0" /><button type="button" onClick={add} className="bg-[#0c2d67] text-white rounded-lg px-3">Add service</button></div>
    {error && <p role="alert" className="text-red-600 text-sm mt-1">{error}</p>}
    <ul className="mt-2 space-y-2">{value.map(service => <li key={service} className="flex justify-between items-center text-sm"><label className="flex gap-2"><input type="checkbox" checked onChange={() => onChange(value.filter(item => item !== service))} />{service}</label><button type="button" aria-label={`Remove ${service}`} onClick={() => onChange(value.filter(item => item !== service))} className="text-red-600">Remove</button></li>)}</ul>
  </div>;
}
