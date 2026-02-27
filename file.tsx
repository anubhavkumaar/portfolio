import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Github, Linkedin, Mail, Terminal, Database, BrainCircuit, Code, Server, Cpu, ExternalLink, Cloud, Settings, Instagram, Gamepad2, Twitter, Youtube, Twitch, MessageSquare, Menu, X, Award } from 'lucide-react';

// --- Custom Hooks ---

// Typewriter Effect Hook
const useTypewriter = (words, typingSpeed = 100, erasingSpeed = 50, delay = 1500) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? erasingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, erasingSpeed, delay]);

  return text;
};

// Upgraded Scroll Observer Hook for repeating fade-in animations
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle visibility to repeat animations every time the element enters the viewport
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};


// --- Components ---

// Universal Animation Wrapper
const Reveal = ({ children, direction = 'up', delay = 0, className = '', threshold = 0.15 }) => {
  const { ref, isVisible } = useScrollReveal(threshold);
  
  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translate-y-24';
      case 'down': return '-translate-y-24';
      case 'left': return '-translate-x-24';
      case 'right': return 'translate-x-24';
      case 'scale': return 'scale-50';
      default: return 'translate-y-24';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-none' : `opacity-0 blur-sm ${getTransform()}`} ${className}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <Reveal direction="down" className="w-full flex justify-center z-20">
    <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg">
      {children}
    </h2>
  </Reveal>
);

// Growing Tree Wrapper Component
const GrowingTree = ({ children }) => {
  const treeRef = useRef(null);
  const [growHeight, setGrowHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!treeRef.current) return;
      const rect = treeRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Map scroll position to line growth percentage (leads at 60% of screen height)
      const startOffset = windowHeight * 0.6; 
      const progress = (startOffset - rect.top) / rect.height;
      const percentage = Math.max(0, Math.min(100, progress * 100));
      
      setGrowHeight(percentage);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={treeRef} className="relative mt-12 pb-12 w-full">
      {/* Tree Trunk Base (dimmed) */}
      <div className="absolute left-[24px] -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-[var(--color-accent)]/20 rounded-full"></div>
      
      {/* Glowing Growing Trunk - Toned down shadow */}
      <div 
        className="absolute left-[24px] -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-0 w-1 bg-[var(--color-accent)] rounded-full shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.5)] transition-all duration-300 ease-out z-0"
        style={{ height: `${growHeight}%` }}
      ></div>
      
      {children}
    </div>
  );
};

const TimelineItem = ({ year, title, company, description, isLeft, delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <div ref={ref} className="relative flex items-center justify-center w-full mb-16">
      
      {/* Desktop Left Side Content */}
      <div className={`hidden md:flex flex-col w-5/12 items-end text-right pr-8 lg:pr-12 transition-all duration-1000 ease-out ${isLeft ? (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10') : 'invisible'}`} style={{ transitionDelay: `${delay}ms` }}>
        <h3 className="text-xl font-bold text-[var(--color-accent)] font-orbitron">{title}</h3>
        <h4 className="text-lg font-semibold opacity-80 mb-2">{company}</h4>
        <p className="text-sm opacity-70">{description}</p>
        <span className="inline-block mt-4 px-4 py-1.5 bg-[var(--bg-color)] border border-[var(--color-accent)] text-[var(--text-color)] font-bold rounded-full text-xs shadow-[0_0_8px_var(--color-accent)] tracking-wider">{year}</span>
      </div>
      
      {/* Tree Node / Blooming Dot - Softened shadow */}
      <div className={`z-20 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-color)] border-2 border-[var(--color-accent)] shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.4)] absolute left-[24px] md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ transitionDelay: `${delay + 200}ms` }}>
        <div className={`w-3 h-3 rounded-full bg-[var(--color-accent)] ${isVisible ? 'animate-pulse shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.6)]' : ''}`}></div>
        
        {/* Desktop Branch Lines */}
        {isLeft && <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 right-full h-1 bg-gradient-to-l from-[var(--color-accent)] to-transparent rounded-l-full transition-all duration-700 ${isVisible ? 'w-8 lg:w-16 opacity-60' : 'w-0 opacity-0'}`} style={{ transitionDelay: `${delay + 300}ms` }}></div>}
        {!isLeft && <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 left-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-transparent rounded-r-full transition-all duration-700 ${isVisible ? 'w-8 lg:w-16 opacity-60' : 'w-0 opacity-0'}`} style={{ transitionDelay: `${delay + 300}ms` }}></div>}
      </div>

      {/* Desktop Right Side Content */}
      <div className={`hidden md:flex flex-col w-5/12 items-start text-left pl-8 lg:pl-12 transition-all duration-1000 ease-out ${!isLeft ? (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10') : 'invisible'}`} style={{ transitionDelay: `${delay}ms` }}>
         <h3 className="text-xl font-bold text-[var(--color-accent)] font-orbitron">{title}</h3>
         <h4 className="text-lg font-semibold opacity-80 mb-2">{company}</h4>
         <p className="text-sm opacity-70">{description}</p>
         <span className="inline-block mt-4 px-4 py-1.5 bg-[var(--bg-color)] border border-[var(--color-accent)] text-[var(--text-color)] font-bold rounded-full text-xs shadow-[0_0_8px_var(--color-accent)] tracking-wider">{year}</span>
      </div>

      {/* Mobile Content (Overrides on smaller screens) */}
      <div className={`md:hidden w-full pl-16 pr-4 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: `${delay}ms` }}>
        <div className="bg-[var(--bg-color)] p-6 rounded-xl border border-[var(--color-accent)]/50 shadow-[0_0_10px_rgba(0,0,0,0.05)] hover:shadow-[0_0_20px_var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300 w-full relative z-10">
           {/* Mobile Branch line */}
           <div className={`absolute top-1/2 -translate-y-1/2 right-full h-1 bg-gradient-to-l from-[var(--color-accent)] to-transparent rounded-l-full transition-all duration-700 ${isVisible ? 'w-10 opacity-60' : 'w-0 opacity-0'}`}></div>
           
           <h3 className="text-xl font-bold text-[var(--color-accent)] font-orbitron">{title}</h3>
           <h4 className="text-lg font-semibold opacity-80 mb-2">{company}</h4>
           <p className="text-sm opacity-70 mb-4">{description}</p>
           <span className="inline-block px-4 py-1.5 bg-[var(--bg-color)] border border-[var(--color-accent)] text-[var(--text-color)] font-bold rounded-full text-xs shadow-[0_0_8px_var(--color-accent)] tracking-wider">{year}</span>
        </div>
      </div>

    </div>
  );
};

const SkillCard = ({ icon: Icon, imageSrc, title, description, delay }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`skill-card h-60 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="skill-card-inner shadow-lg hover:shadow-[0_10px_25px_rgba(var(--color-accent-rgb),0.2)] rounded-xl">
        {/* Front of Skill Card: Focus on Logo */}
        <div className="skill-card-front flex flex-col items-center justify-center p-6 bg-[var(--bg-color)] border border-[var(--color-accent)]/50">
          <div className="w-20 h-20 mb-4 rounded-full bg-[var(--color-accent)] bg-opacity-10 flex items-center justify-center shadow-[inset_0_0_10px_rgba(var(--color-accent-rgb),0.1)]">
            {Icon && <Icon className="w-10 h-10 text-[var(--color-accent)]" />}
            {imageSrc && <img src={imageSrc} alt={title} className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />}
          </div>
          <h3 className="font-orbitron font-semibold text-center text-lg">{title}</h3>
        </div>
        
        {/* Back of Skill Card: Focus on Work Done */}
        <div className="skill-card-back flex flex-col items-start justify-start p-6 bg-[var(--bg-color)] border-2 border-[var(--color-accent)] shadow-[inset_0_0_10px_rgba(var(--color-accent-rgb),0.15)] overflow-y-auto">
            <h3 className="font-orbitron font-bold text-[var(--color-accent)] mb-3 text-lg border-b border-[var(--color-accent)]/30 w-full pb-2">{title}</h3>
            <p className="text-sm opacity-80 leading-relaxed text-left font-medium">
              {description}
            </p>
        </div>
      </div>
    </div>
  );
};

// Custom Icon handler for authentic brand SVGs
const CustomIcon = ({ icon: Icon, customPath, size = 28, className }) => {
  if (customPath) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={customPath} fillRule="evenodd" clipRule="evenodd" />
      </svg>
    );
  }
  return <Icon size={size} className={className} />;
};

// Social Card Component for Bento Grid
const SocialCard = ({ social, isDark, delay }) => {
  const { ref, isVisible } = useScrollReveal();
  const hoverColor = isDark ? social.darkColor : social.color;
  
  return (
    <a 
      ref={ref}
      href={social.href} 
      target={social.href.startsWith('mailto:') ? '_self' : '_blank'} 
      rel="noreferrer"
      className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-[var(--bg-color)] border border-[var(--color-accent)]/30 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:scale-[1.03] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
      style={{ '--hover-brand-color': hoverColor, transitionDelay: `${delay}ms` }}
    >
      {/* Base shadow & hover brand shadow */}
      <div className="absolute inset-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] group-hover:shadow-[0_0_25px_var(--hover-brand-color)] transition-shadow duration-500 pointer-events-none"></div>

      {/* Animated Background Gradient using brand color */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, var(--hover-brand-color) 0%, transparent 70%)` }}
      ></div>
      
      {/* Glare effect */}
      <div className="absolute top-0 left-[-100%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] group-hover:animate-[glare_0.8s_ease-out] pointer-events-none z-20"></div>

      {/* Icon styling - Toned down generic shadow */}
      <div className="relative z-10 w-16 h-16 mb-4 rounded-full border-2 border-[var(--color-accent)]/50 group-hover:border-[color:var(--hover-brand-color)] flex items-center justify-center bg-[var(--bg-color)] transition-all duration-500 shadow-[0_4px_10px_rgba(var(--color-accent-rgb),0.1)] group-hover:shadow-[0_0_20px_var(--hover-brand-color)]">
        <CustomIcon
          icon={social.icon}
          customPath={social.customPath}
          size={28}
          className="text-[var(--color-accent)] group-hover:text-[color:var(--hover-brand-color)] transition-colors duration-500"
        />
      </div>
      
      {/* Text styling */}
      <span className="relative z-10 font-orbitron font-bold text-lg tracking-widest uppercase transition-colors duration-300 group-hover:text-[color:var(--hover-brand-color)]">
        {social.text}
      </span>
      <span className="relative z-10 text-xs mt-2 opacity-60 font-medium tracking-wide">
        {social.tooltip}
      </span>
    </a>
  );
};

// Certificate Card Component
const CertificateCard = ({ title, issuer, date, delay }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`group relative flex flex-col p-6 rounded-2xl bg-[var(--bg-color)] border border-[var(--color-accent)]/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-visible transition-all duration-700 ease-out hover:-translate-y-2 hover:border-[var(--color-accent)] hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`} style={{ transitionDelay: `${delay}ms` }}>
       {/* Mobile Branch connection */}
       <div className="md:hidden absolute top-1/2 -translate-y-1/2 right-full w-10 h-1 bg-gradient-to-l from-[var(--color-accent)] to-transparent opacity-50 rounded-l-full"></div>
       
       {/* Background gradient (Moved from root to handle overflow styling safely) */}
       <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
       </div>

       <div className="relative z-10 flex items-start gap-4">
         <div className="w-12 h-12 shrink-0 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center bg-[var(--bg-color)] group-hover:bg-[var(--color-accent)] transition-all duration-500 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
           <Award size={24} className="text-[var(--color-accent)] group-hover:text-[var(--bg-color)] transition-colors duration-500" />
         </div>
         <div className="flex flex-col items-start">
           <h3 className="font-orbitron font-bold text-lg text-[var(--color-accent)] mb-1">{title}</h3>
           <p className="text-sm font-semibold opacity-90 mb-3">{issuer}</p>
           {/* High-Contrast Date Badge */}
           <span className="inline-block px-3 py-1 bg-[var(--bg-color)] border border-[var(--color-accent)] text-[var(--text-color)] font-bold rounded-full text-[0.65rem] uppercase tracking-wider shadow-[0_0_5px_rgba(0,255,255,0.2)]">{date}</span>
         </div>
       </div>
    </div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const typeWriterText = useTypewriter(['an AI & Data Engineer', 'a GenAI Developer', 'a Full Stack Developer', 'a Problem Solver']);

  // Set CSS variables based on theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-color', '#0a0a0a');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--color-accent', '#00ffff');
      root.style.setProperty('--color-accent-rgb', '0, 255, 255');
    } else {
      root.style.setProperty('--bg-color', '#f0f4f8');
      root.style.setProperty('--text-color', '#0f172a');
      root.style.setProperty('--color-accent', '#0284c7');
      root.style.setProperty('--color-accent-rgb', '2, 132, 199');
    }
  }, [isDark]);

  // Dynamically set the Favicon
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = 'https://i.vgy.me/i97cgL.png';
  }, []);

  // Handle scroll spy for navigation
  useEffect(() => {
    const handleScroll = () => {
      // Merged certifications into qualifications
      const sections = ['home', 'about', 'skills', 'qualifications', 'socials', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-poppins text-[var(--text-color)] bg-[var(--bg-color)] relative`}>
      {/* Ambient Background Orbs - Added breathing animation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[120px] animate-[breathe_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[120px] animate-[breathe_10s_ease-in-out_infinite_reverse]"></div>
      </div>

      {/* Global Styles injected for specific effects like the flip card & fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Poppins:wght@300;400;600&display=swap');
        
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        
        /* CSS Scroll Snapping for Full-Page Autoscroll */
        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          scroll-padding-top: 4rem; /* Accounts for fixed navbar */
        }

        /* Prevent snapping on mobile to allow reading tall sections freely */
        @media (max-width: 768px) {
           html { scroll-snap-type: y proximity; }
        }

        /* Applying snap logic to major sections */
        section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        /* 3D Flip Card Profile */
        .circle-card { perspective: 1000px; }
        .circle-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .circle-card:hover .circle-card-inner { transform: rotateY(180deg); }
        .circle-card-front, .circle-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 50%;
        }
        .circle-card-back {
          transform: rotateY(180deg);
          background-color: rgba(var(--color-accent-rgb), 0.1);
          border: 3px solid var(--color-accent);
          box-shadow: 0 8px 25px rgba(var(--color-accent-rgb), 0.2), inset 0 0 15px rgba(var(--color-accent-rgb), 0.2);
        }

        /* Skill Card 3D Flip */
        .skill-card { perspective: 1000px; }
        .skill-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .skill-card:hover .skill-card-inner { transform: rotateY(180deg); }
        .skill-card-front, .skill-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0.75rem; /* matches Tailwind's rounded-xl */
        }
        .skill-card-back {
          transform: rotateY(180deg);
        }
        
        /* Typing cursor blink */
        .typed-cursor { animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* Floating and Breathing Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.04; }
          50% { transform: scale(1.1); opacity: 0.08; }
        }

        /* Social Card Glare Animation */
        @keyframes glare {
          0% { left: -100%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 200%; opacity: 0; }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-color); }
        ::-webkit-scrollbar-thumb { background: var(--color-accent); border-radius: 4px; }
      `}} />

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[var(--bg-color)]/90 border-b border-[var(--color-accent)]/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer group" onClick={() => scrollTo('home')}>
             <img 
               src="https://i.vgy.me/6xJ0Rz.png" 
               alt="Logo" 
               className="h-10 w-auto drop-shadow-[0_0_8px_var(--color-accent)] transition-transform duration-300 group-hover:scale-105"
               onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.nextElementSibling.style.display = 'flex';
               }}
             />
             {/* Fallback AK Logo (Shows only if image fails to load) */}
             <div style={{display: 'none'}} className="items-center justify-center px-3 h-10 rounded-lg bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent)] transition-transform duration-300 group-hover:scale-105">
                <span className="font-orbitron font-bold text-[var(--color-accent)] tracking-widest">AK</span>
             </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {['home', 'about', 'skills', 'qualifications', 'socials', 'contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item)}
                className={`uppercase text-sm font-semibold tracking-widest transition-colors duration-300 hover:text-[var(--color-accent)] ${activeSection === item ? 'text-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent)]' : 'opacity-70'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-[var(--color-accent)] text-[var(--bg-color)] shadow-[0_0_15px_var(--color-accent)] hover:scale-110 transition-transform duration-300"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden p-2 text-[var(--color-accent)] hover:scale-110 transition-transform duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-16 left-0 w-full bg-[var(--bg-color)] border-b border-[var(--color-accent)]/30 shadow-2xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] py-6' : 'max-h-0 py-0 border-transparent'}`}>
          <div className="flex flex-col items-center space-y-6">
            {['home', 'about', 'skills', 'qualifications', 'socials', 'contact'].map((item) => (
              <button 
                key={item}
                onClick={() => {
                  scrollTo(item);
                  setIsMobileMenuOpen(false);
                }}
                className={`uppercase text-sm font-semibold tracking-widest transition-colors duration-300 hover:text-[var(--color-accent)] ${activeSection === item ? 'text-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent)]' : 'opacity-70'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* --- Home / Hero Section --- */}
        <section id="home" className="min-h-[100svh] flex items-center justify-center py-20 px-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[var(--color-accent)] opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between z-10 gap-12">
            <div className="flex-1 text-center md:text-left">
              <Reveal direction="left" delay={100}>
                <p className="text-xl md:text-2xl font-light mb-2">Hello World, I'm</p>
              </Reveal>
              <Reveal direction="left" delay={300}>
                <h1 className="text-5xl md:text-7xl font-bold font-orbitron mb-4 tracking-tight drop-shadow-md">
                  Anubhav <span className="text-[var(--color-accent)]">Kumar</span>
                </h1>
              </Reveal>
              <Reveal direction="left" delay={500}>
                <div className="h-12 mb-6 text-2xl md:text-3xl font-semibold text-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent)]">
                  I am <span className="text-[var(--text-color)]">{typeWriterText}</span><span className="typed-cursor text-[var(--color-accent)]">|</span>
                </div>
              </Reveal>
              <Reveal direction="up" delay={700}>
                <p className="text-lg opacity-80 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                  Full Stack Developer working at the intersection of AI, cloud, and real-world problem solving. Designing and shipping production-grade GenAI platforms for large-scale enterprise environments.
                </p>
              </Reveal>
              <Reveal direction="up" delay={900}>
                <div className="flex justify-center md:justify-start gap-4">
                  <button onClick={() => scrollTo('contact')} className="px-8 py-3 bg-[var(--color-accent)] text-[var(--bg-color)] font-bold rounded-full shadow-[0_4px_15px_rgba(var(--color-accent-rgb),0.3)] hover:shadow-[0_6px_20px_rgba(var(--color-accent-rgb),0.5)] hover:-translate-y-1 transition-all duration-300">
                    Connect With Me
                  </button>
                  <button onClick={() => scrollTo('qualifications')} className="px-8 py-3 border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-bold rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--bg-color)] transition-all duration-300 shadow-[inset_0_0_10px_transparent] hover:shadow-[inset_0_0_15px_rgba(var(--color-accent-rgb),0.4)]">
                    View Work
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="flex-1 flex justify-center perspective-1000">
              <Reveal direction="scale" delay={400}>
                {/* Added Float Animation and Outer Rings to the Circle Card */}
                <div className="relative animate-[float_6s_ease-in-out_infinite] w-64 h-64 md:w-80 md:h-80">
                  {/* Rotating Dashed Rings */}
                  <div className="absolute -inset-4 md:-inset-6 border-2 border-dashed border-[var(--color-accent)] rounded-full animate-[spin_15s_linear_infinite] opacity-40"></div>
                  <div className="absolute -inset-2 md:-inset-3 border border-[var(--color-accent)] rounded-full animate-[spin_20s_linear_infinite_reverse] opacity-20"></div>

                  <div className="circle-card w-full h-full cursor-pointer">
                    <div className="circle-card-inner">
                      {/* Front of Card - Profile Image */}
                      <div className="circle-card-front rounded-full overflow-hidden border-4 border-[var(--color-accent)] shadow-[0_8px_25px_rgba(var(--color-accent-rgb),0.2)] relative">
                        <div className="absolute inset-0 bg-[url('https://i.vgy.me/3fo2Aj.jpg')] bg-cover bg-center"></div>
                      </div>
                      
                      {/* Back of Card - NO Image */}
                      <div className="circle-card-back relative overflow-hidden flex flex-col items-center justify-center text-center rounded-full">
                        {/* Floating Text Overlay */}
                        <div className="relative z-10 flex flex-col items-center justify-center p-8">
                          <BrainCircuit size={48} className="text-[var(--color-accent)] mb-4 drop-shadow-[0_2px_4px_rgba(var(--color-accent-rgb),0.3)]" />
                          <h3 className="font-orbitron font-bold text-2xl text-[var(--color-accent)] mb-2 drop-shadow-[0_2px_4px_rgba(var(--color-accent-rgb),0.3)]">Let's Build</h3>
                          <p className="text-sm font-medium opacity-80">The future of AI & Data together.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="about" className="min-h-[100svh] py-24 px-4 bg-black/5 dark:bg-white/5 flex flex-col justify-center items-center">
          <div className="max-w-6xl mx-auto w-full">
            <SectionHeading>About Me</SectionHeading>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Image Column */}
              <div className="w-full md:w-1/3 flex justify-center">
                <Reveal direction="left" delay={200}>
                  <div className="relative group animate-[float_5s_ease-in-out_infinite]">
                    {/* Decorative Frame Elements */}
                    <div className="absolute -inset-2 border border-[var(--color-accent)] rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[var(--color-accent)] rounded-tr-xl opacity-50"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[var(--color-accent)] rounded-bl-xl opacity-50"></div>
                    
                    {/* Actual Image */}
                    <div className="relative w-64 h-80 md:w-full md:h-auto max-w-sm rounded-2xl overflow-hidden border-2 border-[var(--color-accent)] shadow-[0_10px_30px_rgba(var(--color-accent-rgb),0.2)] group-hover:shadow-[0_15px_40px_rgba(var(--color-accent-rgb),0.4)] transition-all duration-500">
                      <img 
                        src="https://i.vgy.me/hHGjs9.jpg" 
                        alt="Anubhav Kumar Professional" 
                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Text Column */}
              <div className="w-full md:w-2/3">
                <Reveal direction="right" delay={400}>
                  <div className="text-lg opacity-80 leading-relaxed space-y-6 bg-[var(--bg-color)] p-8 md:p-10 rounded-xl border border-[var(--color-accent)]/30 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-[var(--color-accent)] transition-all duration-500">
                    <p>I’m a Full Stack Developer working at the intersection of AI, cloud, and real-world problem solving.</p>
                    <p>Currently, I design and ship production-grade GenAI powered platforms used across large-scale enterprise environments. My work spans frontend, backend, cloud infrastructure, and AI systems, with a strong focus on reliability, performance, and measurable business impact.</p>
                    <p className="font-semibold text-[var(--color-accent)]">Here’s the kind of problems I solve:</p>
                    <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
                      <li>Turning complex policies and data into fast, usable AI-driven systems</li>
                      <li>Building LLM and RAG-based platforms on AWS that reduce manual effort and decision time</li>
                      <li>Creating scalable APIs and dashboards that teams actually enjoy using</li>
                      <li>Improving operational efficiency through automation and data-driven workflows</li>
                    </ul>
                    <p>My background in engineering and data analysis shapes how I think: structured, curious, and impact-focused. I enjoy collaborating with cross-functional teams, mentoring peers, and building systems that hold up in production, not just demos.</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* --- Skills Section --- */}
        <section id="skills" className="min-h-[100svh] py-20 px-4 flex flex-col justify-center items-center">
          <div className="max-w-5xl mx-auto w-full">
            <SectionHeading>Technical Arsenal</SectionHeading>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <SkillCard 
                delay={100}
                imageSrc="https://img.icons8.com/fluency/96/artificial-intelligence.png" 
                title="Generative AI" 
                description="Built enterprise-grade GenAI platforms, focusing on scalable, performant AI solutions and workflow optimization."
              />
              <SkillCard 
                delay={200}
                imageSrc="https://img.icons8.com/fluency/96/chatgpt.png" 
                title="LLMs & RAG" 
                description="Developed intelligent RAG systems on AWS, significantly reducing manual policy lookup times for enterprise portals."
              />
              <SkillCard 
                delay={300}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" 
                title="AWS Bedrock" 
                description="Deployed and managed foundation models leveraging AWS infrastructure to build robust, cloud-native AI workflows."
              />
              <SkillCard 
                delay={400}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" 
                title="Python & FastAPI" 
                description="Designed and maintained scalable backend services, rapid data pipelines, and high-performance APIs."
              />
              <SkillCard 
                delay={500}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
                title="React & Next.js" 
                description="Created responsive, user-friendly frontend components and enterprise dashboards focusing on usability and accessibility."
              />
              <SkillCard 
                delay={600}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" 
                title="PostgreSQL & SQL" 
                description="Wrote complex queries for data validation, ETL pipelines, and business intelligence reporting to track automation outputs."
              />
              <SkillCard 
                delay={700}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" 
                title="Machine Learning" 
                description="Analyzed and optimized data pipelines for ML models, culminating in capstone project applications with IIT Roorkee."
              />
              <SkillCard 
                delay={800}
                imageSrc="https://cdn.simpleicons.org/uipath/FA4616" 
                title="RPA & Automation" 
                description="Supported quality assurance and tested enterprise automation workflows yielding significant operational time savings."
              />
              <SkillCard 
                delay={900}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg" 
                title="Hadoop" 
                description="Designed and maintained massive enterprise data lakes for robust big data storage and distributed processing."
              />
              <SkillCard 
                delay={1000}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" 
                title="Oracle SQL" 
                description="Engineered complex analytical queries for corporate BI reporting and structured database management."
              />
              <SkillCard 
                delay={1100}
                imageSrc="https://www.vectorlogo.zone/logos/apache_hive/apache_hive-icon.svg" 
                title="Hive" 
                description="Leveraged Hive infrastructure to efficiently structure, summarize, and query large-scale distributed datasets."
              />
              <SkillCard 
                delay={1200}
                imageSrc="https://cdn.simpleicons.org/swagger/85EA2D" 
                title="Custom Integrations" 
                description="Developed custom tailored solutions bridging modern frontends, robust backends, and various cross-platform APIs."
              />
            </div>
          </div>
        </section>

        {/* --- Qualifications Section (Growing Tree + Certifications) --- */}
        <section id="qualifications" className="min-h-[100svh] py-20 px-4 bg-black/5 dark:bg-white/5 flex flex-col justify-center items-center relative z-10 overflow-hidden">
          <div className="max-w-5xl mx-auto w-full">
            <SectionHeading>Qualifications</SectionHeading>
            
            <GrowingTree>
              {/* Experience Nodes */}
              <TimelineItem 
                delay={200}
                year="Oct 2024 - Present"
                title="GenAI Developer"
                company="Deloitte"
                description="Building and scaling enterprise GenAI platforms using LLMs and RAG systems on AWS Bedrock. Developing full-stack solutions with Python (FastAPI), React/Next.js, and PostgreSQL."
                isLeft={true}
              />
              <TimelineItem 
                delay={400}
                year="Oct 2023 - Oct 2024"
                title="RPA QA & Data Analyst"
                company="Deloitte"
                description="Supported QA for enterprise automation workflows, utilizing SQL for data validation. Assisted in process automation initiatives resulting in significant operational time savings."
                isLeft={false}
              />
              <TimelineItem 
                delay={600}
                year="Jul 2023 - Oct 2023"
                title="AI Academy Trainee"
                company="Deloitte"
                description="Intensive training in Python, SQL, PowerBI, Hadoop, Hive, and AWS tools. Completed Capstone projects in Machine Learning in collaboration with IIT Roorkee."
                isLeft={true}
              />
              <TimelineItem 
                delay={800}
                year="2019 - 2023"
                title="BTech, Mechanical Engineering"
                company="KIIT University"
                description="Served as Lead Student Coordinator managing workshops and ABET accreditation. Participated in internships with Komatsu and Indian Oil Corp."
                isLeft={false}
              />

              {/* Certifications Sub-branch / Grid */}
              <Reveal direction="scale" delay={1000} className="w-full">
                <div className="relative z-10 mt-24 mb-10 flex justify-start pl-16 md:pl-0 md:justify-center w-full">
                   {/* Dot on the trunk for mobile */}
                   <div className="md:hidden absolute left-[24px] -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bg-color)] border-2 border-[var(--color-accent)] z-20 shadow-[0_0_10px_var(--color-accent)]"></div>
                   {/* Branch to badge */}
                   <div className="md:hidden absolute left-[24px] top-1/2 -translate-y-1/2 w-10 h-1 bg-gradient-to-l from-[var(--color-accent)] to-transparent opacity-60 z-10"></div>
                   
                   <div className="px-6 py-2 bg-[var(--bg-color)] border-2 border-[var(--color-accent)] rounded-full text-[var(--color-accent)] font-orbitron font-bold shadow-[0_0_15px_var(--color-accent)] flex items-center gap-2 relative z-20 hover:scale-105 transition-transform">
                      <Award size={18} /> CERTIFICATIONS
                   </div>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-16 pr-4 md:pl-0 md:pr-0 relative z-10 w-full">
                <CertificateCard 
                  delay={1100}
                  title="Artificial Intelligence & Machine Learning" 
                  issuer="IIT Roorkee & Deloitte AI Academy" 
                  date="Issued Oct 2023" 
                />
                <CertificateCard 
                  delay={1200}
                  title="Data Engineering" 
                  issuer="Deloitte" 
                  date="Issued Oct 2023" 
                />
                <CertificateCard 
                  delay={1300}
                  title="Machine Learning" 
                  issuer="Deloitte" 
                  date="Issued Oct 2023" 
                />
                <CertificateCard 
                  delay={1400}
                  title="SolidWorks Training" 
                  issuer="Internshala" 
                  date="Issued Aug 2021" 
                />
              </div>
            </GrowingTree>
          </div>
        </section>

        {/* --- Socials Section --- */}
        <section id="socials" className="min-h-[100svh] py-24 px-4 flex flex-col items-center justify-center relative z-10">
          <div className="max-w-5xl mx-auto w-full">
            <SectionHeading>Social Network</SectionHeading>
            
            <Reveal direction="up" delay={200}>
              <p className="text-center max-w-xl mx-auto opacity-80 mb-16 text-lg">
                Connect with me across the web. I'm always active and open to new conversations!
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {[
                { text: 'GitHub', icon: Github, href: 'https://github.com/anubhavkumaar', tooltip: 'Code & Projects', color: '#181717', darkColor: '#ffffff' },
                { text: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/anubhavkumaar/', tooltip: 'Professional Network', color: '#0A66C2', darkColor: '#0A66C2' },
                { text: 'X (Twitter)', customPath: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z", href: 'https://twitter.com/theanubhavkumar/', tooltip: 'Tech & Updates', color: '#000000', darkColor: '#ffffff' },
                { text: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/theanubhavkumar/', tooltip: 'Behind the Scenes', color: '#E1306C', darkColor: '#E1306C' },
                { text: 'YouTube', icon: Youtube, href: 'https://youtube.com/anubhavkumaar', tooltip: 'Video Content', color: '#FF0000', darkColor: '#FF0000' },
                { text: 'Twitch', icon: Twitch, href: 'https://twitch.com/anubhavkumaar', tooltip: 'Live Streams', color: '#9146FF', darkColor: '#9146FF' },
                { text: 'Discord', customPath: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z", href: 'https://discord.gg/qysMbEXq5R', tooltip: 'Community Chat', color: '#5865F2', darkColor: '#5865F2' },
                { text: 'Steam', customPath: "M11.979 0C5.362 0 0 5.363 0 11.979c0 4.88 2.924 9.088 7.098 10.932l2.67-3.876c-.05-.184-.083-.377-.083-.578 0-1.363 1.108-2.47 2.472-2.47.288 0 .56.05.811.14l3.6-5.181V10.74c0-1.954 1.583-3.537 3.537-3.537s3.536 1.583 3.536 3.537-1.582 3.536-3.536 3.536c-.198 0-.388-.016-.572-.048l-4.522 6.467c.078.272.121.558.121.855 0 1.954-1.582 3.537-3.536 3.537-1.742 0-3.185-1.265-3.483-2.926L1.104 18.02A11.968 11.968 0 0 0 11.979 24c6.616 0 11.979-5.363 11.979-11.98C23.958 5.363 18.595 0 11.979 0zM20.1 10.74c0-1.127-.91-2.039-2.035-2.039-1.127 0-2.04.912-2.04 2.039s.913 2.04 2.04 2.04c1.125 0 2.035-.913 2.035-2.04zm-8.318 7.372c0 .855-.694 1.549-1.549 1.549-.855 0-1.549-.694-1.549-1.549 0-.854.694-1.548 1.549-1.548.855 0 1.549.694 1.549 1.548zm-1.074-2.585c-1.155.234-2.04 1.258-2.04 2.49 0 1.397 1.134 2.532 2.53 2.532 1.298 0 2.368-1.002 2.518-2.28l-3.008-.742z", href: 'https://steamcommunity.com/id/anubhavkumar/', tooltip: 'Gaming Profile', color: '#171a21', darkColor: '#66c0f4' },
                { text: 'Email', icon: Mail, href: 'mailto:work@anubhavkumaar.in', tooltip: 'Direct Contact', color: 'var(--color-accent)', darkColor: 'var(--color-accent)' }
              ].map((social, index) => (
                <SocialCard key={index} social={social} isDark={isDark} delay={index * 100} />
              ))}
            </div>
          </div>
        </section>

        {/* --- Contact Section --- */}
        <section id="contact" className="min-h-[100svh] py-32 px-4 bg-black/5 dark:bg-white/5 relative flex flex-col items-center justify-center z-10">
          <SectionHeading>Initialize Connection</SectionHeading>
          
          <Reveal direction="scale" delay={200}>
            <div className="text-center max-w-xl mx-auto mb-10">
              <Mail className="w-16 h-16 mx-auto mb-6 text-[var(--color-accent)] drop-shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.5)] animate-[float_4s_ease-in-out_infinite]" />
              <h3 className="text-2xl font-orbitron font-bold mb-4">Let's Work Together</h3>
              <p className="text-lg opacity-80 mb-8">
                Whether you have a question, a project idea, or just want to say hi, my inbox is always open. I'll try my best to get back to you!
              </p>
              
              <a href="mailto:work@anubhavkumaar.in" className="inline-block px-10 py-4 bg-[var(--bg-color)] border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-bold text-lg rounded-full shadow-[0_4px_15px_rgba(var(--color-accent-rgb),0.1)] hover:shadow-[0_6px_25px_rgba(var(--color-accent-rgb),0.3)] hover:bg-[var(--color-accent)] hover:text-[var(--bg-color)] transition-all duration-300 hover:-translate-y-1">
                Say Hello
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-[var(--color-accent)] border-opacity-20 text-sm opacity-60">
        <p className="font-orbitron tracking-widest">&copy; {new Date().getFullYear()} ANUBHAV KUMAR. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}