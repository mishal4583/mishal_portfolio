'use client';
import { useEffect, useRef } from 'react';

const CHAPTER_MSGS = {
  INTRO: "Hi — I'm Bolt. Scroll to explore.",
  ABOUT: "Meet the human who built me.",
  APPROACH: "Here's how Mishal thinks.",
  NUMBERS: "The proof, in numbers.",
  WORK: "Check out the builds below!",
  FEATURED: "My favourite — Veycho, live in prod.",
  'AI LAB': "Psst… you can chat with me!",
  STACK: "Powered by all of these.",
  PATH: "Where Mishal has been.",
  CERTS: "Verified & certified.",
  GITHUB: "Straight from the source.",
  CONTACT: "Let's talk — say hi!",
};

export default function Robot({ chapName }) {
  const robotRef = useRef(null);
  const bubbleRef = useRef(null);
  const visRef = useRef(null);
  const legLRef = useRef(null);
  const legRRef = useRef(null);
  const armLRef = useRef(null);
  const armRRef = useRef(null);
  const pupilsRef = useRef([]);
  const thrRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const robot = robotRef.current;
    const bubble = bubbleRef.current;
    const vis = visRef.current;
    if (!robot || !vis) return;
    const legL = legLRef.current, legR = legRRef.current;
    const armL = armLRef.current, armR = armRRef.current;
    const thr = thrRef.current, glow = glowRef.current;
    const pupils = pupilsRef.current;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let x = 40, dir = 1, facing = 1, gait = 0, breathe = 0, rollA = 0, turnDeg = 0;
    let beh = 'hop', behEnd = performance.now() + 2400;
    let last = '', hideT = null, paused = false, resting = false, restTimer = null;
    let rafId;

    const setLegs = (a, b) => {
      if (legL) legL.style.transform = `rotate(${a}deg)`;
      if (legR) legR.style.transform = `rotate(${b}deg)`;
    };
    const setArms = (a, b) => {
      if (armL) armL.style.transform = `rotate(${a}deg)`;
      if (armR) armR.style.transform = `rotate(${b}deg)`;
    };

    const pickBeh = (now) => {
      const opts = ['hop', 'hover', 'look', 'hop', 'hover', 'look', 'hop', 'roll'];
      beh = opts[(Math.random() * opts.length) | 0];
      const dur = beh === 'look' ? 1800 + Math.random() * 2000 : beh === 'roll' ? 1400 + Math.random() * 700 : 3200 + Math.random() * 3000;
      behEnd = now + dur; rollA = 0;
    };

    const onMouseMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onScrollRest = () => { resting = true; clearTimeout(restTimer); restTimer = setTimeout(() => { resting = false; }, 420); };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScrollRest, { passive: true });

    robot.addEventListener('mouseenter', () => { paused = true; });
    robot.addEventListener('mouseleave', () => { paused = false; });
    robot.addEventListener('click', () => {
      const c = document.getElementById('sec-contact');
      if (c) window.scrollTo({ top: c.offsetTop + 2, behavior: 'smooth' });
    });

    const loop = (now) => {
      rafId = requestAnimationFrame(loop);
      if (document.hidden) return;

      const onIntro = (chapName || '').trim() === 'INTRO';
      robot.style.opacity = onIntro ? '0' : '1';
      robot.style.visibility = onIntro ? 'hidden' : 'visible';
      robot.style.pointerEvents = onIntro ? 'none' : 'auto';
      if (onIntro) return;

      const idle = paused || resting;
      breathe += 0.04;
      const margin = 44;
      const maxX = Math.max(margin, window.innerWidth - robot.offsetWidth - margin);

      if (idle) { behEnd = Math.max(behEnd, now + 250); }
      else if (now >= behEnd) pickBeh(now);

      const tgtTurn = facing === 1 ? 0 : 180;
      turnDeg += (tgtTurn - turnDeg) * 0.12;
      const turning = Math.abs(turnDeg - tgtTurn) > 10;

      const moving = !idle && beh !== 'look' && !turning;
      if (moving) {
        const sp = beh === 'hover' ? 1.15 : beh === 'roll' ? 1.7 : 1.0;
        x += dir * sp;
        if (x <= margin) { x = margin; dir = 1; facing = 1; pickBeh(now); }
        else if (x >= maxX) { x = maxX; dir = -1; facing = -1; pickBeh(now); }
      }
      const sc = window.innerWidth <= 768 ? 0.46 : 1;
      robot.style.transform = sc < 1 ? `translateX(${x}px) scale(${sc})` : `translateX(${x}px)`;

      let ty = 0, rot = 0, squash = 0, thrust = 0;
      if (idle) {
        ty = Math.sin(breathe) * 1.8; setLegs(4, -4);
        setArms(-8 + Math.sin(breathe * 2) * 4, 8 - Math.sin(breathe * 2) * 4);
      } else if (beh === 'hop') {
        gait += 0.085;
        const jp = Math.abs(Math.sin(gait));
        ty = -jp * 13; squash = (1 - jp) * 0.7;
        setLegs(jp * 24 + 4, -(jp * 24 + 4));
        setArms(-jp * 30 - 5, jp * 30 + 5);
        rot = Math.sin(gait * 2) * 2;
      } else if (beh === 'hover') {
        const fl = Math.sin(breathe * 1.5), sway = Math.sin(breathe * 0.8);
        ty = -23 + fl * 3.2; thrust = 1;
        setLegs(11 + fl * 3, -9 + fl * 3);
        setArms(-16 + sway * 4, 16 + sway * 4);
        rot = dir * 6 + sway * 2;
      } else if (beh === 'roll') {
        rollA += 5 * dir; rot = rollA; ty = -2;
        setLegs(0, 0); setArms(0, 0);
      } else {
        facing = (mx < x + 39) ? -1 : 1;
        ty = Math.sin(breathe) * 1.8;
        const wv = Math.sin(breathe * 1.6);
        setLegs(5, -5); setArms(-10 + wv * 6, 10 - wv * 6);
        rot = wv * 2;
      }

      const scq = 1 + squash * 0.10, syq = 1 - squash * 0.12;
      vis.style.transform = `perspective(480px) translateY(${ty}px) rotateY(${turnDeg}deg) scaleX(${scq}) scaleY(${syq}) rotate(${rot}deg)`;

      if (thr && glow) {
        if (thrust) {
          const fk = 0.7 + Math.random() * 0.3;
          thr.style.opacity = fk.toFixed(2);
          thr.style.transform = `translateX(-50%) scaleY(${(0.78 + Math.random() * 0.5).toFixed(2)}) scaleX(${(0.9 + Math.random() * 0.18).toFixed(2)})`;
          glow.style.opacity = (0.28 + Math.random() * 0.14).toFixed(2);
        } else {
          thr.style.opacity = '0'; glow.style.opacity = '0';
        }
      }

      if (!resting && pupils.length) {
        const cx = x + robot.offsetWidth / 2;
        const cy = window.innerHeight - 20 - robot.offsetHeight * 0.58;
        const ang = Math.atan2(my - cy, mx - cx);
        const d = Math.min(3, Math.hypot(mx - cx, my - cy) / 45);
        const ox = Math.cos(ang) * d * facing, oy = Math.sin(ang) * d;
        pupils.forEach(p => { if (p) p.style.transform = `translate(${ox}px, ${oy}px)`; });
      }

      if (bubble) {
        const m = CHAPTER_MSGS[(chapName || '').trim()] || '';
        if (m && m !== last) {
          last = m;
          bubble.textContent = m;
          bubble.style.opacity = '1'; bubble.style.transform = 'none';
          clearTimeout(hideT);
          hideT = setTimeout(() => { bubble.style.opacity = '0'; bubble.style.transform = 'translateY(6px)'; }, 4200);
        }
      }
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(restTimer);
      clearTimeout(hideT);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScrollRest);
    };
  }, [chapName]);

  return (
    <div ref={robotRef} className="robot" title="Talk to Mishal" style={{ left: '40px', bottom: '20px' }}>
      <div ref={bubbleRef} className="robot-bubble" />
      <div ref={visRef} className="robot-vis">
        {/* Antenna */}
        <div style={{ position: 'absolute', left: '50%', top: '-13px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="robot-antenna-dot" />
          <span style={{ width: '2px', height: '11px', background: '#4a443f' }} />
        </div>
        {/* Head */}
        <div style={{ position: 'relative', width: '60px', height: '50px', margin: '0 auto', background: 'linear-gradient(150deg,#39322c 0%,#1e1a16 56%,#100e0c 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '17px', boxShadow: 'inset 1.5px 2px 3px rgba(255,255,255,0.13), inset 0 -4px 7px rgba(0,0,0,0.55), 0 12px 22px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', left: '9px', top: '6px', width: '18px', height: '11px', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.22), transparent 70%)', filter: 'blur(2px)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', gap: '9px', padding: '7px 9px', background: '#0c0b0a', borderRadius: '11px', boxShadow: 'inset 0 0 6px rgba(0,0,0,0.85)' }}>
            <span className="eye"><span className="pupil" ref={el => pupilsRef.current[0] = el} /></span>
            <span className="eye"><span className="pupil" ref={el => pupilsRef.current[1] = el} /></span>
          </div>
          <span style={{ position: 'absolute', left: '-7px', top: '18px', width: '6px', height: '14px', background: 'linear-gradient(90deg,#241f1b,#14110f)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }} />
          <span style={{ position: 'absolute', right: '-7px', top: '18px', width: '6px', height: '14px', background: 'linear-gradient(270deg,#241f1b,#14110f)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }} />
        </div>
        {/* Torso + arms */}
        <div style={{ position: 'relative', width: '46px', margin: '-3px auto 0' }}>
          <div ref={armLRef} className="arm" style={{ position: 'absolute', left: '-9px', top: '3px', width: '7px', height: '19px', borderRadius: '5px', background: 'linear-gradient(180deg,#2c2723,#131110)', border: '1px solid rgba(255,255,255,0.08)', transformOrigin: '50% 12%' }}>
            <span style={{ position: 'absolute', bottom: '-3px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#3a332d,#141110)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <div ref={armRRef} className="arm" style={{ position: 'absolute', right: '-9px', top: '3px', width: '7px', height: '19px', borderRadius: '5px', background: 'linear-gradient(180deg,#2c2723,#131110)', border: '1px solid rgba(255,255,255,0.08)', transformOrigin: '50% 12%' }}>
            <span style={{ position: 'absolute', bottom: '-3px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#3a332d,#141110)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <div style={{ position: 'relative', width: '46px', height: '27px', background: 'linear-gradient(150deg,#2b2622 0%,#191512 60%,#100e0c 100%)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', border: '1.5px solid var(--accent)', boxShadow: '0 0 8px var(--accent), inset 0 0 4px var(--accent)' }} />
          </div>
        </div>
        {/* Legs */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '2px' }}>
          <div ref={legLRef} style={{ position: 'relative', width: '8px', height: '14px', borderRadius: '4px', background: 'linear-gradient(180deg,#241f1c,#0f0d0c)', border: '1px solid rgba(255,255,255,0.06)', transformOrigin: '50% 0' }}>
            <span style={{ position: 'absolute', bottom: '-3px', left: '-2px', width: '13px', height: '6px', borderRadius: '4px 4px 5px 5px', background: 'linear-gradient(180deg,#2a2521,#100e0c)', border: '1px solid rgba(255,255,255,0.07)' }} />
          </div>
          <div ref={legRRef} style={{ position: 'relative', width: '8px', height: '14px', borderRadius: '4px', background: 'linear-gradient(180deg,#241f1c,#0f0d0c)', border: '1px solid rgba(255,255,255,0.06)', transformOrigin: '50% 0' }}>
            <span style={{ position: 'absolute', bottom: '-3px', left: '-2px', width: '13px', height: '6px', borderRadius: '4px 4px 5px 5px', background: 'linear-gradient(180deg,#2a2521,#100e0c)', border: '1px solid rgba(255,255,255,0.07)' }} />
          </div>
        </div>
        {/* Thruster + glow */}
        <div ref={thrRef} style={{ position: 'absolute', left: '50%', bottom: '-12px', transform: 'translateX(-50%)', width: '16px', height: '26px', borderRadius: '50% 50% 48% 48%', background: 'radial-gradient(ellipse at 50% 18%, #fff 6%, #ffe3d6 26%, var(--accent) 52%, rgba(255,87,34,0.35) 70%, transparent 80%)', filter: 'blur(1px)', opacity: 0, transformOrigin: '50% 0', transition: 'opacity .3s ease', pointerEvents: 'none' }} />
        <div ref={glowRef} style={{ position: 'absolute', left: '50%', bottom: '-2px', transform: 'translateX(-50%)', width: '62px', height: '14px', borderRadius: '50%', background: 'radial-gradient(ellipse at center, var(--accent), transparent 70%)', filter: 'blur(4px)', opacity: 0, transition: 'opacity .35s ease', pointerEvents: 'none', zIndex: -1 }} />
        {/* Ground shadow */}
        <div style={{ position: 'absolute', left: '50%', bottom: '-7px', transform: 'translateX(-50%)', width: '56px', height: '9px', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5), transparent 72%)', filter: 'blur(1.5px)', zIndex: -1, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}
