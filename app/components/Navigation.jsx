'use client';

const SECTIONS = [
  { id: 'sec-hero',     name: 'INTRO' },
  { id: 'sec-about',    name: 'ABOUT' },
  { id: 'sec-approach', name: 'APPROACH' },
  { id: 'sec-numbers',  name: 'NUMBERS' },
  { id: 'sec-work',     name: 'WORK' },
  { id: 'sec-featured', name: 'FEATURED' },
  { id: 'sec-ailab',    name: 'AI LAB' },
  { id: 'sec-stack',    name: 'STACK' },
  { id: 'sec-path',     name: 'PATH' },
  { id: 'sec-certs',    name: 'CERTS' },
  { id: 'sec-github',   name: 'GITHUB' },
  { id: 'sec-contact',  name: 'CONTACT' },
];

export default function Navigation({ active, onNavClick, showToTop, onToTop, chapNum, chapName, isLight }) {
  return (
    <>
      {/* Logo mark */}
      <div className="logo-mark">
        <div className="logo-circle">M</div>
        <div className="logo-text">
          MISHAL&nbsp;KS<br />
          <span>FULL-STACK&nbsp;·&nbsp;AI</span>
        </div>
      </div>

      {/* Chapter display */}
      <div className={`chapter-display${isLight ? ' chapter-display--light' : ''}`}>
        <div className="chap-num">{String(chapNum).padStart(2, '0')}</div>
        <div className="chap-name-wrap">— <span>{chapName}</span></div>
      </div>

      {/* Rail navigation */}
      <nav className={`rail${isLight ? ' rail--light' : ''}`} aria-label="Section navigation">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`rail-dot${active === i ? ' active' : ''}`}
            onClick={() => onNavClick(s.id)}
            aria-label={`Go to ${s.name}`}
          >
            <span className="rl">{s.name}</span>
            <span className="rd" />
          </button>
        ))}
      </nav>

      {/* Back to top */}
      <button
        className={`to-top${showToTop ? ' visible' : ''}`}
        onClick={onToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}

export { SECTIONS };
