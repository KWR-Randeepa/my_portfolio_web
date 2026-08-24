import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import NodeNetworkScene from '../components/3d/NodeNetworkScene';
import API_BASE_URL from '../config/api';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/articles/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setArticle(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center font-mono text-slate-400">
        <NodeNetworkScene />
        <span className="relative z-10 bg-black/60 px-6 py-3 rounded-full border border-slate-800 backdrop-blur-md">
          LOADING TRANSMISSION DATA...
        </span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="relative min-h-screen flex items-center justify-center font-mono text-slate-400">
        <NodeNetworkScene />
        <span className="relative z-10 bg-black/60 px-6 py-3 rounded-full border border-slate-800 backdrop-blur-md">
          404 // ARTICLE NOT FOUND
        </span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-200 py-20 px-6 overflow-hidden">
      <NodeNetworkScene />
      <article className="max-w-3xl mx-auto glass-panel p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        <Link to="/#articles" className="inline-block text-xs font-mono text-slate-400 hover:text-white mb-6 transition-colors">
          ← BACK TO MAIN LOGS
        </Link>
        <div className="flex gap-4 items-center text-xs font-mono text-slate-400 mb-4">
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8">{article.title}</h1>
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-light">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}