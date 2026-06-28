'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import defaultData from '../data/portfolio.json';
import CustomCursor from './components/CustomCursor';

const SplineBackground = dynamic(() => import('./components/SplineBackground'), { ssr: false });

function SafeImage({ src, alt, width, height, className, style, priority }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className={`img-placeholder ${className || ''}`} style={{ width, height, ...style }}>
        <span>🖼️</span>
        <span style={{ fontSize: '0.75rem', padding: '0 8px' }}>{alt}</span>
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} width={width} height={height}
      className={className} style={style} priority={priority}
      onError={() => setErr(true)} />
  );
}

function ProfileAvatar({ name, src, style }) {
  const [err, setErr] = useState(false);
  const initials = (name || 'YN').split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
  if (err || !src) {
    return (
      <div className="profile-avatar-fallback" style={style} aria-label={name}>
        {initials}
      </div>
    );
  }
  return (
    <Image src={src} alt={`${name} Profile Picture`} className="profile-picture"
      width={180} height={180} priority style={style}
      onError={() => setErr(true)} />
  );
}

const NAV_ITEMS = [
  { id: 'about',        label: 'About' },
  { id: 'education',    label: 'Education' },
  { id: 'projects',     label: 'Projects' },
  { id: 'internships',  label: 'Internships' },
  { id: 'skills',       label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact',      label: 'Contact' },
];

const SIDE_NAV = [
  { id: 'hero',         label: 'Home' },
  { id: 'about',        label: 'About' },
  { id: 'education',    label: 'Education' },
  { id: 'projects',     label: 'Projects' },
  { id: 'internships',  label: 'Internships' },
  { id: 'skills',       label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact',      label: 'Contact' },
];

export default function Home() {
  const [data, setData]               = useState(defaultData);
  const [isNavOpen, setIsNavOpen]     = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage]   = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop]   = useState(false);
  const [activeSection, setActiveSection]   = useState('hero');
  const [formStatus, setFormStatus]         = useState('idle');

  /* ── 1. Fetch data ───────────────────────────────────────────── */
  useEffect(() => {
    fetch('/api/portfolio').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  /* ── 2. Scroll progress + back-to-top ───────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── 3. Scroll links + filter + IntersectionObserver ────────── */
  useEffect(() => {
    // Hero section is always immediately visible
    const hero = document.getElementById('hero');
    if (hero && !hero.classList.contains('in-view')) hero.classList.add('in-view');

    // Smooth scroll
    const scrollLinks = document.querySelectorAll('.scroll-link, .nav-link');
    const handleScrollClick = function (e) {
      e.preventDefault();
      const id = this.getAttribute('href')?.substring(1);
      const el = document.getElementById(id || '');
      if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    };
    scrollLinks.forEach(l => l.addEventListener('click', handleScrollClick));

    // Project filter
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const filterProjects = filter => {
      projectItems.forEach(item => {
        const matches = filter === 'all' || item.dataset.category?.includes(filter);
        if (matches) {
          item.style.display = 'flex';
          setTimeout(() => item.classList.remove('hidden'), 10);
        } else {
          item.classList.add('hidden');
          item.addEventListener('transitionend', function h() {
            if (item.classList.contains('hidden')) item.style.display = 'none';
            item.removeEventListener('transitionend', h);
          }, { once: true });
        }
      });
    };
    const handleFilter = function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterProjects(this.dataset.filter || 'all');
    };
    filterBtns.forEach(b => b.addEventListener('click', handleFilter));
    filterProjects('all');

    // JS stagger helper (for project cards only – avoids filter conflict)
    const staggerIn = (parent, selector, baseDelay, step) => {
      const items = [...parent.querySelectorAll(selector)];
      items.forEach((item, i) => {
        const delay = baseDelay + i * step;
        item.style.opacity = '0';
        item.style.transform = 'translateY(48px)';
        item.style.transition = 'none';
        // double rAF ensures transition:none is painted before re-enabling
        requestAnimationFrame(() => requestAnimationFrame(() => {
          item.style.transition = `opacity 0.75s ${delay}ms cubic-bezier(.23,1,.32,1), transform 0.75s ${delay}ms cubic-bezier(.23,1,.32,1)`;
          item.style.opacity = '1';
          item.style.transform = 'none';
          // clear inline styles after animation so filter system works normally
          setTimeout(() => {
            item.style.opacity = '';
            item.style.transform = '';
            item.style.transition = '';
          }, delay + 900);
        }));
      });
    };

    // IntersectionObserver: section fade + active nav + skill bars + stagger
    const sections    = document.querySelectorAll('.portfolio-section');
    const skillLevels = document.querySelectorAll('.skill-level');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          setActiveSection(entry.target.id);

          if (!entry.target.dataset.entered) {
            entry.target.dataset.entered = 'true';

            if (entry.target.id === 'projects') {
              staggerIn(entry.target, '.project-item:not(.hidden)', 80, 115);
            }
            if (entry.target.id === 'skills') {
              skillLevels.forEach(bar => {
                const w = bar.style.width;
                bar.style.width = '0';
                void bar.offsetWidth;
                bar.style.width = w;
              });
            }
          }
        }
      });
    }, { root: null, rootMargin: '-18% 0px -18% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));

    return () => {
      scrollLinks.forEach(l => l.removeEventListener('click', handleScrollClick));
      filterBtns.forEach(b => b.removeEventListener('click', handleFilter));
      sections.forEach(s => observer.unobserve(s));
    };
  }, [data]);

  /* ── 4. Micro-interactions (magnetic, 3D tilt, ripple) ──────── */
  useEffect(() => {
    const cleanups = [];

    /* Magnetic buttons */
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transition = 'transform 0.12s ease';
        btn.style.transform  = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      };
      const onLeave = () => {
        btn.style.transition = 'transform 0.65s cubic-bezier(.23,1,.32,1), background-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, border-color 0.25s ease';
        btn.style.transform  = 'translate(0,0)';
      };
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave); });
    });

    /* 3D card tilt */
    document.querySelectorAll('.project-item').forEach(card => {
      if (!card.querySelector('.card-glare')) {
        const g = document.createElement('div');
        g.className = 'card-glare';
        card.appendChild(g);
      }

      const onMove = (e) => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left) / r.width;
        const y  = (e.clientY - r.top)  / r.height;
        const rX = (y - 0.5) * -16;
        const rY = (x - 0.5) *  22;
        card.style.transform  = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.03,1.03,1.03)`;
        card.style.transition = 'transform 0.05s ease, box-shadow 0.05s ease';
        card.style.boxShadow  = `${-rY * 1.1}px ${rX * 0.7}px 40px rgba(255,87,34,0.18), 0 18px 55px rgba(0,0,0,0.08)`;
        const gl = card.querySelector('.card-glare');
        if (gl) { gl.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.34) 0%, transparent 65%)`; gl.style.opacity = '1'; }
      };
      const onLeave = () => {
        card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        card.style.transition = 'transform 0.65s ease, box-shadow 0.65s ease';
        card.style.boxShadow  = '';
        const gl = card.querySelector('.card-glare');
        if (gl) gl.style.opacity = '0';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); });
    });

    /* Ripple on click */
    document.querySelectorAll('.btn, .filter-btn, .nav-toggle, .view-internship-btn, .back-to-top').forEach(btn => {
      const onClick = (e) => {
        const r      = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className  = 'ripple-fx';
        ripple.style.left = (e.clientX - r.left) + 'px';
        ripple.style.top  = (e.clientY - r.top)  + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 720);
      };
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', onClick);
      cleanups.push(() => btn.removeEventListener('click', onClick));
    });

    return () => cleanups.forEach(fn => fn());
  }, [data]);

  /* ── Helpers ────────────────────────────────────────────────── */
  const openModal  = src => { setModalImage(src); setIsModalOpen(true); };
  const closeModal = ()  => { setIsModalOpen(false); setModalImage(''); };
  const toggleNav  = ()  => setIsNavOpen(p => !p);
  const handleNavLinkClick = () => setIsNavOpen(false);

  const handleFormSubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent('[Portfolio] ' + fd.get('subject'))}&body=${encodeURIComponent('Name: ' + fd.get('name') + '\nEmail: ' + fd.get('email') + '\n\n' + fd.get('message'))}`;
    window.open(mailtoUrl, '_blank');
    setFormStatus('sent');
    e.target.reset();
    setTimeout(() => setFormStatus('idle'), 6000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToSection = id => {
    if (id === 'hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const { hero, about, projects, filterCategories, internships, skills,
          certificates, contact, languages, footer, education } = data;

  return (
    <>
      <CustomCursor />

      {/* Scroll progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <Suspense fallback={<div>Loading 3D background...</div>}>
        <SplineBackground />
      </Suspense>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className={`main-header ${isNavOpen ? 'nav-open' : ''}`}
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}>
        <nav className="main-nav">
          <h1 className="logo">
            <a href="#hero" className="nav-link" onClick={handleNavLinkClick}>{hero.name}</a>
          </h1>
          <ul className={isNavOpen ? 'active' : ''}>
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <a href={`#${item.id}`}
                  className={`nav-link${activeSection === item.id ? ' active-nav-link' : ''}`}
                  onClick={handleNavLinkClick}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button className="nav-toggle" aria-label="Toggle navigation" onClick={toggleNav}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </nav>
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="main-content" style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>

        {/* Hero */}
        <section id="hero" className="portfolio-section">
          {/* Ambient orbs */}
          <div className="hero-orbs" aria-hidden="true">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>
          <div className="hero-content">
            <p className="greeting" style={{ pointerEvents: 'auto' }}>{hero.greeting}</p>
            <h2 className="name"    style={{ pointerEvents: 'auto' }}>{hero.name}</h2>
            <h3 className="tagline" style={{ pointerEvents: 'auto' }}>{hero.tagline}</h3>
            <p className="description" style={{ pointerEvents: 'auto' }}>{hero.description}</p>
            <div className="hero-actions">
              <a href={hero.ctaPrimary.href}
                className="btn primary-btn scroll-link magnetic-btn"
                style={{ pointerEvents: 'auto' }}>{hero.ctaPrimary.text}</a>
              <a href={hero.ctaSecondary.href}
                className="btn secondary-btn scroll-link magnetic-btn"
                style={{ pointerEvents: 'auto' }}>{hero.ctaSecondary.text}</a>
              {hero.resumeLink && (
                <a href={hero.resumeLink} target="_blank" rel="noopener noreferrer"
                  className="btn resume-btn magnetic-btn" style={{ pointerEvents: 'auto' }}>
                  📄 Resume
                </a>
              )}
            </div>
            {hero.stats && hero.stats.length > 0 && (
              <div className="stats-row" style={{ pointerEvents: 'auto' }}>
                {hero.stats.map(stat => (
                  <div key={stat.id} className="stat-item">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About */}
        <section id="about" className="portfolio-section">
          <div className="section-header">
            <h2 style={{ pointerEvents: 'auto' }}>About Me</h2>
            <p style={{ pointerEvents: 'auto' }}>A brief introduction to who I am and what I do.</p>
          </div>
          <div className="about-content">
            <div className="profile-summary">
              <ProfileAvatar name={hero.name} src={about.profileImage} style={{ pointerEvents: 'auto' }} />
              {about.bio.map((para, i) => (
                <p key={i} style={{ pointerEvents: 'auto' }}>{para}</p>
              ))}
            </div>
            <div className="what-i-do">
              <h3 style={{ pointerEvents: 'auto' }}>What I Do</h3>
              <div className="services-grid">
                {about.services.map(svc => (
                  <div key={svc.id} className="service-item" style={{ pointerEvents: 'auto' }}>
                    <i className={`${svc.icon} service-icon`}></i>
                    <h4>{svc.title}</h4>
                    <p>{svc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education */}
        {education && education.length > 0 && (
          <section id="education" className="portfolio-section">
            <div className="section-header">
              <h2 style={{ pointerEvents: 'auto' }}>Education</h2>
              <p style={{ pointerEvents: 'auto' }}>My academic background and qualifications.</p>
            </div>
            <div className="education-timeline">
              {education.map((item, i) => (
                <div key={item.id} className={`timeline-item${i % 2 === 1 ? ' right' : ''}`}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <h3>{item.degree}</h3>
                    <p className="timeline-institution">{item.institution}</p>
                    <p className="timeline-year">{item.year}</p>
                    {item.description && <p className="timeline-desc">{item.description}</p>}
                    {item.grade && <span className="timeline-grade">{item.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        <section id="projects" className="portfolio-section">
          <div className="section-header">
            <h2 style={{ pointerEvents: 'auto' }}>My Projects</h2>
            <p style={{ pointerEvents: 'auto' }}>Showcasing my work in Generative AI, Full-stack, and Computer Vision.</p>
          </div>
          <div className="project-filters" style={{ pointerEvents: 'auto' }}>
            <button className="filter-btn active" data-filter="all">All</button>
            {filterCategories.map(cat => (
              <button key={cat.value} className="filter-btn" data-filter={cat.value}>{cat.label}</button>
            ))}
          </div>
          <div className="projects-grid">
            {projects.map(proj => (
              <div key={proj.id} className="project-item" data-category={proj.category} style={{ pointerEvents: 'auto' }}>
                <SafeImage src={proj.image} alt={proj.title} width={400} height={250} />
                <div className="project-info">
                  <h3>{proj.title}</h3>
                  <p className="project-tags">{proj.tags}</p>
                  <p className="project-description">{proj.description}</p>
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="btn view-project-btn">View Project</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Internships */}
        <section id="internships" className="portfolio-section">
          <div className="section-header">
            <h2 style={{ pointerEvents: 'auto' }}>My Internships</h2>
            <p style={{ pointerEvents: 'auto' }}>Real-world experience in AI and technology.</p>
          </div>
          <div className="internship-grid">
            {internships.map(item => (
              <div key={item.id} className="internship-item" style={{ pointerEvents: 'auto' }}>
                <SafeImage src={item.image} alt={`${item.company} – ${item.title}`}
                  width={400} height={250} className="internship-image" />
                <div className="internship-info">
                  <h3>{item.title}</h3>
                  {item.company && <p className="company">{item.company}</p>}
                  <button className="view-internship-btn" onClick={() => openModal(item.image)}>
                    View Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="portfolio-section">
          <div className="section-header">
            <h2 style={{ pointerEvents: 'auto' }}>Technical Skills</h2>
            <p style={{ pointerEvents: 'auto' }}>My expertise across programming, AI/ML, and frameworks.</p>
          </div>
          <div className="skills-content">
            {skills.categories.map(cat => (
              <div key={cat.id} className="skill-category">
                <h3 style={{ pointerEvents: 'auto' }}>{cat.name}</h3>
                <div className="skill-list">
                  {cat.skills.map(sk => (
                    <div key={sk.id} className="skill-item" style={{ pointerEvents: 'auto' }}>
                      <span>{sk.name}</span>
                      <div className="skill-bar">
                        <div className="skill-level" style={{ width: `${sk.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="languages-section" style={{ pointerEvents: 'auto' }}>
            <h3 style={{ pointerEvents: 'auto' }}>Languages</h3>
            <p style={{ pointerEvents: 'auto' }}>{languages.fluent}</p>
            <p style={{ pointerEvents: 'auto' }}>{languages.comprehension}</p>
          </div>
        </section>

        {/* Certificates */}
        <section id="certificates" className="portfolio-section">
          <div className="section-header">
            <h2 style={{ pointerEvents: 'auto' }}>My Certificates</h2>
            <p style={{ pointerEvents: 'auto' }}>Professional certifications and achievements.</p>
          </div>
          <div className="certificates-grid">
            {certificates.map(cert => (
              <div key={cert.id} className="certificate-item" style={{ pointerEvents: 'auto' }}>
                <SafeImage src={cert.image} alt={cert.title} width={400} height={250} className="certificate-image" />
                <div className="certificate-info">
                  <h3>{cert.title}</h3>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="btn view-certificate-btn">
                    View Certificate
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="portfolio-section">
          <div className="section-header">
            <h2 style={{ pointerEvents: 'auto' }}>Get in Touch</h2>
            <p style={{ pointerEvents: 'auto' }}>Have a project in mind or just want to say hello? Drop me a message!</p>
          </div>
          <div className="contact-content">
            <div className="contact-form-container">
              <form id="contact-form" className="contact-form" style={{ pointerEvents: 'auto' }} onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" name="name" required placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input type="email" id="email" name="email" required placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required placeholder="Inquiry" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={6} required placeholder="Hello, I'd like to discuss..."></textarea>
                </div>
                <button type="submit" className="btn primary-btn submit-btn">Send Message</button>
                {formStatus === 'sent' && (
                  <div className="form-success">
                    ✓ Your email client has opened — send the message and I&apos;ll reply soon!
                  </div>
                )}
              </form>
            </div>
            <div className="contact-details">
              <h3 style={{ pointerEvents: 'auto' }}>Contact Information</h3>
              <p style={{ pointerEvents: 'auto' }}>
                <i className="fas fa-envelope"></i> Email:{' '}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <p style={{ pointerEvents: 'auto' }}>
                <i className="fas fa-map-marker-alt"></i> Location: {contact.location}
              </p>
              <div className="social-links">
                {contact.github && (
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ pointerEvents: 'auto' }}>
                    <i className="fab fa-github"></i>
                  </a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ pointerEvents: 'auto' }}>
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                )}
                {contact.twitter && (
                  <a href={contact.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" style={{ pointerEvents: 'auto' }}>
                    <i className="fab fa-twitter"></i>
                  </a>
                )}
              </div>
              <div className="map-container" style={{ pointerEvents: 'auto' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0051119790514!2d77.5925407!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1676f4142f9b%3A0x6a0f3b4e1a0b3f8!2sBengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin"
                  width="100%" height="250" style={{ border: 0 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="main-footer" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}>
        <p className="footer-cta">
          Open to opportunities — <a href={`mailto:${contact.email}`}>let&apos;s talk</a>
        </p>
        <p>© {footer.year} {footer.name}. All rights reserved.</p>
        <div className="footer-social-links">
          {contact.github && (
            <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          )}
          {contact.twitter && (
            <a href={contact.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          )}
        </div>
      </footer>

      {/* ── Certificate modal ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}
          style={{ pointerEvents: 'auto', zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✕</button>
            {modalImage ? (
              <Image src={modalImage} alt="Certificate" className="modal-image"
                width={900} height={650}
                style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }} />
            ) : (
              <div style={{ color: '#fff', padding: 40 }}>No image available.</div>
            )}
          </div>
        </div>
      )}

      {/* ── Side navigation dots ─────────────────────────────────── */}
      <nav className="side-nav" aria-label="Section navigation" style={{ pointerEvents: 'auto' }}>
        {SIDE_NAV.map(item => (
          <button
            key={item.id}
            className={`side-nav-dot${activeSection === item.id ? ' active' : ''}`}
            data-label={item.label}
            onClick={() => scrollToSection(item.id)}
            aria-label={`Go to ${item.label}`}
          />
        ))}
      </nav>

      {/* ── Back to top ──────────────────────────────────────────── */}
      <button className={`back-to-top${showBackToTop ? ' visible' : ''}`}
        onClick={scrollToTop} aria-label="Back to top">
        ↑
      </button>
    </>
  );
}
