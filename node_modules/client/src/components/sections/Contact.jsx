import React, { useState } from 'react';
import API_BASE_URL from '../../config/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, msg: '', isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: '', isError: false });

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text || `Server error (${res.status})` };
      }

      if (res.ok) {
        setStatus({ loading: false, msg: 'Payload delivered successfully.', isError: false });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ loading: false, msg: data.error || `Failed with status ${res.status}`, isError: true });
      }
    } catch (err) {
      setStatus({ loading: false, msg: err.message || 'Network or connection error.', isError: true });
    }
  };

  return (
    <section id="contact" className="py-32 px-6 max-w-3xl mx-auto relative z-10">
      <div className="bg-[#141416]/60 backdrop-blur-xl border border-slate-700/50 p-10 rounded-3xl relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Open Transmission Line</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
              <label className="text-xs font-mono text-slate-400 uppercase">Identity</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/50 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-slate-400"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
              <label className="text-xs font-mono text-slate-400 uppercase">Network</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/50 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-slate-400"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Payload</label>
            <textarea
              rows="4"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-black/50 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-slate-400 resize-none"
              placeholder="Message content..."
            />
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="w-full py-4 bg-slate-800 text-white border border-slate-600 rounded font-bold tracking-widest hover:bg-slate-700 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] disabled:opacity-50"
          >
            {status.loading ? 'TRANSMITTING...' : 'TRANSMIT DATA'}
          </button>
          {status.msg && (
            <p className={`text-center text-sm font-mono ${status.isError ? 'text-red-400' : 'text-green-400'}`}>
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}