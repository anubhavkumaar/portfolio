'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Github, Linkedin, Mail, BrainCircuit, Instagram, Youtube, Twitch, Menu, X, Award } from 'lucide-react';

// --- Custom Hooks ---

// Typewriter Effect Hook
const useTypewriter = (words: string[], typingSpeed = 100, erasingSpeed = 50, delay = 1500) => {
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

// Universal Animation Wrapper - Smooth, staggered, floating reveals
const Reveal = ({ children, direction = 'up', delay = 0, className = '', threshold = 0.15 }: { children: React.ReactNode; direction?: 'up' | 'down' | 'left' | 'right' | 'scale'; delay?: number; className?: string; threshold?: number }) => {
  const { ref, isVisible } = useScrollReveal(threshold);
  
  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translate-y-16';
      case 'down': return '-translate-y-16';
      case 'left': return '-translate-x-16';
      case 'right': return 'translate-x-16';
      case 'scale': return 'scale-90';
      default: return 'translate-y-16';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-none' : `opacity-0 blur-[2px] ${getTransform()}`} ${className}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <Reveal direction="down" className="w-full flex justify-center z-20 relative">
    <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 relative inline-block group">
      {children}
      {/* Light Sweep Effect on Heading */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.5)] to-transparent bg-[length:200%_100%] animate-[shine_2.5s_infinite_linear] bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {children}
      </span>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent overflow-hidden shadow-[0_0_8px_var(--color-accent)]">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-[pan_2s_infinite]"></div>
      </div>
      {/* Decorative side dots */}
      <div className="absolute -bottom-[19px] left-1/3 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-ping"></div>
      <div className="absolute -bottom-[19px] right-1/3 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[ping_2s_infinite_1s]"></div>
      
      {/* Extra Tech Lines around Heading */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-8 h-[1px] bg-gradient-to-r from-transparent to-[var(--color-accent)] opacity-50"></div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-12 w-8 h-[1px] bg-gradient-to-l from-transparent to-[var(--color-accent)] opacity-50"></div>
    </h2>
  </Reveal>
);

// Growing Tree Wrapper Component
const GrowingTree = ({ children }: { children: React.ReactNode }) => {
  const treeRef = useRef<HTMLDivElement>(null);
  const [growHeight, setGrowHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!treeRef.current) return;
      const rect = treeRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startOffset = windowHeight * 0.6; 
      const progress = (startOffset - rect.top) / rect.height;
      const percentage = Math.max(0, Math.min(100, progress * 100));
      
      setGrowHeight(percentage);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={treeRef} className="relative mt-12 pb-12 w-full">
      {/* Dimmed Background Line */}
      <div className="absolute left-[24px] -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-[var(--text-color)] opacity-10 rounded-full"></div>
      
      {/* Growing Light Beam */}
      <div 
        className="absolute left-[24px] -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-0 w-1 bg-gradient-to-b from-[var(--color-accent)] via-blue-400 to-transparent transition-all duration-300 ease-out z-0 shadow-[0_0_15px_var(--color-accent)]"
        style={{ height: `${growHeight}%` }}
      ></div>

      {/* Data Packet moving down the trunk */}
      <div className="absolute left-[24px] -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 overflow-hidden z-10">
        <div className="w-full h-16 bg-gradient-to-b from-transparent via-white to-transparent animate-[scan-line_2.5s_linear_infinite] opacity-90 blur-[1px]"></div>
      </div>
      
      {children}
    </div>
  );
};

const TimelineItem = ({ year, title, company, description, isLeft, delay = 0 }: { year: string; title: string; company: string; description: string; isLeft: boolean; delay?: number }) => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <div ref={ref} className="relative flex items-center justify-center w-full mb-16 group">
      
      {/* Desktop Left Side Content */}
      <div className={`hidden md:flex flex-col w-5/12 items-end text-right pr-8 lg:pr-12 transition-all duration-1000 ease-out ${isLeft ? (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10') : 'invisible'}`} style={{ transitionDelay: `${delay}ms` }}>
        <h3 className="text-xl font-bold text-[var(--color-accent)] font-orbitron group-hover:tracking-wide transition-all duration-500 group-hover:drop-shadow-[0_0_8px_var(--color-accent)]">{title}</h3>
        <h4 className="text-lg font-semibold opacity-80 mb-2">{company}</h4>
        <p className="text-sm opacity-70 leading-relaxed">{description}</p>
        <span className="inline-block mt-4 px-5 py-1.5 bg-[var(--bg-color)] border border-[var(--color-accent)]/40 text-[var(--text-color)] font-medium rounded-full text-xs tracking-widest relative overflow-hidden group/btn hover:border-[var(--color-accent)] transition-colors shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.1)] hover:shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.4)]">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.3)] to-transparent translate-x-[-100%] group-hover/btn:animate-[pan_1.5s_linear_infinite]"></span>
          {year}
        </span>
      </div>
      
      {/* Tree Node / Blooming Dot */}
      <div className={`z-20 flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-color)] border border-[var(--color-accent)]/70 absolute left-[24px] md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} group-hover:scale-125 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_0_20px_var(--color-accent)]`} style={{ transitionDelay: `${delay + 200}ms` }}>
        <div className={`w-2 h-2 rounded-full bg-[var(--color-accent)] transition-transform duration-500 group-hover:scale-150 animate-[pulse-slow_2s_infinite]`}></div>
        <div className="absolute inset-0 rounded-full border border-[var(--color-accent)] animate-ping opacity-30 group-hover:opacity-70"></div>
        
        {/* Branch Lines - Subtle Gradient Beams */}
        {isLeft && <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 right-full h-[2px] bg-gradient-to-l from-[var(--color-accent)] to-transparent rounded-l-full transition-all duration-1000 ease-out ${isVisible ? 'w-8 lg:w-16 opacity-50 group-hover:opacity-100 shadow-[0_0_8px_var(--color-accent)]' : 'w-0 opacity-0'}`} style={{ transitionDelay: `${delay + 300}ms` }}></div>}
        {!isLeft && <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 left-full h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent rounded-r-full transition-all duration-1000 ease-out ${isVisible ? 'w-8 lg:w-16 opacity-50 group-hover:opacity-100 shadow-[0_0_8px_var(--color-accent)]' : 'w-0 opacity-0'}`} style={{ transitionDelay: `${delay + 300}ms` }}></div>}
      </div>

      {/* Desktop Right Side Content */}
      <div className={`hidden md:flex flex-col w-5/12 items-start text-left pl-8 lg:pl-12 transition-all duration-1000 ease-out ${!isLeft ? (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10') : 'invisible'}`} style={{ transitionDelay: `${delay}ms` }}>
         <h3 className="text-xl font-bold text-[var(--color-accent)] font-orbitron group-hover:tracking-wide transition-all duration-500 group-hover:drop-shadow-[0_0_8px_var(--color-accent)]">{title}</h3>
         <h4 className="text-lg font-semibold opacity-80 mb-2">{company}</h4>
         <p className="text-sm opacity-70 leading-relaxed">{description}</p>
         <span className="inline-block mt-4 px-5 py-1.5 bg-[var(--bg-color)] border border-[var(--color-accent)]/40 text-[var(--text-color)] font-medium rounded-full text-xs tracking-widest relative overflow-hidden group/btn hover:border-[var(--color-accent)] transition-colors shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.1)] hover:shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.4)]">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.3)] to-transparent translate-x-[-100%] group-hover/btn:animate-[pan_1.5s_linear_infinite]"></span>
          {year}
        </span>
      </div>

      {/* Mobile Content */}
      <div className={`md:hidden w-full pl-16 pr-4 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: `${delay}ms` }}>
        <div className="bg-[var(--bg-color)]/60 backdrop-blur-md p-6 rounded-xl border border-[var(--color-accent)]/30 shadow-sm hover:shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.3)] hover:border-[var(--color-accent)] transition-all duration-500 w-full relative z-10 overflow-hidden group-hover:animate-[pulse-border_2s_infinite]">
           {/* Mobile Branch line */}
           <div className={`absolute top-1/2 -translate-y-1/2 right-full h-[2px] bg-gradient-to-l from-[var(--color-accent)] to-transparent transition-all duration-700 ${isVisible ? 'w-10 opacity-70 shadow-[0_0_8px_var(--color-accent)]' : 'w-0 opacity-0'}`}></div>
           
           {/* Shimmer on Mobile Card */}
           <div className="absolute top-0 left-[-100%] w-[150%] h-full bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.15)] to-transparent skew-x-[-45deg] group-hover:animate-[glare_1s_ease-out] pointer-events-none z-0"></div>

           <h3 className="text-xl font-bold text-[var(--color-accent)] font-orbitron relative z-10">{title}</h3>
           <h4 className="text-lg font-semibold opacity-80 mb-2 relative z-10">{company}</h4>
           <p className="text-sm opacity-70 mb-4 relative z-10">{description}</p>
           <span className="inline-block px-4 py-1.5 bg-[var(--bg-color)] border border-[var(--color-accent)]/40 text-[var(--text-color)] font-medium rounded-full text-xs relative z-10">{year}</span>
        </div>
      </div>
    </div>
  );
};

const SkillCard = ({ icon: Icon, imageSrc, title, description, delay }: { icon?: React.ComponentType<{ className?: string; size?: number }>; imageSrc?: string; title: string; description: string; delay: number }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`skill-card h-60 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="skill-card-inner rounded-xl group relative">
        {/* Soft Shadow behind the card */}
        <div className="absolute inset-0 bg-[var(--color-accent)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-xl"></div>
        
        {/* Front of Skill Card */}
        <div className="skill-card-front flex flex-col items-center justify-center p-6 bg-[var(--bg-color)]/80 backdrop-blur-md border border-[var(--color-accent)]/30 group-hover:border-[var(--color-accent)]/80 transition-colors overflow-hidden group-hover:animate-[pulse-border_2s_infinite]">
          {/* Top & Bottom Line Scanners */}
          <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent group-hover:animate-[pan_2s_linear_infinite]"></div>
          <div className="absolute bottom-0 right-[-100%] w-full h-[2px] bg-gradient-to-l from-transparent via-[var(--color-accent)] to-transparent group-hover:animate-[pan_2s_linear_infinite_reverse]"></div>

          {/* Glassy reflection sweep */}
          <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent skew-x-[-45deg] group-hover:animate-[glare_1.5s_ease-out_infinite] pointer-events-none"></div>

          <div className="w-20 h-20 mb-4 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center border border-transparent group-hover:border-[var(--color-accent)]/50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[inset_0_0_15px_rgba(var(--color-accent-rgb),0.3)]">
            {Icon && <Icon size={40} className="text-[var(--color-accent)] opacity-90 group-hover:opacity-100 transition-opacity group-hover:drop-shadow-[0_0_8px_var(--color-accent)]" />}
            {imageSrc && <img src={imageSrc} alt={title} className="w-10 h-10 object-contain opacity-90 group-hover:opacity-100 transition-all group-hover:rotate-6 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />}
          </div>
          <h3 className="font-orbitron font-medium tracking-wide text-center text-lg opacity-90 group-hover:opacity-100">{title}</h3>
        </div>
        
        {/* Back of Skill Card */}
        <div className="skill-card-back flex flex-col items-start justify-start p-6 bg-[var(--bg-color)] border border-[var(--color-accent)]/70 overflow-y-auto relative shadow-[inset_0_0_30px_rgba(var(--color-accent-rgb),0.15)] group-hover:animate-[pulse-border_2s_infinite]">
            {/* Pattern overlay inside back */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(var(--color-accent-rgb),0.05)_25%,transparent_25%,transparent_50%,rgba(var(--color-accent-rgb),0.05)_50%,rgba(var(--color-accent-rgb),0.05)_75%,transparent_75%,transparent)] bg-[length:10px_10px] pointer-events-none"></div>
            
            <h3 className="font-orbitron font-bold text-[var(--color-accent)] mb-3 text-lg border-b border-[var(--color-accent)]/40 w-full pb-2 relative z-10 drop-shadow-[0_0_5px_rgba(var(--color-accent-rgb),0.4)]">{title}</h3>
            <p className="text-sm opacity-90 leading-relaxed text-left font-light relative z-10">
              {description}
            </p>
        </div>
      </div>
    </div>
  );
};

// Custom Icon handler for authentic brand SVGs
const CustomIcon = ({ icon: Icon, customPath, size = 28, className }: { icon?: React.ComponentType<{ className?: string; size?: number }>; customPath?: string; size?: number; className?: string }) => {
  if (customPath) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={customPath} fillRule="evenodd" clipRule="evenodd" />
      </svg>
    );
  }
  return Icon ? <Icon size={size} className={className} /> : null;
};

// Social Card Component for Bento Grid
const SocialCard = ({ social, isDark, delay }: { social: { text: string; icon?: any; customPath?: string; href: string; tooltip: string; color: string; darkColor: string }; isDark: boolean; delay: number }) => {
  const { ref, isVisible } = useScrollReveal();
  const hoverColor = isDark ? social.darkColor : social.color;
  
  return (
    <a 
      ref={ref}
      href={social.href} 
      target={social.href.startsWith('mailto:') ? '_self' : '_blank'} 
      rel="noreferrer"
      className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-[var(--bg-color)]/70 backdrop-blur-md border border-[var(--color-accent)]/20 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
      style={{ transitionDelay: `${delay}ms` } as React.CSSProperties}
    >
      {/* Dynamic light gradient tracking effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${hoverColor} 0%, transparent 80%)` }}
      ></div>
      
      {/* Glare effect */}
      <div className="absolute top-0 left-[-100%] w-[150%] h-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.25)] to-transparent skew-x-[-45deg] group-hover:animate-[glare_1s_ease-out] pointer-events-none z-20"></div>

      {/* Scanners */}
      <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent group-hover:animate-[pan_2s_linear_infinite]"></div>
      <div className="absolute bottom-0 right-[-100%] w-full h-[2px] bg-gradient-to-l from-transparent via-[var(--color-accent)] to-transparent group-hover:animate-[pan_2s_linear_infinite_reverse]"></div>

      {/* Icon styling */}
      <div className="relative z-10 w-16 h-16 mb-4 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center bg-[var(--bg-color)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:animate-[pulse-slow_2s_infinite]">
        <CustomIcon
          icon={social.icon}
          customPath={social.customPath}
          size={28}
          className="text-[var(--text-color)] opacity-80 group-hover:opacity-100 transition-colors duration-500 group-hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        />
      </div>
      
      {/* Text styling */}
      <span className="relative z-10 font-orbitron font-medium text-lg tracking-widest uppercase transition-colors duration-300 group-hover:text-[color:var(--hover-brand-color)] group-hover:drop-shadow-[0_0_5px_var(--hover-brand-color)]">
        {social.text}
      </span>
      <span className="relative z-10 text-xs mt-2 opacity-60 font-light tracking-wide group-hover:opacity-100 transition-opacity">
        {social.tooltip}
      </span>
    </a>
  );
};

// Certificate Card Component
const CertificateCard = ({ title, issuer, date, delay }: { title: string; issuer: string; date: string; delay: number }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`group relative flex flex-col p-6 rounded-2xl bg-[var(--bg-color)]/80 backdrop-blur-md border border-[var(--color-accent)]/30 overflow-hidden transition-all duration-700 ease-out hover:-translate-y-2 hover:border-[var(--color-accent)]/80 shadow-sm hover:shadow-[0_10px_30px_rgba(var(--color-accent-rgb),0.2)] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'} group-hover:animate-[pulse-border_2s_infinite]`} style={{ transitionDelay: `${delay}ms` }}>
       {/* Mobile Branch connection */}
       <div className="md:hidden absolute top-1/2 -translate-y-1/2 right-full w-8 h-[2px] bg-gradient-to-l from-[var(--color-accent)] to-transparent opacity-60"></div>
       
       {/* Light Sweep Effect */}
       <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.15)] to-transparent skew-x-[-45deg] group-hover:animate-[glare_1.5s_ease-out] pointer-events-none"></div>

       <div className="relative z-10 flex items-start gap-4">
         <div className="w-12 h-12 shrink-0 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center bg-[var(--bg-color)] group-hover:bg-[var(--color-accent)]/20 transition-all duration-500 group-hover:rotate-12 group-hover:shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.5)]">
           <Award size={22} className="text-[var(--text-color)] opacity-80 group-hover:text-[var(--color-accent)] group-hover:opacity-100 transition-colors duration-500 group-hover:drop-shadow-[0_0_8px_var(--color-accent)]" />
         </div>
         <div className="flex flex-col items-start">
           <h3 className="font-orbitron font-medium text-lg text-[var(--color-accent)] mb-1 group-hover:tracking-wide transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(var(--color-accent-rgb),0.4)]">{title}</h3>
           <p className="text-sm font-light opacity-90 mb-3">{issuer}</p>
           {/* Minimalist Date Badge */}
           <span className="inline-block px-3 py-1 bg-[var(--text-color)]/10 border border-[var(--color-accent)]/40 text-[var(--text-color)] font-medium rounded-full text-[0.65rem] uppercase tracking-widest group-hover:border-[var(--color-accent)] transition-colors shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.1)]">{date}</span>
         </div>
       </div>
    </div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const typeWriterText = useTypewriter(['an AI & Data Engineer', 'a Data Analyst', 'a GenAI Developer', 'a Full Stack Developer', 'a Gamer','a Streamer']);

  const currentSectionRef = useRef('home');

  // Set CSS variables based on theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-color', '#0a0a0a');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--color-accent', '#00e5ff');
      root.style.setProperty('--color-accent-rgb', '0, 229, 255');
    } else {
      root.style.setProperty('--bg-color', '#f8fafc');
      root.style.setProperty('--text-color', '#0f172a');
      root.style.setProperty('--color-accent', '#0284c7');
      root.style.setProperty('--color-accent-rgb', '2, 132, 199');
    }
  }, [isDark]);

  // Dynamically set the Favicon
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = 'https://i.vgy.me/i97cgL.png';
  }, []);

  // Handle scroll spy for navigation and URL updating
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'qualifications', 'socials', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          if (currentSectionRef.current !== section) {
            currentSectionRef.current = section;
            setActiveSection(section);
            // Replace history state to update URL hash without causing a page jump
            window.history.replaceState(null, '', `#${section}`);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial hash if loaded with one
    if (window.location.hash) {
      const initialSection = window.location.hash.substring(1);
      if (['home', 'about', 'skills', 'qualifications', 'socials', 'contact'].includes(initialSection)) {
        setActiveSection(initialSection);
        currentSectionRef.current = initialSection;
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Push history state so the back button works
      window.history.pushState(null, '', `#${id}`);
      setActiveSection(id);
      currentSectionRef.current = id;
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-700 font-poppins text-[var(--text-color)] bg-[var(--bg-color)] relative`}>
      {/* Dynamic Backgrounds: Enhanced with robust grids, floating geometric elements and light sweeps */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
         
         {/* Moving Dot Matrix / Grid Pattern */}
         <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--color-accent-rgb),0.3)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] animate-[grid-move_20s_linear_infinite]"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--color-accent-rgb),0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--color-accent-rgb),0.15)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_90%_50%_at_50%_50%,#000_40%,transparent_100%)] animate-[grid-move_30s_linear_infinite_reverse]"></div>
         
         {/* Sweeping gradients */}
         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(var(--color-accent-rgb),0.08)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient-pan_15s_linear_infinite]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-accent-rgb),0.1)_0%,transparent_60%)] animate-[pulse-slow_8s_ease-in-out_infinite]"></div>
         
         {/* Cinematic horizontal scanning lines */}
         <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60 animate-[scan-line-bg_8s_ease-in-out_infinite] shadow-[0_0_10px_var(--color-accent)]"></div>
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40 animate-[scan-line-bg_12s_ease-in-out_infinite_reverse]"></div>

         {/* Floating Geometric Elements */}
         <div className="absolute top-[10%] left-[15%] w-12 h-12 border border-[var(--color-accent)]/30 rounded-full animate-[float_10s_ease-in-out_infinite]"></div>
         <div className="absolute bottom-[20%] right-[10%] w-24 h-24 border border-dashed border-[var(--color-accent)]/20 rounded-full animate-[spin-slow_15s_linear_infinite]"></div>
         <div className="absolute top-[60%] left-[5%] text-[var(--color-accent)]/20 animate-[float_8s_ease-in-out_infinite_reverse] text-4xl font-light">+</div>
         <div className="absolute top-[25%] right-[25%] text-[var(--color-accent)]/20 animate-[pulse-slow_5s_infinite] text-2xl font-light">○</div>
      </div>

      {/* Global Styles injected for specific effects like the flip card & fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');
        
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

        /* 3D Flip Card Profile - Enhanced */
        .circle-card { perspective: 1200px; }
        .circle-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .circle-card:hover .circle-card-inner { transform: rotateY(180deg) scale(1.02); }
        .circle-card-front, .circle-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 50%;
        }
        .circle-card-front {
          border: 3px solid rgba(var(--color-accent-rgb), 0.7);
          box-shadow: 0 4px 30px rgba(var(--color-accent-rgb),0.4), inset 0 0 20px rgba(var(--color-accent-rgb), 0.3);
        }
        .circle-card-back {
          transform: rotateY(180deg);
          background-color: rgba(var(--bg-color), 0.85);
          backdrop-filter: blur(10px);
          border: 3px solid rgba(var(--color-accent-rgb), 0.9);
          box-shadow: 0 4px 40px rgba(var(--color-accent-rgb),0.5);
        }

        /* Skill Card 3D Flip */
        .skill-card { perspective: 1000px; }
        .skill-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .skill-card:hover .skill-card-inner { transform: rotateY(180deg); }
        .skill-card-front, .skill-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0.75rem;
        }
        .skill-card-back {
          transform: rotateY(180deg);
        }
        
        /* Typing cursor blink */
        .typed-cursor { animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* Floating and Light Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes glare {
          0% { left: -100%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 200%; opacity: 0; }
        }
        @keyframes gradient-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(var(--color-accent-rgb), 0.4); box-shadow: 0 0 0 transparent; }
          50% { border-color: rgba(var(--color-accent-rgb), 1); box-shadow: 0 0 20px rgba(var(--color-accent-rgb), 0.6); }
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(1000px); opacity: 0; }
        }
        @keyframes scan-line-bg {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { 100% { transform: rotate(-360deg); } }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Custom Scrollbar - Refined */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-color); }
        ::-webkit-scrollbar-thumb { background: rgba(var(--color-accent-rgb), 0.6); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(var(--color-accent-rgb), 0.9); }
      `}} />

      {/* Navigation Header - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--bg-color)]/70 backdrop-blur-lg border-b border-[var(--color-accent)]/30 shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.15)] transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer group" onClick={() => scrollTo('home')}>
             <img 
               src="https://i.vgy.me/6xJ0Rz.png" 
               alt="Logo" 
               className="h-10 w-auto opacity-95 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:drop-shadow-[0_0_12px_var(--color-accent)]"
               onError={(e) => {
                 const target = e.target as HTMLImageElement;
                 target.style.display = 'none';
                 const nextElement = target.nextElementSibling as HTMLElement;
                 if (nextElement) nextElement.style.display = 'flex';
               }}
             />
             {/* Fallback AK Logo (Shows only if image fails to load) */}
             <div style={{display: 'none'}} className="items-center justify-center px-3 h-10 rounded-lg bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/60 transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.6)]">
                <span className="font-orbitron font-medium text-[var(--color-accent)] tracking-widest">AK</span>
             </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {['home', 'about', 'skills', 'qualifications', 'socials', 'contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item)}
                className={`uppercase text-xs font-bold tracking-widest transition-all duration-300 relative group py-2 ${activeSection === item ? 'text-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent)]' : 'text-[var(--text-color)] opacity-75 hover:opacity-100 hover:text-[var(--color-accent)]'}`}
              >
                {item}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-accent)] transition-transform duration-300 origin-left shadow-[0_0_10px_var(--color-accent)] ${activeSection === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full border border-[var(--color-accent)]/40 text-[var(--text-color)] opacity-90 hover:opacity-100 hover:bg-[var(--color-accent)]/20 hover:scale-110 hover:shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.5)] transition-all duration-300 relative overflow-hidden group"
              aria-label="Toggle Theme"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.4)] to-transparent translate-x-[-100%] group-hover:animate-[pan_1s_linear_infinite]"></div>
              {isDark ? <Sun size={18} className="animate-[pulse-slow_4s_infinite]" /> : <Moon size={18} className="animate-[pulse-slow_4s_infinite]" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden p-2 text-[var(--text-color)] opacity-90 hover:opacity-100 hover:text-[var(--color-accent)] transition-all duration-300 drop-shadow-[0_0_5px_var(--color-accent)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-16 left-0 w-full bg-[var(--bg-color)]/95 backdrop-blur-xl border-b border-[var(--color-accent)]/40 shadow-[0_15px_40px_rgba(var(--color-accent-rgb),0.2)] transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] py-6' : 'max-h-0 py-0 border-transparent'}`}>
          <div className="flex flex-col items-center space-y-6">
            {['home', 'about', 'skills', 'qualifications', 'socials', 'contact'].map((item) => (
              <button 
                key={item}
                onClick={() => {
                  scrollTo(item);
                  setIsMobileMenuOpen(false);
                }}
                className={`uppercase text-sm font-bold tracking-widest transition-colors duration-300 ${activeSection === item ? 'text-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent)]' : 'text-[var(--text-color)] opacity-80 hover:opacity-100 hover:text-[var(--color-accent)]'}`}
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
          
          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between z-10 gap-12">
            <div className="flex-1 text-center md:text-left relative">
              {/* Subtle Tech accents around text */}
              <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-[var(--color-accent)]/30 rounded-tl-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-[var(--color-accent)]/30 rounded-br-3xl opacity-50"></div>

              <Reveal direction="left" delay={100}>
                <p className="text-lg md:text-xl font-light mb-3 tracking-wide opacity-90">Hello, I'm</p>
              </Reveal>
              <Reveal direction="left" delay={300}>
                <h1 className="text-5xl md:text-7xl font-bold font-orbitron mb-4 tracking-tight group relative inline-block">
                  Anubhav <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-blue-500 drop-shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.5)]">Kumar</span>
                  {/* Subtle shine on name */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-[shine_3s_infinite_linear] bg-clip-text text-transparent pointer-events-none">Anubhav Kumar</span>
                </h1>
              </Reveal>
              <Reveal direction="left" delay={500}>
                <div className="h-12 mb-6 text-xl md:text-2xl font-medium text-[var(--color-accent)] opacity-100 drop-shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.6)]">
                  I am <span className="text-[var(--text-color)]">{typeWriterText}</span><span className="typed-cursor text-[var(--color-accent)]">|</span>
                </div>
              </Reveal>
              <Reveal direction="up" delay={700}>
                <p className="text-lg opacity-85 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
                  Full Stack Developer working at the intersection of AI, cloud, and real-world problem solving. Designing and shipping production-grade GenAI platforms for large-scale enterprise environments.
                </p>
              </Reveal>
              <Reveal direction="up" delay={900}>
                <div className="flex justify-center md:justify-start gap-6">
                  <button onClick={() => scrollTo('contact')} className="group relative overflow-hidden px-8 py-3 bg-[var(--text-color)] text-[var(--bg-color)] font-bold rounded-full transition-all duration-500 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-[glare_1s_ease-out]"></span>
                    Connect With Me
                  </button>
                  <button onClick={() => scrollTo('qualifications')} className="px-8 py-3 border-2 border-[var(--color-accent)]/70 text-[var(--text-color)] font-bold rounded-full hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-[0_0_25px_rgba(var(--color-accent-rgb),0.5)] transition-all duration-500 hover:bg-[var(--color-accent)]/15 relative overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.4)] to-transparent translate-x-[-100%] group-hover:animate-[pan_1.5s_linear_infinite]"></span>
                    View Work
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="flex-1 flex justify-center perspective-1000 relative">
              <Reveal direction="scale" delay={400}>
                {/* Float Animation - Intense Light Spinners that work in Dark/Light mode */}
                <div className="relative animate-[float_6s_ease-in-out_infinite] w-64 h-64 md:w-80 md:h-80">
                  
                  {/* Outer Radar Effect */}
                  <div className="absolute -inset-16 md:-inset-24 rounded-full border border-[var(--color-accent)]/10 overflow-hidden pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent to-[var(--color-accent)] origin-left animate-[radar-sweep_4s_linear_infinite] opacity-40"></div>
                  </div>

                  {/* Outer Dashed Ring - Stronger Opacity for Light Mode */}
                  <div className="absolute -inset-8 md:-inset-12 border-[3px] border-dashed border-[var(--color-accent)] opacity-70 rounded-full animate-[spin-slow_20s_linear_infinite] shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.5)]"></div>
                  
                  {/* Inner Solid Ring - High Contrast */}
                  <div className="absolute -inset-4 md:-inset-6 border-[2px] border-[var(--color-accent)] opacity-60 rounded-full animate-[spin-slow-reverse_15s_linear_infinite] shadow-[inset_0_0_15px_rgba(var(--color-accent-rgb),0.4)]"></div>
                  
                  {/* Innermost Thin Ring */}
                  <div className="absolute -inset-1 border border-[var(--text-color)] opacity-30 rounded-full animate-[spin-slow_25s_linear_infinite]"></div>

                  {/* Orbiting Satellite Dot 1 */}
                  <div className="absolute -inset-8 md:-inset-12 rounded-full animate-[spin-slow_8s_linear_infinite]">
                      <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--color-accent)] rounded-full shadow-[0_0_20px_var(--color-accent)] animate-pulse border-2 border-white/50"></div>
                  </div>
                  {/* Orbiting Satellite Dot 2 */}
                  <div className="absolute -inset-4 md:-inset-6 rounded-full animate-[spin-slow-reverse_12s_linear_infinite]">
                      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--text-color)] rounded-full shadow-[0_0_15px_var(--text-color)] border border-[var(--color-accent)]"></div>
                  </div>

                  <div className="circle-card w-full h-full cursor-pointer">
                    <div className="circle-card-inner">
                      {/* Front of Card */}
                      <div className="circle-card-front rounded-full overflow-hidden relative group">
                         {/* Card Scan Line */}
                         <div className="absolute top-0 left-[-100%] w-[150%] h-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.4)] to-transparent skew-x-[-45deg] group-hover:animate-[glare_1.5s_ease-out] z-10 pointer-events-none"></div>
                         <div className="absolute inset-0 bg-[url('https://i.vgy.me/3fo2Aj.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"></div>
                      </div>
                      
                      {/* Back of Card */}
                      <div className="circle-card-back relative overflow-hidden flex flex-col items-center justify-center text-center rounded-full">
                        {/* Background Data Pattern inside card */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(var(--color-accent-rgb),0.1)_25%,transparent_25%,transparent_50%,rgba(var(--color-accent-rgb),0.1)_50%,rgba(var(--color-accent-rgb),0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] pointer-events-none opacity-60"></div>
                        
                        <div className="relative z-10 flex flex-col items-center justify-center p-8">
                          <BrainCircuit size={56} className="text-[var(--color-accent)] mb-4 animate-[pulse-slow_3s_infinite] drop-shadow-[0_0_12px_var(--color-accent)]" />
                          <h3 className="font-orbitron font-bold text-3xl text-[var(--color-accent)] mb-2 tracking-widest drop-shadow-[0_0_8px_var(--color-accent)]">Let's Build</h3>
                          <p className="text-sm font-semibold opacity-90 uppercase tracking-wider">The future of AI & Data together.</p>
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
        <section id="about" className="min-h-[100svh] py-24 px-4 bg-black/5 dark:bg-white/[0.02] flex flex-col justify-center items-center relative overflow-hidden">
          
          {/* Section specific floating nodes */}
          <div className="absolute top-[10%] right-[10%] w-32 h-32 border border-[var(--color-accent)]/20 rounded-full animate-ping opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-[10%] left-[5%] w-48 h-48 border border-dashed border-[var(--color-accent)]/20 rounded-full animate-[spin-slow-reverse_20s_linear_infinite] opacity-30 pointer-events-none"></div>

          <div className="max-w-6xl mx-auto w-full relative z-10">
            <SectionHeading>About Me</SectionHeading>
            
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
              {/* Image Column */}
              <div className="w-full md:w-5/12 flex justify-center">
                <Reveal direction="left" delay={200}>
                  <div className="relative group animate-[float_8s_ease-in-out_infinite]">
                    {/* Glassy Frame Elements */}
                    <div className="absolute -inset-4 border-2 border-[var(--color-accent)]/30 rounded-2xl opacity-70 group-hover:rotate-3 group-hover:border-[var(--color-accent)]/60 transition-all duration-700 shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.2)] group-hover:shadow-[0_0_35px_rgba(var(--color-accent-rgb),0.4)]"></div>
                    {/* Animated Bracket Corners */}
                    <div className="absolute -top-6 -right-6 w-14 h-14 border-t-4 border-r-4 border-[var(--color-accent)] rounded-tr-xl opacity-90 transition-transform duration-500 group-hover:translate-x-3 group-hover:-translate-y-3 drop-shadow-[0_0_8px_var(--color-accent)]"></div>
                    <div className="absolute -bottom-6 -left-6 w-14 h-14 border-b-4 border-l-4 border-[var(--color-accent)] rounded-bl-xl opacity-90 transition-transform duration-500 group-hover:-translate-x-3 group-hover:translate-y-3 drop-shadow-[0_0_8px_var(--color-accent)]"></div>
                    
                    {/* Actual Image with Laser Scan */}
                    <div className="relative w-64 h-80 md:w-full md:h-[450px] max-w-sm rounded-2xl overflow-hidden border-2 border-[var(--color-accent)]/40 shadow-sm transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.3)]">
                      {/* Laser Scanner Effect */}
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl mix-blend-screen">
                         <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-90 animate-[scan-line_4s_linear_infinite] shadow-[0_0_15px_var(--color-accent)]"></div>
                      </div>
                      <div className="absolute inset-0 bg-[var(--color-accent)]/15 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                      <img 
                        src="https://i.vgy.me/hHGjs9.jpg" 
                        alt="Anubhav Kumar Professional" 
                        className="w-full h-full object-cover grayscale-[25%] hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Text Column */}
              <div className="w-full md:w-7/12 relative">
                
                {/* Vertical Data Line decoration next to text */}
                <div className="hidden md:block absolute -left-6 top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent opacity-40">
                  <div className="w-full h-10 bg-white shadow-[0_0_10px_var(--color-accent)] animate-[scan-line_3s_linear_infinite]"></div>
                </div>

                <Reveal direction="right" delay={400}>
                  <div className="text-[0.95rem] md:text-base opacity-90 leading-relaxed space-y-6 bg-[var(--bg-color)]/70 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-[var(--color-accent)]/30 shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:border-[var(--color-accent)]/60 transition-all duration-500 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.15)]">
                    {/* Light Sweep Background */}
                    <div className="absolute top-0 left-[-100%] w-[100%] h-full bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.12)] to-transparent skew-x-[-45deg] group-hover:animate-[glare_2.5s_ease-out_infinite] pointer-events-none z-0"></div>

                    <p className="font-light relative z-10">I’m a Full Stack Developer working at the intersection of AI, cloud, and real-world problem solving.</p>
                    <p className="font-light relative z-10">Currently, I design and ship production-grade GenAI powered platforms used across large-scale enterprise environments. My work spans frontend, backend, cloud infrastructure, and AI systems, with a strong focus on reliability, performance, and measurable business impact.</p>
                    <p className="font-semibold text-[var(--color-accent)] tracking-wide relative z-10 drop-shadow-[0_0_4px_rgba(var(--color-accent-rgb),0.6)]">Here’s the kind of problems I solve:</p>
                    <ul className="list-disc pl-6 space-y-2 font-light relative z-10">
                      <li>Turning complex policies and data into fast, usable AI-driven systems</li>
                      <li>Building LLM and RAG-based platforms on AWS that reduce manual effort and decision time</li>
                      <li>Creating scalable APIs and dashboards that teams actually enjoy using</li>
                      <li>Improving operational efficiency through automation and data-driven workflows</li>
                    </ul>
                    <p className="font-light relative z-10">My background in engineering and data analysis shapes how I think: structured, curious, and impact-focused. I enjoy collaborating with cross-functional teams, mentoring peers, and building systems that hold up in production, not just demos.</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* --- Skills Section --- */}
        <section id="skills" className="min-h-[100svh] py-20 px-4 flex flex-col justify-center items-center relative overflow-hidden">
          
          {/* Background Connecting Nodes Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzAwZTVmZiIvPjxwYXRoIGQ9Ik0yMCAwbDAtMjBNMjAgMjBsMC0yME0wIDIwbDIwIDBMMjAgMEwyMCAyME0yMCAyMGwyMCAwbC0yMCAwIiBzdHJva2U9IiMwMGU1ZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] animate-[pulse-slow_10s_infinite]"></div>

          <div className="max-w-5xl mx-auto w-full z-10">
            <SectionHeading>Technical Arsenal</SectionHeading>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 relative z-10">
              <SkillCard 
                delay={100}
                imageSrc="https://img.icons8.com/fluency/96/artificial-intelligence.png" 
                title="Generative AI" 
                description="Built enterprise-grade GenAI platforms, focusing on scalable, performant AI solutions and workflow optimization."
                icon={undefined}
              />
              <SkillCard 
                delay={200}
                imageSrc="https://img.icons8.com/fluency/96/chatgpt.png" 
                title="LLMs & RAG" 
                description="Developed intelligent RAG systems on AWS, significantly reducing manual policy lookup times for enterprise portals."
                icon={undefined}
              />
              <SkillCard 
                delay={300}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" 
                title="AWS Bedrock" 
                description="Deployed and managed foundation models leveraging AWS infrastructure to build robust, cloud-native AI workflows."
                icon={undefined}
              />
              <SkillCard 
                delay={400}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" 
                title="Python & FastAPI" 
                description="Designed and maintained scalable backend services, rapid data pipelines, and high-performance APIs."
                icon={undefined}
              />
              <SkillCard 
                delay={500}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
                title="React & Next.js" 
                description="Created responsive, user-friendly frontend components and enterprise dashboards focusing on usability and accessibility."
                icon={undefined}
              />
              <SkillCard 
                delay={600}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" 
                title="PostgreSQL & SQL" 
                description="Wrote complex queries for data validation, ETL pipelines, and business intelligence reporting to track automation outputs."
                icon={undefined}
              />
              <SkillCard 
                delay={700}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" 
                title="Machine Learning" 
                description="Analyzed and optimized data pipelines for ML models, culminating in capstone project applications with IIT Roorkee."
                icon={undefined}
              />
              <SkillCard 
                delay={800}
                imageSrc="https://cdn.simpleicons.org/uipath/FA4616" 
                title="RPA & Automation" 
                description="Supported quality assurance and tested enterprise automation workflows yielding significant operational time savings."
                icon={undefined}
              />
              <SkillCard 
                delay={900}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg" 
                title="Hadoop" 
                description="Designed and maintained massive enterprise data lakes for robust big data storage and distributed processing."
                icon={undefined}
              />
              <SkillCard 
                delay={1000}
                imageSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" 
                title="Oracle SQL" 
                description="Engineered complex analytical queries for corporate BI reporting and structured database management."
                icon={undefined}
              />
              <SkillCard 
                delay={1100}
                imageSrc="https://www.vectorlogo.zone/logos/apache_hive/apache_hive-icon.svg" 
                title="Hive" 
                description="Leveraged Hive infrastructure to efficiently structure, summarize, and query large-scale distributed datasets."
                icon={undefined}
              />
              <SkillCard 
                delay={1200}
                imageSrc="https://cdn.simpleicons.org/swagger/85EA2D" 
                title="Custom Integrations" 
                description="Developed custom tailored solutions bridging modern frontends, robust backends, and various cross-platform APIs."
                icon={undefined}
              />
            </div>
          </div>
        </section>

        {/* --- Qualifications Section (Growing Tree + Certifications) --- */}
        <section id="qualifications" className="min-h-[100svh] py-20 px-4 bg-black/5 dark:bg-white/[0.02] flex flex-col justify-center items-center relative z-10 overflow-hidden">
          
          {/* Central Pulsing Nodes Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] border-[1px] border-[var(--color-accent)]/10 rounded-full animate-[ping_10s_linear_infinite] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] border-[1px] border-[var(--color-accent)]/20 rounded-full animate-[ping_8s_linear_infinite_2s] pointer-events-none"></div>

          <div className="max-w-5xl mx-auto w-full relative z-10">
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
                <div className="relative z-10 mt-24 mb-10 flex justify-start pl-16 md:pl-0 md:justify-center w-full group">
                   {/* Dot on the trunk for mobile */}
                   <div className="md:hidden absolute left-[24px] -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bg-color)] border border-[var(--color-accent)] z-20 shadow-[0_0_12px_var(--color-accent)] animate-pulse"></div>
                   {/* Branch to badge */}
                   <div className="md:hidden absolute left-[24px] top-1/2 -translate-y-1/2 w-10 h-[2px] bg-gradient-to-l from-[var(--color-accent)] to-transparent opacity-80 z-10"></div>
                   
                   <div className="px-8 py-2.5 bg-[var(--bg-color)]/90 backdrop-blur-md border border-[var(--color-accent)]/60 rounded-full text-[var(--color-accent)] font-orbitron font-bold flex items-center gap-2 relative z-20 hover:border-[var(--color-accent)] transition-all overflow-hidden cursor-default shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.6)]">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.3)] to-transparent translate-x-[-100%] group-hover:animate-[glare_1.5s_ease-out_infinite]"></span>
                      <Award size={20} className="opacity-100 group-hover:scale-125 transition-all drop-shadow-[0_0_8px_var(--color-accent)] animate-pulse" /> CERTIFICATIONS
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
        <section id="socials" className="min-h-[100svh] py-24 px-4 flex flex-col items-center justify-center relative z-10 overflow-hidden">
          
          {/* Radar Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[var(--color-accent)]/5 pointer-events-none opacity-50 overflow-hidden">
             <div className="absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent to-[var(--color-accent)] origin-left animate-[radar-sweep_4s_linear_infinite] opacity-30"></div>
          </div>

          <div className="max-w-5xl mx-auto w-full relative z-10">
            <SectionHeading>Social Network</SectionHeading>
            
            <Reveal direction="up" delay={200}>
              <p className="text-center max-w-xl mx-auto opacity-85 mb-16 text-lg font-light">
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
        <section id="contact" className="min-h-[100svh] py-32 px-4 bg-black/5 dark:bg-white/[0.02] relative flex flex-col items-center justify-center z-10 overflow-hidden">
          
          {/* Ambient glowing rings in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[var(--color-accent)]/20 rounded-full animate-ping pointer-events-none opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[var(--color-accent)]/10 rounded-full animate-[ping_3s_linear_infinite] pointer-events-none opacity-30"></div>

          <SectionHeading>Initialize Connection</SectionHeading>
          
          <Reveal direction="scale" delay={200}>
            <div className="text-center max-w-xl mx-auto mb-10 relative z-10">
              <div className="relative inline-block mb-6">
                 {/* Stronger pulse behind icon */}
                 <div className="absolute inset-0 bg-[var(--color-accent)] opacity-40 blur-2xl rounded-full animate-[pulse-slow_2s_infinite]"></div>
                 <Mail className="w-20 h-20 mx-auto text-[var(--color-accent)] animate-[float_4s_ease-in-out_infinite] relative z-10 drop-shadow-[0_0_12px_var(--color-accent)]" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold mb-4 tracking-wide drop-shadow-md">Let's Work Together</h3>
              <p className="text-lg opacity-85 mb-10 font-light leading-relaxed">
                Whether you have a question, a project idea, or just want to say hi, my inbox is always open. I'll try my best to get back to you!
              </p>
              
              <a href="mailto:work@anubhavkumaar.in" className="group relative inline-block px-10 py-4 bg-[var(--bg-color)]/90 backdrop-blur-md border-2 border-[var(--color-accent)]/70 text-[var(--text-color)] font-bold text-lg rounded-full transition-all duration-500 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:scale-110 overflow-hidden shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.3)] hover:shadow-[0_0_35px_rgba(var(--color-accent-rgb),0.6)] hover:bg-[var(--color-accent)]/20">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(var(--color-accent-rgb),0.4)] to-transparent translate-x-[-100%] group-hover:animate-[glare_1.5s_ease-out_infinite]"></span>
                Say Hello
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-[var(--text-color)]/10 text-sm opacity-60 font-light backdrop-blur-md bg-[var(--bg-color)]/50">
        <p className="font-orbitron tracking-[0.2em] font-medium">&copy; {new Date().getFullYear()} ANUBHAV KUMAR. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}