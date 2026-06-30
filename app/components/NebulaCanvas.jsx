'use client';
import { useEffect, useRef } from 'react';

export default function NebulaCanvas({ getMouse }) {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sec = sectionRef.current;
    if (!canvas || !sec) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, parts, visible = false, rect;
    let rafId;

    const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF5722';

    const syncRect = () => { rect = canvas.getBoundingClientRect(); };
    const resize = () => {
      rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.width = Math.max(1, rect.width) * dpr;
      h = canvas.height = Math.max(1, rect.height) * dpr;
      const n = Math.min(54, Math.floor(rect.width / 26));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        hx: Math.random() * w, hy: Math.random() * h,
        vx: 0, vy: 0,
      }));
    };
    resize();

    const obs = new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; }), { threshold: 0.05 });
    obs.observe(sec);

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', syncRect, { passive: true });

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (!visible || document.hidden || !parts) return;
      ctx.clearRect(0, 0, w, h);
      const ac = accent();
      const m = getMouse ? getMouse() : { mx: -999, my: -999 };
      const mxL = (m.mx - (rect?.left || 0)) * dpr;
      const myL = (m.my - (rect?.top || 0)) * dpr;
      const inside = rect && m.mx >= rect.left && m.mx <= rect.right && m.my >= rect.top && m.my <= rect.bottom;
      const R = 300 * dpr;

      for (const p of parts) {
        p.vx += (p.hx - p.x) * 0.0009;
        p.vy += (p.hy - p.y) * 0.0009;
        if (inside) {
          const dx = mxL - p.x, dy = myL - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < R) {
            const f = 1 - dist / R;
            const swirl = 0.35;
            p.vx += (dx / dist) * f * 1.4 + (-dy / dist) * f * swirl;
            p.vy += (dy / dist) * f * 1.4 + (dx / dist) * f * swirl;
          }
        }
        p.vx *= 0.86; p.vy *= 0.86;
        p.x += p.vx; p.y += p.vy;
      }

      const LINK = 130 * dpr;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = ac;
            ctx.globalAlpha = (1 - d / LINK) * 0.22;
            ctx.lineWidth = dpr;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = ac;
      for (const p of parts) {
        const near = inside ? Math.max(0, 1 - Math.hypot(mxL - p.x, myL - p.y) / R) : 0;
        ctx.globalAlpha = 0.6 + near * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (1.6 + near * 2.2) * dpr, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', syncRect);
      obs.disconnect();
    };
  }, [getMouse]);

  return (
    <div ref={sectionRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <canvas ref={canvasRef} className="nebula-canvas" />
    </div>
  );
}
