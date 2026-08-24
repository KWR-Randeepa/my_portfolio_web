import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      login(data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="glass-panel p-8 md:p-10 rounded-3xl border border-slate-800 w-full max-w-md">
        <h2 className="text-2xl font-bold font-mono text-white mb-2 tracking-widest text-center">
          SYSTEM ACCESS
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-6 text-center">
          IDENTIFY TO PROCEED
        </p>

        {error && (
          <div className="p-3 mb-4 bg-red-950/40 border border-red-800 rounded text-red-400 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
              Identity ID
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-slate-400"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
              Passkey
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-slate-800 text-white border border-slate-600 rounded font-bold tracking-widest hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHORIZE'}
          </button>
        </form>
      </div>
    </div>
  );
}