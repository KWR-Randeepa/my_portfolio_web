import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'projects'

  // Articles state
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    tags: '',
    readTime: '5 min',
    published: false
  });
  const [editingId, setEditingId] = useState(null);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tags: '',
    githubUrl: '',
    liveUrl: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/articles/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        console.error('Failed to fetch articles:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchProjects();
  }, []);

  // Handle Article Save
  const handleSave = async (e) => {
    e.preventDefault();

    // Auto-generate slug from title if empty
    let computedSlug = form.slug ? form.slug.trim() : '';
    if (!computedSlug && form.title) {
      computedSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const rawPayload = {
      ...form,
      slug: computedSlug,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags
    };

    // Remove immutable MongoDB fields
    const { _id, createdAt, updatedAt, __v, ...payload } = rawPayload;

    const url = editingId
      ? `http://localhost:5000/api/articles/${editingId}`
      : 'http://localhost:5000/api/articles';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: '', slug: '', summary: '', content: '', tags: '', readTime: '5 min', published: false });
        setEditingId(null);
        fetchArticles();
      } else {
        alert(`Failed to save article: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  };

  const handleEdit = (article) => {
    setEditingId(article._id);
    setForm({
      ...article,
      tags: article.tags ? article.tags.join(', ') : ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Delete failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
    fetchArticles();
  };

  // Handle Project Save
  const handleProjectSave = async (e) => {
    e.preventDefault();
    const rawPayload = {
      ...projectForm,
      tags: typeof projectForm.tags === 'string'
        ? projectForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : projectForm.tags
    };

    // Remove immutable MongoDB fields
    const { _id, createdAt, updatedAt, __v, ...payload } = rawPayload;

    const url = editingProjectId
      ? `http://localhost:5000/api/projects/${editingProjectId}`
      : 'http://localhost:5000/api/projects';
    const method = editingProjectId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setProjectForm({ title: '', description: '', tags: '', githubUrl: '', liveUrl: '' });
        setEditingProjectId(null);
        fetchProjects();
      } else {
        alert(`Failed to save project: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  };

  const handleProjectEdit = (proj) => {
    setEditingProjectId(proj._id);
    setProjectForm({
      ...proj,
      tags: proj.tags ? proj.tags.join(', ') : ''
    });
  };

  const handleProjectDelete = async (id) => {
    if (!window.confirm('Delete this system deployment card?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Delete failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold font-mono tracking-wider">COMMAND CENTER</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-900/40 text-red-300 border border-red-800 rounded font-mono text-sm hover:bg-red-900/70 transition-colors">
            Disconnect
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 rounded-xl font-mono text-sm font-bold border transition-all ${activeTab === 'articles'
                ? 'bg-slate-800 border-slate-500 text-white shadow-lg'
                : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
          >
            // ARTICLES LOGS ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-xl font-mono text-sm font-bold border transition-all ${activeTab === 'projects'
                ? 'bg-slate-800 border-slate-500 text-white shadow-lg'
                : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
          >
            // SYSTEM DEPLOYMENTS ({projects.length})
          </button>
        </div>

        {/* ARTICLES TAB */}
        {activeTab === 'articles' && (
          <div>
            <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl border border-slate-800 mb-12 space-y-4">
              <h2 className="text-lg font-mono font-bold text-slate-300">
                {editingId ? 'EDIT ARTICLE' : 'CREATE NEW ARTICLE'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Article Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug (optional, auto-generated if blank)"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tags (comma-separated: Cisco, Docker, Linux)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white"
                />
                <input
                  type="text"
                  placeholder="Read Time (e.g., 6 min)"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white"
                />
              </div>

              <textarea
                placeholder="Short Summary..."
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full bg-black/50 border border-slate-700 p-3 rounded text-white"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  placeholder="Write raw markdown here..."
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-black/50 border border-slate-700 p-3 rounded text-white font-mono text-sm"
                  required
                />
                <div className="p-4 bg-black/30 border border-slate-800 rounded overflow-y-auto max-h-[300px] prose prose-invert">
                  <span className="text-xs font-mono text-slate-500 uppercase block mb-2">Live Preview</span>
                  <ReactMarkdown>{form.content || '*Preview output will render here...*'}</ReactMarkdown>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  />
                  Publish to Main Feed
                </label>
                <button type="submit" className="px-6 py-2 bg-slate-800 text-white border border-slate-600 rounded font-bold">
                  {editingId ? 'Update Article' : 'Create Article'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ title: '', slug: '', summary: '', content: '', tags: '', readTime: '5 min', published: false });
                    }}
                    className="px-4 py-2 border border-slate-700 text-slate-400 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 font-mono text-slate-400">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {articles.map((art) => (
                    <tr key={art._id} className="hover:bg-slate-900/30">
                      <td className="p-4 font-semibold text-white">{art.title}</td>
                      <td className="p-4 font-mono text-xs">
                        <span className={`px-2 py-1 rounded ${art.published ? 'bg-green-950 text-green-400' : 'bg-yellow-950 text-yellow-400'}`}>
                          {art.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{new Date(art.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEdit(art)} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(art._id)} className="px-3 py-1 bg-red-950/40 border border-red-900 rounded text-red-400">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SYSTEM DEPLOYMENTS / PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <form onSubmit={handleProjectSave} className="glass-panel p-6 rounded-2xl border border-slate-800 mb-12 space-y-4">
              <h2 className="text-lg font-mono font-bold text-slate-300">
                {editingProjectId ? 'EDIT SYSTEM DEPLOYMENT' : 'ADD NEW SYSTEM DEPLOYMENT'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Deployment / Project Title (e.g., MediFind)"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated: Geospatial, Full-Stack, React)"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white"
                />
              </div>

              <textarea
                placeholder="Description / Overview..."
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full bg-black/50 border border-slate-700 p-3 rounded text-white"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="GitHub Repository URL (Optional)"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white font-mono text-sm"
                />
                <input
                  type="url"
                  placeholder="Live Deployment URL (Optional)"
                  value={projectForm.liveUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="bg-black/50 border border-slate-700 p-3 rounded text-white font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" className="px-6 py-2 bg-slate-800 text-white border border-slate-600 rounded font-bold">
                  {editingProjectId ? 'Update Deployment Card' : 'Add Deployment Card'}
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm({ title: '', description: '', tags: '', githubUrl: '', liveUrl: '' });
                    }}
                    className="px-4 py-2 border border-slate-700 text-slate-400 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 font-mono text-slate-400">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Tags</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {projects.map((proj) => (
                    <tr key={proj._id} className="hover:bg-slate-900/30">
                      <td className="p-4 font-semibold text-white whitespace-nowrap">{proj.title}</td>
                      <td className="p-4 text-slate-300 max-w-xs truncate">{proj.description}</td>
                      <td className="p-4 font-mono text-xs text-slate-400">
                        {proj.tags?.join(', ')}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button onClick={() => handleProjectEdit(proj)} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300">
                          Edit
                        </button>
                        <button onClick={() => handleProjectDelete(proj._id)} className="px-3 py-1 bg-red-950/40 border border-red-900 rounded text-red-400">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}