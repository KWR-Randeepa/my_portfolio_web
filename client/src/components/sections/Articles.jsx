import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error('Failed to fetch articles:', err));
  }, []);

  return (
    <section id="articles" className="py-32 px-6 max-w-6xl mx-auto relative z-10">
      <h2 className="text-3xl font-bold mb-16 text-white flex items-center gap-4 reveal">
        <span className="w-10 h-[2px] bg-slate-400"></span> Published Logs & Articles
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <Link
            to={`/articles/${art.slug}`}
            key={art._id}
            className="glass-panel p-6 rounded-2xl hover:border-slate-400 transition-colors flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-3">
                <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                <span>{art.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">
                {art.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3 font-light">
                {art.summary}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap text-xs font-mono">
              {art.tags?.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                  #{t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}