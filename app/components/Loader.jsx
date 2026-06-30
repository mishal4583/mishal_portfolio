'use client';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState('INITIALIZING');
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const STEPS = [[0, 'INITIALIZING'], [0.3, 'LOADING ASSETS'], [0.62, 'RENDERING SCENE'], [0.9, 'ALMOST READY'], [1, 'WELCOME']];
    const t0 = performance.now();
    const DURATION = 2600;
    let rafId;

    const dismiss = () => {
      setFading(true);
      setTimeout(() => setGone(true), 900);
    };

    const tick = (now) => {
      const elapsed = now - t0;
      const linear = Math.min(elapsed / DURATION, 1);
      // ease-out cubic so it feels organic
      const ease = 1 - Math.pow(1 - linear, 3);
      const p = Math.round(ease * 100);
      setPct(p);
      let s = STEPS[0][1];
      for (const [th, lbl] of STEPS) if (ease >= th) s = lbl;
      setStatus(s);
      if (p >= 100) { dismiss(); return; }
      rafId = requestAnimationFrame(tick);
    };

    // short delay so first paint is visible
    const startId = setTimeout(() => { rafId = requestAnimationFrame(tick); }, 120);
    // hard safety at 5 s
    const safetyId = setTimeout(dismiss, 5000);

    return () => {
      clearTimeout(startId);
      clearTimeout(safetyId);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="loader" style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}>
      <div className="loader-eyebrow">FULL-STACK&nbsp;·&nbsp;AI &nbsp;·&nbsp; PORTFOLIO</div>
      <div className="loader-spinner">
        <span className="loader-ring-outer" />
        <span className="loader-ring-inner" />
        <span className="loader-dot" />
      </div>
      <div className="loader-name">MISHAL&nbsp;KS</div>
      <div className="loader-bar-wrap">
        <div className="loader-track">
          <div className="loader-bar" style={{ width: pct + '%' }} />
        </div>
        <div className="loader-labels">
          <span>{status}</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
