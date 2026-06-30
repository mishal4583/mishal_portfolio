'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Loader from './components/Loader';
import AmbientCanvas from './components/AmbientCanvas';
import Navigation, { SECTIONS } from './components/Navigation';
import Robot from './components/Robot';
import NebulaCanvas from './components/NebulaCanvas';

const SplineViewer = dynamic(() => import('./components/SplineViewer'), { ssr: false });

/* ─── Data ─────────────────────────────────────────────────────── */
const PROJECTS = [
  { id: 1, num: '01', img: '/images/projects/unitrack.png', alt: 'UniTrack', stack: 'FLUTTER · FIREBASE · SOLIDITY', title: 'UniTrack', desc: 'Blockchain-based campus academic & credit management — role-based dashboards for students, faculty and admins, with tamper-proof certificates anchored on Ethereum (Sepolia) via Solidity smart contracts and a hybrid on-chain/off-chain Firestore architecture.', link: 'https://github.com/mishal4583/UniTrack-Academic-Platform' },
  { id: 2, num: '02', img: '/images/projects/veycho.png', alt: 'Veycho Resto-Café', stack: 'NEXT.JS 16 · TYPESCRIPT · SUPABASE', title: 'Veycho Resto-Café', desc: 'A production restaurant platform live at veycho.in, serving a café in Wayanad — animated page transitions, a dynamic menu explorer, a masonry photo gallery and an AI concierge, all on Next.js 16 + Supabase, deployed on Vercel.', link: 'https://veycho.in', live: true },
  { id: 3, num: '03', img: '/images/projects/nutriai.png', alt: 'NutriAI', stack: 'FLUTTER · FLASK · ML', title: 'NutriAI', desc: 'An AI-powered health & nutrition assistant — a Flutter app with a Flask ML backend predicting risk for diabetes, cholesterol, triglycerides and hypertension, with role-based access for patients and doctors.', link: 'https://github.com/mishal4583/NutriAI' },
  { id: 4, num: '04', img: '/images/projects/clustrr.png', alt: 'Clustrr', stack: 'FLUTTER · FIREBASE · WEBRTC', title: 'Clustrr', desc: 'A centralized academic collaboration app for students, class reps and teachers — secure auth, real-time announcements, material sharing and batch-wise messaging via Firebase Cloud Messaging.', link: 'https://github.com/mishal4583/clustrr' },
  { id: 5, num: '05', img: '/images/projects/speech-recognition.jpg', alt: 'Speech Recognition System', stack: 'GENERATIVE AI · FASTAPI', title: 'Speech Recognition System', desc: 'Real-time and batch speech-to-text on faster-whisper, with multilingual transcription and intelligent chunking for large audio files.', link: 'https://github.com/mishal4583/Generative-AI-Speech-Recognition-System' },
];

const CERTS = [
  { id: 1, issuer: 'LINKEDIN LEARNING', year: '2025', title: 'AI Engineering Essentials: Navigating the Tech Revolution', link: 'https://www.linkedin.com/learning/certificates/3c51cbd7263c39304cfe469878e9b90624379a0df54dbbc75aeafe21fa5eac54' },
  { id: 2, issuer: 'LINKEDIN LEARNING', year: '2025', title: 'AI in Connected Products (AIoT)', link: 'https://www.linkedin.com/learning/certificates/1216f485ed19365a16a760fe0117a79cad0fe9779a40629af5bb51b84a92a3e5' },
  { id: 3, issuer: 'IBM · COURSERA', year: '2025', title: 'Introduction to Artificial Intelligence (AI)', link: 'https://coursera.org/share/d4d022e9cd590aae51a5219e42a82a45' },
  { id: 4, issuer: 'IBM · COURSERA', year: '2024', title: 'Python for Data Science, AI & Development', link: 'https://coursera.org/share/734a24398c834c558ae3df6d40ad5286' },
  { id: 5, issuer: 'CODIO · COURSERA', year: '2025', title: 'Object-Oriented Python: Inheritance & Encapsulation', link: 'https://coursera.org/share/406ddb4e7fc5875a662f00954a83a433' },
  { id: 6, issuer: 'GOOGLE · COURSERA', year: '2025', title: 'Foundations: Data, Data, Everywhere', link: 'https://coursera.org/share/d705c21a0bd8fdf25fe40187559b9038' },
  { id: 7, issuer: 'JAIN · COURSERA', year: '2025', title: 'Fundamentals of Data Science', link: 'https://coursera.org/share/a9d9c3b38fd2a0785d78f78190fbce85' },
  { id: 8, issuer: 'AWS · COURSERA', year: '2025', title: 'AWS Cloud Practitioner Essentials', link: 'https://coursera.org/share/be059802ec812d56409cf015393b56b2' },
  { id: 9, issuer: 'IBM · COURSERA', year: '2024', title: 'Introduction to Cloud Computing', link: 'https://coursera.org/share/fa8d81b98aa7a0a3527e32e37f650475' },
  { id: 10, issuer: 'JAIN · COURSERA', year: '2025', title: 'Exploring the Internet of Things', link: 'https://coursera.org/share/07f96881cc53bbbf684989003f554208' },
  { id: 11, issuer: 'VANDERBILT · COURSERA', year: '2025', title: 'Android App Components: Intents, Activities & Broadcast Receivers', link: 'https://coursera.org/share/e8dba544fb33517398fa5d4282edef10' },
  { id: 12, issuer: 'UIUC · COURSERA', year: '2024', title: 'Ordered Data Structures', link: 'https://coursera.org/share/dc89057398b63c193f8db75a3011f871' },
  { id: 13, issuer: 'U. COLORADO · COURSERA', year: '2024', title: 'Fundamentals of Network Communication', link: 'https://coursera.org/share/a9e394ad2bd2bb7d699ad615f460042c' },
  { id: 14, issuer: 'ARM · COURSERA', year: '2024', title: 'Introduction to Microprocessors', link: 'https://coursera.org/share/faf4f63152b46f226e800f7ea6e1c967' },
];

const PATH_ITEMS = [
  { year: '2025', title: 'Generative AI Intern', sub: 'Prodigy Infotech (Virtual) · text generation, model inference & prompt engineering — recognized for outstanding performance' },
  { year: '2025', title: 'Artificial Intelligence Intern', sub: 'CODTECH IT Solutions (Virtual) · 6-week internship in applied AI concepts & ML workflows' },
  { year: '2023—24', title: 'Software Development Intern', sub: 'Kenmerk Softwares · built the Wanderin travel-management platform with Dart, Flutter & React' },
  { year: '2024—Now', title: 'Master of Computer Applications', sub: 'JAIN (Deemed-to-be University), Bengaluru' },
  { year: '2021—24', title: 'Bachelor of Computer Applications', sub: 'Alphonsa Arts & Science College, Wayanad' },
];

const MANIFESTO_WORDS = [
  { text: 'I', accent: false }, { text: 'build', accent: false }, { text: 'full-stack', accent: true },
  { text: 'products', accent: false }, { text: '—', accent: false }, { text: 'mobile,', accent: false },
  { text: 'web', accent: false }, { text: '&', accent: false }, { text: 'blockchain', accent: true },
  { text: '—', accent: false }, { text: 'and', accent: false }, { text: 'put', accent: false },
  { text: 'AI', accent: true }, { text: 'where', accent: false }, { text: 'it', accent: false },
  { text: 'matters.', accent: true },
];

const MARQUEE_ROW1 = ['Python', 'Flutter', 'Next.js', 'Firebase', 'Solidity', 'FastAPI'];
const MARQUEE_ROW2 = ['React', 'TypeScript', 'TensorFlow', 'Supabase', 'Ethereum', 'Flask'];

const STACK_GROUPS = [
  { label: 'LANGUAGES', chips: ['Python', 'Java', 'C', 'SQL', 'JavaScript', 'Dart'] },
  { label: 'FRONTEND', chips: ['Flutter', 'React', 'Next.js', 'HTML / CSS'] },
  { label: 'BACKEND & APIs', chips: ['FastAPI', 'Flask', 'REST APIs', 'Firebase Auth', 'Cloud Functions'] },
  { label: 'DATA & CLOUD', chips: ['Firestore', 'Firebase Storage', 'MySQL', 'NoSQL', 'AWS'] },
  { label: 'BLOCKCHAIN', chips: ['Ethereum', 'Solidity', 'Smart Contracts', 'Ethers.js'] },
  { label: 'AI / ML', chips: ['Transformers', 'GPT-2', 'TensorFlow', 'Stable Diffusion', 'GANs', 'Hugging Face', 'NumPy', 'OpenCV'] },
  { label: 'TOOLS', chips: ['Git', 'GitHub', 'Google Colab', 'Streamlit', 'Android Studio'] },
];

const CHAT_CONTEXT = "You are the portfolio assistant for Mishal KS, a full-stack developer and MCA student at JAIN University, Bangalore. He builds Flutter, Next.js, React, FastAPI, Flask and Firebase apps, works with Ethereum/Solidity smart contracts, and applies AI/ML. Key projects: UniTrack (blockchain campus + tamper-proof certificates on Ethereum Sepolia), Veycho (live production restaurant site at veycho.in built with Next.js 16 + Supabase), NutriAI (Flutter + Flask ML health app predicting diabetes & hypertension), Clustrr (Flutter + Firebase academic collaboration app), AI Speech Recognition (faster-whisper + FastAPI). 3 internships: Prodigy Infotech Gen AI intern, CODTECH AI intern, Kenmerk Softwares software dev intern (built Wanderin travel platform). 14 certifications from IBM, Google, AWS, LinkedIn Learning. Email: mishal444583@gmail.com. GitHub: @mishal4583. Be concise and accurate — answer in 2-4 sentences. If asked about availability or hiring, say he is open to opportunities.";

/* ─── Main Component ─────────────────────────────────────────── */
export default function Portfolio() {
  const heroRef = useRef(null);
  const heroPinRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroSplineRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const heroCueRef = useRef(null);
  const projPinRef = useRef(null);
  const projTrackRef = useRef(null);
  const scrollBarRef = useRef(null);
  const mouseRef = useRef({ mx: 720, my: 400 });
  const wordsInViewRef = useRef(false);

  /* ── Dynamic data — all sourced from /api/portfolio ── */
  const [projects, setProjects] = useState(PROJECTS);
  const [certs, setCerts] = useState(CERTS);
  const [pathItems, setPathItems] = useState(PATH_ITEMS);
  const [stackGroups, setStackGroups] = useState(STACK_GROUPS);
  const [numbersData, setNumbersData] = useState([
    { target: 5, suffix: '+', label: 'Flagship full-stack builds', key: 'stat-0' },
    { target: 3, suffix: '', label: 'Internships completed', key: 'stat-1' },
    { target: 14, suffix: '', label: 'Professional certifications', key: 'stat-2' },
    { target: 1, suffix: '', label: 'Live production platform', key: 'stat-3' },
    { target: 20, suffix: '+', label: 'Tools & frameworks across the stack', key: 'stat-4' },
  ]);
  const [heroData, setHeroData] = useState({
    name: 'Mishal KS',
    subtitle: 'FULL-STACK DEVELOPER · AI ENGINEER · MOBILE & WEB',
    description: 'I build full-stack mobile & web apps — Flutter, Next.js, Firebase, blockchain and applied AI — and ship them to real users.',
    resumeUrl: '',
  });
  const [aboutData, setAboutData] = useState({
    heading: 'An MCA student who ships full-stack products — mobile, web, blockchain & AI.',
    paragraphs: [
      "I'm a full-stack developer based in Bangalore, building scalable mobile and web apps with Flutter, Next.js, React, FastAPI, Flask and Firebase — and weaving in applied AI and blockchain where they add real value.",
      "I like carrying an idea all the way to a shipped product people actually use — from a live restaurant platform serving real customers to a blockchain-backed campus credit system — and I'm eager to bring that to ambitious engineering teams.",
    ],
    cards: [
      { label: 'LOCATION', val: 'Bangalore, IN' },
      { label: 'EDUCATION', val: 'MCA · JAIN' },
      { label: 'FOCUS', val: 'Full-Stack + AI' },
      { label: 'STATUS', val: 'Open to roles' },
      { label: 'INTERESTS', val: 'Blockchain & AI' },
      { label: 'LANGUAGES', val: 'ML · EN · +3' },
    ],
  });
  const [contactData, setContactData] = useState({
    email: 'Mishal444583@gmail.com',
    phone: '+91 8921894609',
    location: 'Bangalore, Karnataka, India',
    github: 'https://github.com/mishal4583',
    linkedin: 'https://www.linkedin.com/in/mishal-ks-5611a5233/',
    roles: ['Full-Stack Developer', 'AI / ML Engineer', 'Prompt Engineer', 'Software Engineer', 'Mobile Developer', 'Freelance'],
  });
  const [featuredData, setFeaturedData] = useState({
    title: 'Veycho Resto-Café',
    description: 'A full-stack restaurant & hospitality platform — designed, built and deployed to production at veycho.in, now serving a real café in Wayanad, Kerala.',
    url: 'https://veycho.in',
    img: '/images/projects/veycho.png',
    tags: ['Next.js 16', 'TypeScript', 'Supabase', 'Vercel', 'Live in production'],
    details: [
      { label: 'THE PROBLEM', text: 'A growing café needed more than a social page — a fast, branded web presence where guests could browse the menu, explore the area and get in touch.' },
      { label: 'THE SOLUTION', text: 'A production Next.js 16 site on Vercel with a custom domain, backed by Supabase for real-time menu, gallery and content management.' },
      { label: 'ARCHITECTURE', text: 'Next.js App Router → Supabase (Postgres + Storage) → Vercel edge' },
      { label: 'KEY FEATURES', text: '3-phase animated page transitions · dynamic menu explorer · masonry photo gallery with lightbox · AI concierge chatbot · WhatsApp & Instagram FABs.' },
    ],
  });
  const [ailabData, setAilabData] = useState({
    headingMain: "Don't read about my AI.",
    headingAccent: 'Talk to it.',
    subheading: 'Ask this assistant anything about my work, stack or projects — it answers live.',
    context: CHAT_CONTEXT,
  });
  const [manifestoText, setManifestoText] = useState('I build *full-stack* products — mobile, web & *blockchain* — and put *AI* where it *matters.*');
  const [marqueeRows, setMarqueeRows] = useState({ row1: MARQUEE_ROW1, row2: MARQUEE_ROW2 });
  const [githubData, setGithubData] = useState({
    username: 'mishal4583',
    pinnedRepos: [
      { name: 'veycho.in', desc: 'Live restaurant platform · Next.js 16 + Supabase + Vercel', href: 'https://veycho.in', live: true },
      { name: 'UniTrack-Academic-Platform', desc: 'Blockchain campus management · Flutter + Solidity', href: 'https://github.com/mishal4583/UniTrack-Academic-Platform' },
      { name: 'NutriAI', desc: 'AI health assistant · Flutter + Flask + ML', href: 'https://github.com/mishal4583/NutriAI' },
      { name: 'clustrr', desc: 'Academic collaboration app · Flutter + Firebase', href: 'https://github.com/mishal4583/clustrr' },
    ],
    languages: [
      { lang: 'Dart', sub: 'Flutter', pct: 38, color: '#54C5F8' },
      { lang: 'Python', sub: 'ML · AI · Backend', pct: 28, color: '#3572A5' },
      { lang: 'JS / TS', sub: 'Next.js · React', pct: 18, color: '#F1E05A' },
      { lang: 'Java', sub: 'Android · DSA', pct: 9, color: '#B07219' },
      { lang: 'Solidity', sub: 'Smart Contracts', pct: 7, color: '#AA6746' },
    ],
  });

  const [activeSection, setActiveSection] = useState(0);
  const [chapNum, setChapNum] = useState(0);
  const [chapName, setChapName] = useState('INTRO');
  const [showToTop, setShowToTop] = useState(false);
  const [isLightBg, setIsLightBg] = useState(false);
  const [wordsVisible, setWordsVisible] = useState(false);
  const [revealMap, setRevealMap] = useState({});
  const [counterTriggers, setCounterTriggers] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const LIGHT_SECTIONS = new Set(['FEATURED', 'NUMBERS', 'PATH']);

  /* ── Load portfolio data from API ── */
  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(d => {
        if (d.projects?.length) setProjects(d.projects);
        if (d.certs?.length) setCerts(d.certs);
        if (d.path?.length) setPathItems(d.path);
        if (d.stack?.length) setStackGroups(d.stack);
        if (d.numbers?.length) setNumbersData(d.numbers.map((n, i) => ({ ...n, key: `stat-${i}` })));
        if (d.hero) setHeroData(prev => ({ ...prev, ...d.hero }));
        if (d.about) setAboutData(d.about);
        if (d.contact) setContactData(prev => ({ ...prev, ...d.contact }));
        if (d.featured) setFeaturedData(d.featured);
        if (d.manifesto) setManifestoText(d.manifesto);
        if (d.marquee) setMarqueeRows(d.marquee);
        if (d.github) setGithubData(d.github);
        if (d.ailab) setAilabData(prev => ({ ...prev, ...d.ailab }));
      })
      .catch((e) => console.error('Failed to load portfolio data:', e));
  }, []);

  /* ── Mobile detection ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Mouse tracking ── */
  useEffect(() => {
    const onMove = (e) => { mouseRef.current = { mx: e.clientX, my: e.clientY }; };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* ── Scroll handler ── */
  useEffect(() => {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    let ticking = false;
    // Cache DOM queries — never query inside the scroll/RAF callback
    let cachedChapters = null, cachedParallax = null;
    const getChapters  = () => cachedChapters  || (cachedChapters  = Array.from(document.querySelectorAll('.chapter')));
    const getParallax  = () => cachedParallax  || (cachedParallax  = Array.from(document.querySelectorAll('[data-parallax]')));

    const sizeProjPin = () => {
      const pin = projPinRef.current, track = projTrackRef.current;
      if (!pin || !track) return;
      const sticky = pin.querySelector('.projects-sticky');
      // Clear any previously-set inline overrides so CSS controls layout
      if (sticky) {
        sticky.style.position = '';
        sticky.style.height = '';
        sticky.style.overflow = '';
        sticky.style.flexDirection = '';
        sticky.style.alignItems = '';
        sticky.style.padding = '';
      }
      track.style.flexDirection = '';
      track.style.overflowX = '';
      track.style.scrollSnapType = '';
      track.style.padding = '';
      track.style.width = '';
      track.style.gap = '';
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      pin._extra = extra;
      pin.style.height = (extra + window.innerHeight) + 'px';
    };

    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docH = document.documentElement.scrollHeight - vh;

        // progress bar
        if (scrollBarRef.current) scrollBarRef.current.style.width = (docH > 0 ? (scrollTop / docH) : 0) * 100 + '%';

        // back to top
        setShowToTop(scrollTop > vh * 0.8);

        // hero parallax
        const heroPin = heroPinRef.current;
        const heroContent = heroContentRef.current;
        const heroSpline = heroSplineRef.current;
        const heroOverlay = heroOverlayRef.current;
        const heroCue = heroCueRef.current;
        const { mx, my } = mouseRef.current;
        if (heroPin) {
          const r = heroPin.getBoundingClientRect();
          const total = heroPin.offsetHeight - vh;
          const p = clamp(-r.top / total, 0, 1);
          const px = (mx / window.innerWidth - 0.5), py = (my / vh - 0.5);
          if (heroContent) {
            heroContent.style.transform = `translate(${px * 14}px, ${-p * 90 + py * 10}px) scale(${1 + p * 0.55})`;
            heroContent.style.opacity = `${clamp(1 - p * 1.3, 0, 1)}`;
          }
          if (heroSpline) heroSpline.style.transform = `scale(${1 + p * 0.2}) translate(${px * -26}px, ${py * -16}px)`;
          if (heroOverlay) heroOverlay.style.opacity = `${clamp(0.9 + p * 0.1, 0, 1)}`;
          if (heroCue) heroCue.style.opacity = `${clamp(1 - p * 5, 0, 1)}`;
        }

        // horizontal projects scroll
        const projPin = projPinRef.current, projTrack = projTrackRef.current;
        if (projPin && projTrack) {
          const r = projPin.getBoundingClientRect();
          const p = clamp(-r.top / (projPin.offsetHeight - vh), 0, 1);
          projTrack.style.transform = `translate3d(${-p * (projPin._extra || 0)}px, 0, 0)`;
          const hint = projPin.querySelector('.work-hint');
          if (hint) hint.style.opacity = `${clamp(1 - p * 7, 0, 1)}`;
        }

        // parallax images
        getParallax().forEach(el => {
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2 - vh / 2;
          const speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
          el.style.transform = `translateY(${-center * speed}px)`;
        });

        // active section — track by data-name so nav order can differ from DOM order
        const sections = getChapters();
        let activeName = 'INTRO', activeDomIdx = 0;
        sections.forEach((s, i) => {
          if (s.getBoundingClientRect().top <= vh * 0.45) {
            activeName = s.getAttribute('data-name') || 'INTRO';
            activeDomIdx = i;
          }
        });
        const navIdx = SECTIONS.findIndex(s => s.name === activeName);
        setActiveSection(navIdx >= 0 ? navIdx : 0);
        setChapNum(navIdx >= 0 ? navIdx : 0);
        setChapName(activeName);
        setIsLightBg(LIGHT_SECTIONS.has(activeName));

        ticking = false;
      });
    };

    const onResize = () => { sizeProjPin(); onScroll(); };
    sizeProjPin();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* ── IntersectionObserver for reveals ── */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const key = entry.target.dataset.revealKey;
          if (key) setRevealMap(prev => ({ ...prev, [key]: true }));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('[data-reveal-key]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── IntersectionObserver for manifesto words ── */
  useEffect(() => {
    const el = document.getElementById('manifesto');
    if (!el) return;
    const wio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setWordsVisible(true); wio.unobserve(e.target); } });
    }, { threshold: 0.2 });
    wio.observe(el);
    return () => wio.disconnect();
  }, []);

  /* ── IntersectionObserver for counters ── */
  useEffect(() => {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const key = e.target.dataset.counterKey;
          if (key) setCounterTriggers(prev => ({ ...prev, [key]: true }));
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter-key]').forEach(el => cio.observe(el));
    return () => cio.disconnect();
  }, []);

  /* ── Cursor ring ── */
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    let tx = -100, ty = -100, rx = -100, ry = -100, seen = false, rafId;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; if (!seen) { seen = true; ring.style.opacity = '1'; } };
    window.addEventListener('mousemove', onMove, { passive: true });
    const grow = () => { ring.style.width = '52px'; ring.style.height = '52px'; ring.style.marginLeft = '-11px'; ring.style.marginTop = '-11px'; ring.style.backgroundColor = 'rgba(255,87,34,0.18)'; };
    const shrink = () => { ring.style.width = '30px'; ring.style.height = '30px'; ring.style.marginLeft = '0'; ring.style.marginTop = '0'; ring.style.backgroundColor = 'transparent'; };
    document.querySelectorAll('a, button, .rail-dot, .robot, .chip, input').forEach(el => {
      el.addEventListener('mouseenter', grow); el.addEventListener('mouseleave', shrink);
    });
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.transform = `translate(${rx - 15}px, ${ry - 15}px)`;
      dot.style.transform = `translate(${tx - 2.5}px, ${ty - 2.5}px)`;
    };
    tick();
    return () => { cancelAnimationFrame(rafId); ring.remove(); dot.remove(); window.removeEventListener('mousemove', onMove); };
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop + 2, behavior: 'smooth' });
  }, []);

  const getMouse = useCallback(() => mouseRef.current, []);

  return (
    <>
      <Loader />

      {/* Scroll progress */}
      <div className="scroll-progress-wrap">
        <div className="scroll-bar" ref={scrollBarRef} />
      </div>

      <AmbientCanvas heroRef={heroPinRef} />

      <Navigation
        active={activeSection}
        onNavClick={scrollTo}
        showToTop={showToTop}
        onToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        chapNum={chapNum}
        chapName={chapName}
        isLight={isLightBg}
      />

      <Robot chapName={chapName} />

      {/* ── 00 · HERO ── */}
      <section className="chapter hero-pin" data-name="INTRO" id="sec-hero" ref={heroPinRef}>
        <div className="hero-sticky" ref={heroRef}>
          {!isMobile && (
            <div className="hero-spline" ref={heroSplineRef}>
              <SplineViewer />
            </div>
          )}
          {!isMobile && <div className="hero-overlay" ref={heroOverlayRef} />}
          {!isMobile && (
            <div className="hero-live-pill">
              <span className="hero-live-dot" />
              <span className="hero-live-text">LIVE 3D &nbsp;&middot;&nbsp; DRAG TO EXPLORE</span>
            </div>
          )}

          <div className="hero-content" ref={heroContentRef}>
            <div className="hero-inner">
              <div className="hero-eyebrow">
                <span />&nbsp;PORTFOLIO&nbsp;·&nbsp;2026
              </div>
              <h1 className="hero-name">
                {(() => {
                  const parts = (heroData.name || 'Mishal KS').split(' ');
                  const first = parts[0] || 'Mishal';
                  const last = parts.slice(1).join(' ') || 'KS';
                  const lastStart = 0.30 + first.length * 0.07;
                  const dotDelay = lastStart + last.length * 0.07;
                  return (<>
                    {first.split('').map((ch, i) => (
                      <span key={i} className="hl" style={{ animationName: 'letterRise', animationDuration: '0.9s', animationDelay: `${0.30 + i * 0.07}s`, animationFillMode: 'both' }}>{ch}</span>
                    ))}
                    <br />
                    {last.split('').map((ch, i) => (
                      <span key={i} className="hl accent" style={{ animationName: 'letterRise', animationDuration: '0.9s', animationDelay: `${lastStart + i * 0.07}s`, animationFillMode: 'both' }}>{ch}</span>
                    ))}
                    <span className="hl" style={{ animationName: 'letterRise', animationDuration: '0.9s', animationDelay: `${dotDelay}s`, animationFillMode: 'both', color: isMobile ? '#f3efe9' : '#16120f' }}>.</span>
                  </>);
                })()}
              </h1>
              <div className="hero-subtitle">
                <div className="hero-subtitle-text">{heroData.subtitle}</div>
              </div>
              <p className="hero-desc">{heroData.description}</p>
              <div className="hero-actions">
                <button className="btn-pill btn-pill-primary" onClick={() => scrollTo('sec-work')}>View Projects</button>
                {heroData.resumeUrl
                  ? <a href={heroData.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-outline">Resume</a>
                  : <span className="btn-pill btn-pill-outline" style={{ opacity: 0.45, cursor: 'not-allowed' }}>Resume</span>}
                <button className="btn-pill btn-pill-outline" onClick={() => scrollTo('sec-contact')}>Contact</button>
                <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-outline">GitHub</a>
                <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-outline">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="hero-cue" ref={heroCueRef}>
            <span className="hero-cue-line" />
            <span className="hero-cue-text">SCROLL</span>
          </div>
        </div>
      </section>

      {/* ── 01 · ABOUT ── */}
      <section className="chapter about-section" data-name="ABOUT" id="sec-about">
        <div className="about-grid">
          <div className={`reveal${revealMap['about-text'] ? ' visible' : ''}`} data-reveal-key="about-text" style={{ transitionDelay: '0s' }}>
            <div className="section-label">03 — ABOUT</div>
            <h2 className="section-h2">{aboutData.heading}</h2>
            {aboutData.paragraphs.map((para, i) => (
              <p key={i} className="section-p">{para}</p>
            ))}
          </div>
          <div className="about-cards">
            {aboutData.cards.map((card, i) => (
              <div
                key={card.label || i}
                className={`about-card reveal${revealMap[`about-card-${i}`] ? ' visible' : ''}`}
                data-reveal-key={`about-card-${i}`}
                style={{ transitionDelay: `${0.05 + i * 0.07}s` }}
              >
                <div className="about-card-label">{card.label}</div>
                <div className="about-card-val">{card.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · APPROACH ── */}
      <section className="chapter approach-section" data-name="APPROACH" id="sec-approach">
        <div style={{ maxWidth: '1180px' }}>
          <div className="section-label">08 — APPROACH</div>
          <p id="manifesto" className="approach-manifesto">
            {manifestoText.split(' ').map((raw, i) => {
              const isAccent = raw.startsWith('*') && raw.endsWith('*') && raw.length > 2;
              const text = isAccent ? raw.slice(1, -1) : raw;
              return (
                <span key={i} className={`mword${isAccent ? ' accent' : ''}${wordsVisible ? ' visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>
                  {text}
                </span>
              );
            })}
          </p>
        </div>
      </section>

      {/* ── 03 · NUMBERS ── */}
      <section className="chapter numbers-section" data-name="NUMBERS" id="sec-numbers">
        <div className="section-label" style={{ color: 'var(--accent)' }}>07 — BY THE NUMBERS</div>
        <div className="numbers-grid">
          {numbersData.map((s, i) => (
            <div key={s.key} className={`stat-cell${i > 0 ? '' : ''}`}>
              <div className="stat-big">
                <CounterNum target={s.target} triggered={!!counterTriggers[s.key]} dataKey={s.key} />
                {s.suffix && <sup>{s.suffix}</sup>}
              </div>
              <div className="stat-label-small">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 · WORK ── */}
      <section className="chapter projects-pin" data-name="WORK" id="sec-work" ref={projPinRef}>
        <div className="projects-sticky">
          <div className="projects-label">01 — SELECTED WORK</div>
          <div className="work-hint">
            <div className="scroll-mouse"><span className="scroll-mouse-body"><span className="scroll-wheel" /></span></div>
            <span className="hint-text">Keep scrolling</span>
            <span className="hint-divider" />
            <span className="hint-arrow">cards move sideways <span className="arrow-anim">→</span></span>
          </div>
          <div className="projects-track" ref={projTrackRef}>
            <div className="track-intro">
              <div className="track-intro-heading">Five<br />flagship<br /><span>builds.</span></div>
              <p className="track-intro-p">Full-stack, mobile, blockchain and AI — each one designed, built and (in one case) deployed to real users. Scroll sideways →</p>
            </div>
            {projects.map(p => (
              <article key={p.id} className="project-card">
                <div className="project-img-wrap">
                  <img src={p.img} alt={p.alt} className="project-img" />
                  <span className="project-num">{p.num}</span>
                  {p.live && <span className="project-live-badge"><span className="project-live-dot" />LIVE</span>}
                </div>
                <div className="project-body">
                  <div className="project-stack">{p.stack}</div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.desc}</p>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">VIEW PROJECT →</a>
                </div>
              </article>
            ))}
            <div className="track-outro">
              <div className="track-outro-h">More on<br />GitHub</div>
              <a href={`https://github.com/${githubData.username}`} target="_blank" rel="noopener noreferrer" className="track-outro-a">@{githubData.username} →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · FEATURED ── */}
      <section className="chapter featured-section" data-name="FEATURED" id="sec-featured">
        <div className="featured-grid" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className={`reveal${revealMap['feat-text'] ? ' visible' : ''}`} data-reveal-key="feat-text">
            <div className="section-label" style={{ color: 'var(--accent)' }}>02 — FEATURED CASE STUDY</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(38px,4.6vw,72px)', lineHeight: 0.98, letterSpacing: '-0.02em', margin: '0 0 22px', color: '#1a1715' }}>
              {featuredData.title}
            </h2>
            <p className="section-p dark" style={{ maxWidth: '460px', margin: '0 0 26px' }}>
              {featuredData.description}
            </p>
            <div className="featured-tags">
              {(featuredData.tags || []).map(t => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
            </div>
          </div>
          <div className="featured-img-wrap">
            <img src={featuredData.img} alt={`${featuredData.title} screenshot`} className="featured-img" />
            <a href={featuredData.url} target="_blank" rel="noopener noreferrer" className="featured-visit">Visit {featuredData.url.replace(/^https?:\/\//, '')} →</a>
          </div>
        </div>
        <div className="featured-details" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          {(featuredData.details || []).map((d, i) => (
            <div key={i} className={`reveal${revealMap[`feat-${i}`] ? ' visible' : ''}`} data-reveal-key={`feat-${i}`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="featured-detail-label">{d.label}</div>
              <p className="featured-detail-p">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 · AI LAB ── */}
      <section className="chapter ailab-section" data-name="AI LAB" id="sec-ailab">
        <NebulaCanvas getMouse={getMouse} />
        <div className="ailab-inner">
          <div className="section-label">06 — AI LAB &nbsp;<span style={{ color: '#6f675f' }}>· move your cursor</span></div>

          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(34px,5vw,76px)', lineHeight: 0.98, letterSpacing: '-0.02em', margin: '0 0 14px', color: '#f3efe9', maxWidth: '18ch' }}>
            {ailabData.headingMain} <span style={{ color: 'var(--accent)' }}>{ailabData.headingAccent}</span>
          </h2>
          <p style={{ maxWidth: '540px', margin: '0 0 36px', color: '#9b938a', fontSize: '15px', lineHeight: 1.7 }}>
            {ailabData.subheading}
          </p>
          <ChatWidget context={ailabData.context} />
          <div className="ailab-links">
            {(githubData.pinnedRepos || []).slice(0, 3).map(r => (
              <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer" className="ailab-link">↗ {r.name}{r.live ? ' (live)' : ' on GitHub'}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 · STACK ── */}
      <section className="chapter stack-section" data-name="STACK" id="sec-stack">
        <div className="stack-label">05 — CAPABILITIES</div>
        <MarqueeRow words={marqueeRows.row1} direction="forward" />
        <MarqueeRow words={marqueeRows.row2} direction="reverse" />
        <div className="stack-chips-grid">
          {stackGroups.map((g, i) => (
            <div key={g.label} className={`reveal${revealMap[`stack-${i}`] ? ' visible' : ''}`} data-reveal-key={`stack-${i}`} style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className="stack-group-label">{g.label}</div>
              <div className="tech-chips">
                {g.chips.map(c => <span key={c} className="tech-chip">{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 08 · PATH ── */}
      <section className="chapter path-section" data-name="PATH" id="sec-path">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'var(--accent)' }}>04 — EXPERIENCE &amp; EDUCATION</div>
          <div className="path-list">
            {pathItems.map((item, i) => (
              <div key={i} className={`path-item reveal${revealMap[`path-${i}`] ? ' visible' : ''}`} data-reveal-key={`path-${i}`} style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="path-year">{item.year}</div>
                <div>
                  <h3 className="path-title">{item.title}</h3>
                  <div className="path-sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 · CERTS ── */}
      <section className="chapter certs-section" data-name="CERTS" id="sec-certs">
        <div className="certs-header">
          <div className="section-label" style={{ marginBottom: 0 }}>09 — CERTIFICATIONS</div>
          <div className="certs-count">{certs.length} verified credentials · LinkedIn · IBM · Google · AWS · Coursera</div>
        </div>
        <div className="certs-grid">
          {certs.map((c, i) => (
            <div key={c.id} className={`cert-card reveal${revealMap[`cert-${i}`] ? ' visible' : ''}`} data-reveal-key={`cert-${i}`} style={{ transitionDelay: `${i * 0.03}s` }}>
              <div className="cert-card-top">
                <div className="cert-issuer">{c.issuer}</div>
                <div className="cert-year">{c.year}</div>
              </div>
              <h3 className="cert-title">{c.title}</h3>
              <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-link">VIEW CREDENTIAL →</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10 · GITHUB ── */}
      <section className="chapter github-section" data-name="GITHUB" id="sec-github">
        <div className="github-header">
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>10 — OPEN SOURCE</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px,4vw,58px)', margin: 0, color: '#f3efe9' }}>Live from GitHub</h2>
          </div>
          <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-primary">@{githubData.username} →</a>
        </div>
        <div className={`github-chart-box reveal${revealMap['gh-chart'] ? ' visible' : ''}`} data-reveal-key="gh-chart">
          <div className="github-chart-label">CONTRIBUTION ACTIVITY · @{githubData.username}</div>
          <ContributionGrid />
        </div>
        <div className="github-stats-row">
          {/* Pinned repos */}
          <div className={`github-stat-box gh-repos-box reveal${revealMap['gh-stats'] ? ' visible' : ''}`} data-reveal-key="gh-stats" style={{ transitionDelay: '0.08s' }}>
            <div className="gh-box-title">PINNED REPOSITORIES</div>
            {(githubData.pinnedRepos || []).map(r => (
              <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer" className="gh-repo-row">
                <span className="gh-repo-icon">{r.live ? '◉' : '◈'}</span>
                <span className="gh-repo-text">
                  <span className="gh-repo-name">
                    {r.name}
                    {r.live && <span className="gh-live-tag">LIVE</span>}
                  </span>
                  <span className="gh-repo-desc">{r.desc}</span>
                </span>
                <span className="gh-repo-arrow">→</span>
              </a>
            ))}
          </div>
          {/* Language breakdown */}
          <div className={`github-stat-box gh-langs-box reveal${revealMap['gh-langs'] ? ' visible' : ''}`} data-reveal-key="gh-langs" style={{ transitionDelay: '0.16s' }}>
            <div className="gh-box-title">PRIMARY LANGUAGES</div>
            <div className="gh-lang-grid">
              {(githubData.languages || []).map(l => (
                <div key={l.lang} className="gh-lang-cell">
                  <div className="gh-lang-dot" style={{ background: l.color }} />
                  <div className="gh-lang-pct">{l.pct}<span>%</span></div>
                  <div className="gh-lang-name">{l.lang}</div>
                  <div className="gh-lang-sub">{l.sub}</div>
                </div>
              ))}
            </div>
            <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="gh-view-all">View all on GitHub →</a>
          </div>
        </div>
      </section>

      {/* ── 11 · CONTACT ── */}
      <section className="chapter contact-section" data-name="CONTACT" id="sec-contact">
        <div className="section-label">11 — AVAILABILITY &amp; CONTACT</div>
        <h2 className={`contact-heading reveal${revealMap['contact-h'] ? ' visible' : ''}`} data-reveal-key="contact-h">
          Let&apos;s build something <span>that ships.</span>
        </h2>
        <div className="availability-chips">
          {(contactData.roles || []).map(r => (
            <span key={r} className="avail-chip">{r}</span>
          ))}
        </div>

        {/* Contact details card */}
        {(() => {
          const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactData.email)}&su=Portfolio%20Inquiry`;
          const telUrl = `tel:${(contactData.phone || '').replace(/[\s-]/g, '')}`;
          const ghHandle = (contactData.github || '').split('/').pop();
          return (
            <>
              <div className={`contact-card reveal${revealMap['contact-card'] ? ' visible' : ''}`} data-reveal-key="contact-card">
                <div className="contact-card-row">
                  <span className="contact-card-label">EMAIL</span>
                  <a href={emailUrl} target="_blank" rel="noopener noreferrer" className="contact-card-val link">{contactData.email}</a>
                </div>
                <div className="contact-card-divider" />
                <div className="contact-card-row">
                  <span className="contact-card-label">PHONE</span>
                  <a href={telUrl} className="contact-card-val link">{contactData.phone}</a>
                </div>
                <div className="contact-card-divider" />
                <div className="contact-card-row">
                  <span className="contact-card-label">LOCATION</span>
                  <span className="contact-card-val">{contactData.location}</span>
                </div>
                <div className="contact-card-divider" />
                <div className="contact-card-row">
                  <span className="contact-card-label">GITHUB</span>
                  <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="contact-card-val link">@{ghHandle}</a>
                </div>
                <div className="contact-card-divider" />
                <div className="contact-card-row">
                  <span className="contact-card-label">LINKEDIN</span>
                  <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card-val link">{heroData.name}</a>
                </div>
              </div>

              <div className="contact-actions">
                <a href={emailUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-primary">Email me →</a>
                <a href={telUrl} className="btn-pill btn-pill-outline-light">Call</a>
                {heroData.resumeUrl
                  ? <a href={heroData.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-outline-light">Resume</a>
                  : <span className="btn-pill btn-pill-outline-light" style={{ opacity: 0.45, cursor: 'not-allowed' }}>Resume</span>}
                <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-outline-light">GitHub</a>
                <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-outline-light">LinkedIn</a>
              </div>
              <div className="contact-footer">
                <div className="contact-footer-info">
                  {heroData.name} · FULL-STACK &amp; AI DEVELOPER<br />
                  <span>{contactData.location} · {contactData.phone} · {contactData.email}</span>
                </div>
                <div className="contact-footer-copy">© 2026 — All rights reserved</div>
              </div>
            </>
          );
        })()}
      </section>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function CounterNum({ target, triggered, dataKey }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const dur = 1500, start = performance.now();
    let rafId;
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * ease));
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [triggered, target]);
  return <span data-counter-key={dataKey}>{val}</span>;
}

function MarqueeRow({ words, direction }) {
  const doubled = [...words, ...words];
  return (
    <div className="marquee-row" style={{ marginTop: direction === 'reverse' ? '0.1em' : 0 }}>
      <div className={`marquee-track ${direction}`}>
        {doubled.map((w, i) => {
          const styles = ['filled', 'outline-accent', 'filled', 'outline-dim', 'accent', 'outline-dim'];
          return (
            <span key={i} className={`marquee-word ${styles[i % styles.length]}`}>{w}</span>
          );
        })}
      </div>
    </div>
  );
}

/* seeded deterministic "random" so SSR and client match */
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function ContributionGrid() {
  const WEEKS = 52, DAYS = 7;
  const rand = seededRand(0xdeadbeef);
  const levels = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => {
      const r = rand();
      // recent weeks denser
      const recency = w / WEEKS;
      if (r > 0.62 - recency * 0.22) return 0;
      if (r > 0.45 - recency * 0.15) return 1;
      if (r > 0.28 - recency * 0.1)  return 2;
      if (r > 0.14)                   return 3;
      return 4;
    })
  );

  const colors = ['#1c1917', '#4a1a0a', '#8b3012', '#d4471a', '#FF5722'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="contrib-wrap">
      <div className="contrib-months">
        {months.map((m, i) => (
          <span key={m} className="contrib-month" style={{ left: `${(i / 12) * 100}%` }}>{m}</span>
        ))}
      </div>
      <div className="contrib-grid">
        {levels.map((week, wi) => (
          <div key={wi} className="contrib-col">
            {week.map((lvl, di) => (
              <div
                key={di}
                className="contrib-cell"
                style={{ background: colors[lvl] }}
                title={`Level ${lvl}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="contrib-legend">
        <span className="contrib-legend-label">Less</span>
        {colors.map((c, i) => <span key={i} className="contrib-cell" style={{ background: c }} />)}
        <span className="contrib-legend-label">More</span>
      </div>
    </div>
  );
}


const CHAT_FALLBACK = "Live chat runs on the deployed site. Meanwhile: Mishal is a full-stack developer (Flutter, Next.js, Firebase, blockchain & AI). His live project is veycho.in. Reach him at mishal444583@gmail.com or GitHub @mishal4583.";

function ChatWidget({ context }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi — I'm Mishal's portfolio assistant. Ask me what he builds, his tech stack, or about a specific project." }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  const ask = async (text) => {
    if (busy || !text.trim()) return;
    setBusy(true);
    setInput('');
    const history = messages.filter(m => !m.typing);
    setMessages(prev => [...prev, { role: 'user', text }, { role: 'bot', text: '…', typing: true }]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', text }], context }),
      });
      const json = await res.json();
      const reply = json.reply;
      if (!reply) throw new Error(json.error || 'no reply');
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: reply } : m));
    } catch {
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { role: 'bot', text: CHAT_FALLBACK } : m));
    }
    setBusy(false);
  };

  const onFocusForm = (e) => {
    if (e.currentTarget) e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--accent), 0 0 22px -6px var(--accent)';
  };
  const onBlurForm = (e) => {
    if (e.currentTarget) e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="chat-box">
      <div className="chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble${m.role === 'user' ? ' user' : ''}`}
            style={m.typing ? { animation: 'blink 1.1s ease-in-out infinite' } : {}}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chat-chips">
        {["What does Mishal build?", "Tell me about UniTrack", "What's his tech stack?", "Is he open to hiring?"].map(q => (
          <button key={q} className="chip" onClick={() => ask(q)}>{q}</button>
        ))}
      </div>
      <form
        className="chat-form"
        style={{ transition: 'box-shadow .3s ease' }}
        onFocus={onFocusForm}
        onBlur={onBlurForm}
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
      >
        <input
          className="chat-input"
          type="text"
          placeholder="Ask about Mishal…"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="chat-send" type="submit">ASK</button>
      </form>
    </div>
  );
}
