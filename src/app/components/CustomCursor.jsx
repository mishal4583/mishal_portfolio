'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Disable on touch / pointer:coarse devices
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    let mX = window.innerWidth / 2, mY = window.innerHeight / 2;
    let rX = mX, rY = mY;
    let rafId;

    /* ── Trail particles ─────────────────────────────────── */
    const N = 14;
    const trailPos = Array.from({ length: N }, () => ({ x: mX, y: mY }));
    const trailEls = trailPos.map((_, i) => {
      const el = document.createElement('div');
      const size = Math.max(1.5, 9 - i * 0.55);
      const alpha = (0.68 - i * 0.045).toFixed(2);
      el.style.cssText = [
        'position:fixed', 'border-radius:50%', 'pointer-events:none',
        `z-index:9997`, `background:rgba(255,87,34,${alpha})`,
        `width:${size}px`, `height:${size}px`,
        'transform:translate(-50%,-50%)', 'will-change:transform',
      ].join(';');
      document.body.appendChild(el);
      return el;
    });

    /* ── Mouse track ─────────────────────────────────────── */
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      mX = e.clientX; mY = e.clientY;
      dot.style.transform = `translate(${mX}px,${mY}px) translate(-50%,-50%)`;
    };

    const tick = () => {
      // Ring follows with spring
      rX = lerp(rX, mX, 0.1); rY = lerp(rY, mY, 0.1);
      ring.style.transform = `translate(${rX}px,${rY}px) translate(-50%,-50%)`;

      // Chain trail
      trailPos[0].x = lerp(trailPos[0].x, mX, 0.26);
      trailPos[0].y = lerp(trailPos[0].y, mY, 0.26);
      trailEls[0].style.transform = `translate(${trailPos[0].x}px,${trailPos[0].y}px) translate(-50%,-50%)`;
      for (let i = 1; i < N; i++) {
        const t = Math.max(0.04, 0.26 - i * 0.018);
        trailPos[i].x = lerp(trailPos[i].x, trailPos[i - 1].x, t);
        trailPos[i].y = lerp(trailPos[i].y, trailPos[i - 1].y, t);
        trailEls[i].style.transform = `translate(${trailPos[i].x}px,${trailPos[i].y}px) translate(-50%,-50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    tick();

    /* ── Hover morphing ──────────────────────────────────── */
    const SELECTORS = 'a,button,[role="button"],input,textarea,select,.filter-btn,.project-item,.service-item,.certificate-item,.internship-item,.stat-item,label';
    const enter = () => { dot.classList.add('cursor-dot--hover'); ring.classList.add('cursor-ring--hover'); };
    const leave = () => { dot.classList.remove('cursor-dot--hover'); ring.classList.remove('cursor-ring--hover'); };

    const bindHover = () => {
      document.querySelectorAll(SELECTORS).forEach(el => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
    };
    bindHover();
    const rebindTimer = setTimeout(bindHover, 2200);

    /* ── Click squeeze ───────────────────────────────────── */
    const onClick = () => {
      ring.classList.add('cursor-ring--click');
      setTimeout(() => ring.classList.remove('cursor-ring--click'), 280);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      cancelAnimationFrame(rafId);
      clearTimeout(rebindTimer);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      trailEls.forEach(el => el.remove());
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
