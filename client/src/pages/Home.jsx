import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ExternalLink, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API_BASE_URL from '../config/api';

import BlackHoleScene from '../components/3d/BlackHoleScene';
import Articles from '../components/sections/Articles';
import Contact from '../components/sections/Contact';
import { useAuth } from '../context/AuthContext';
import meImg from '../assets/me2.jpg';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [projects, setProjects] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Failed to fetch projects:', err));
  }, []);

  useEffect(() => {
    // 1. Hero fade animation
    gsap.to('.hero-content', {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 2. Section reveal animation
    gsap.utils.toArray('.reveal:not(.skill-card):not(.project-card)').forEach((el) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      });
    });

    // 3. Staggered Skill Cards
    gsap.to('.skill-card', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 75%'
      }
    });

    // 4. Staggered Project Cards (run after projects load)
    if (projects.length > 0) {
      gsap.to('.project-card', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 75%'
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [projects]);

  return (
    <div className="relative">
      <BlackHoleScene />

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-8 py-4 rounded-full flex justify-between items-center gap-8 shadow-2xl border border-slate-700/50">
        <div className="text-xl font-bold tracking-widest text-slate-200"></div>
        <div className="space-x-8 text-sm font-semibold hidden md:block">
          <a href="#about" className="text-slate-400 hover:text-white transition-colors">About</a>
          <a href="#skills" className="text-slate-400 hover:text-white transition-colors">Arsenal</a>
          <a href="#projects" className="text-slate-400 hover:text-white transition-colors">Projects</a>
          <a href="#articles" className="text-slate-400 hover:text-white transition-colors">Articles</a>
          <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
        </div>
        <Link
          to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
          title={isAuthenticated ? "Admin Command Center" : "Admin Login"}
          className="flex items-center justify-center p-2.5 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-400 rounded-full transition-all duration-300 hover:scale-110 relative group"
        >
          <User className="w-4 h-4" />
          {isAuthenticated && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse border border-black" />
          )}
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative z-10" id="hero">
        <div className="hero-content">
          <p className="text-slate-400 font-mono tracking-widest mb-4">SYSTEM INITIALIZED // WELCOME</p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
            Ravindu Randeepa<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
              Kariyawasam
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto font-light tracking-wide">
            ICT Undergraduate | Network Enthusiast | Full-Stack Developer
          </p>
          <a
            href="#projects"
            className="inline-block px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/15 text-slate-200 hover:text-white rounded-full font-bold font-mono text-sm tracking-wider shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Access Databanks
          </a>

          <div className="mt-12 flex justify-center">
            <a
              href="#about"
              aria-label="Scroll down to About section"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors duration-300 animate-bounce group"
            >
              <span className="text-[10px] font-mono tracking-widest text-slate-500 group-hover:text-slate-300 uppercase">EXPLORE</span>
              <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 reveal">
            <div className="relative group mx-auto w-fit">
              <div className="absolute -inset-2 bg-gradient-to-r from-slate-400 to-slate-700 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative p-2 bg-black rounded-full border border-slate-600/50 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <img
                  src={meImg}
                  alt="Ravindu Randeepa Kariyawasam"
                  className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-7 glass-panel p-10 rounded-3xl reveal">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-4">
              <span className="w-10 h-[2px] bg-slate-400"></span> Identity Profiling
            </h2>
            <h3 className="text-xl font-bold text-slate-300 mb-4">University of Sri Jayewardenepura</h3>
            <p className="text-lg leading-relaxed text-slate-400 mb-6">
              I am a 3rd-year ICT undergraduate specializing in the Network Track. I focus on designing minimal, highly functional systems that operate without bloat.
            </p>
            <p className="text-lg leading-relaxed text-slate-400 mb-6">
              My engineering approach bridges the gap between clean full-stack development, automated cloud architecture, and robust network configurations to deliver seamless, scalable solutions.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800/80">
              <a
                href="https://github.com/KWR-Randeepa"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all group"
              >
                <GithubIcon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href="https://www.linkedin.com/in/ravindu-randeepa-59563531b/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all group"
              >
                <LinkedinIcon className="w-4 h-4 text-cyan-400" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Arsenal Section */}
      <section id="skills" className="py-32 px-6 max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white reveal flex items-center justify-center gap-4">
          <span className="w-10 h-[2px] bg-slate-600"></span> Core Competencies <span className="w-10 h-[2px] bg-slate-600"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-8 rounded-2xl reveal skill-card border-t-4 border-t-slate-400">
            <h3 className="text-xl font-bold text-white mb-4">Networking</h3>
            <ul className="text-slate-400 space-y-2 font-mono text-sm">
              <li>&gt; Cisco Architecture</li>
              <li>&gt; Routing Protocols</li>
              <li>&gt; Cybersecurity</li>
              <li>&gt; CTF Operations</li>
            </ul>
          </div>
          <div className="glass-panel p-8 rounded-2xl reveal skill-card border-t-4 border-t-slate-500">
            <h3 className="text-xl font-bold text-white mb-4">Software</h3>
            <ul className="text-slate-400 space-y-2 font-mono text-sm">
              <li>&gt; MERN Stack</li>
              <li>&gt; Flutter</li>
              <li>&gt; Python</li>
              <li>&gt; React Native</li>
            </ul>
          </div>
          <div className="glass-panel p-8 rounded-2xl reveal skill-card border-t-4 border-t-slate-600">
            <h3 className="text-xl font-bold text-white mb-4">Cloud / DevOps</h3>
            <ul className="text-slate-400 space-y-2 font-mono text-sm">
              <li>&gt; AWS</li>
              <li>&gt; Docker</li>
              <li>&gt; GitHub Actions</li>
              <li>&gt; CI/CD Pipelines</li>
            </ul>
          </div>
          <div className="glass-panel p-8 rounded-2xl reveal skill-card border-t-4 border-t-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Data & Visuals</h3>
            <ul className="text-slate-400 space-y-2 font-mono text-sm">
              <li>&gt; TensorFlow</li>
              <li>&gt; Pandas / NumPy</li>
              <li>&gt; Three.js</li>
              <li>&gt; WebGL Rendering</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-16 text-white flex items-center gap-4 reveal">
          <span className="w-10 h-[2px] bg-slate-400"></span> System Deployments
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="glass-panel rounded-2xl overflow-hidden group reveal project-card hover:border-slate-400 transition-colors"
            >
              <div className="h-1 bg-gradient-to-r from-slate-400 to-slate-700"></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-slate-300 transition-colors">
                    {proj.title}
                  </h3>
                  <div className="flex gap-3 text-xs font-mono">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        [CODE]
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        [LIVE]
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-6 font-light leading-relaxed">
                  {proj.description}
                </p>
                <div className="flex gap-2 flex-wrap text-xs font-mono">
                  {proj.tags?.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-900 rounded text-slate-300 border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Articles Showcase */}
      <Articles />

      {/* Nodemailer Transmission Line */}
      <Contact />

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center relative z-10 glass-panel mt-20">
        <p className="text-slate-500 text-sm font-mono tracking-wide">
          © 2026 Ravindu Randeepa Kariyawasam.<br />Networked. Automated. Secured.
        </p>
      </footer>
    </div>
  );
}