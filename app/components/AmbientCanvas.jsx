'use client';
import { useEffect, useRef } from 'react';

export default function AmbientCanvas({ heroRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, parts;
    let rafId, active = false;

    const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF5722';

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      const n = Math.min(60, Math.floor(innerWidth / 30));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: (Math.random() * 2 + 0.9) * dpr,
        vx: (Math.random() - 0.5) * 0.14 * dpr,
        vy: (Math.random() - 0.5) * 0.14 * dpr,
        a: Math.random() * 0.5 + 0.35,
        t: Math.random() * 6,
        accent: Math.random() < 0.5,
      }));
    };

    resize();
    canvas.style.transition = 'opacity .6s ease';
    canvas.style.opacity = '0';

    // observe hero — pause canvas while hero is visible (Spline already runs)
    let obs;
    const hero = heroRef?.current;
    if (hero) {
      obs = new IntersectionObserver((es) => {
        es.forEach((e) => {
          active = !e.isIntersecting;
          canvas.style.opacity = active ? '1' : '0';
        });
      }, { threshold: 0.04 });
      obs.observe(hero);
    } else {
      active = true;
      canvas.style.opacity = '1';
    }

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (document.hidden || !active || !parts) return;
      ctx.clearRect(0, 0, w, h);
      const ac = accent();
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.t += 0.012;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.globalAlpha = (Math.sin(p.t) * 0.35 + 0.65) * p.a;
        ctx.fillStyle = p.accent ? ac : '#ffd9c9';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    loop();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      obs?.disconnect();
    };
  }, [heroRef]);

  return <canvas ref={canvasRef} className="ambient" />;
}
