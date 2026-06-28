'use client';

import { useState, useEffect, CSSProperties } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Service    { id: string; icon: string; title: string; description: string; }
interface Project    { id: string; image: string; title: string; tags: string; category: string; description: string; link: string; }
interface Internship { id: string; image: string; title: string; company: string; }
interface Skill      { id: string; name: string; level: number; }
interface SkillCat   { id: string; name: string; skills: Skill[]; }
interface Certificate{ id: string; image: string; title: string; link: string; }
interface FilterCat  { value: string; label: string; }

interface Stat       { id: string; value: string; label: string; }
interface Education  { id: string; degree: string; institution: string; year: string; description: string; grade: string; }

interface PortfolioData {
  meta:             { title: string; description: string; keywords: string; };
  hero:             { greeting: string; name: string; tagline: string; description: string; ctaPrimary: { text: string; href: string; }; ctaSecondary: { text: string; href: string; }; resumeLink: string; stats: Stat[]; };
  about:            { profileImage: string; bio: string[]; services: Service[]; };
  filterCategories: FilterCat[];
  projects:         Project[];
  internships:      Internship[];
  skills:           { categories: SkillCat[]; };
  certificates:     Certificate[];
  education:        Education[];
  contact:          { email: string; location: string; github: string; linkedin: string; twitter: string; };
  languages:        { fluent: string; comprehension: string; };
  footer:           { name: string; year: string; };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const ACCENT  = '#FF5722';
const SIDEBAR_BG = '#0f172a';

// ── Shared UI components ──────────────────────────────────────────────────────

const inputStyle: CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
  borderRadius: 7, fontSize: '0.9rem', color: '#1e293b',
  background: '#fff', boxSizing: 'border-box', outline: 'none',
  transition: 'border-color .15s',
};

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; }) {
  return (
    <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} style={inputStyle}
      onFocus={e => (e.target.style.borderColor = ACCENT)}
      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; }) {
  return (
    <textarea value={value ?? ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
      onFocus={e => (e.target.style.borderColor = ACCENT)}
      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode; }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 6 }}>{hint}</p>}
      {children}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties; }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20, ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>{children}</div>;
}

type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
function Btn({ children, onClick, variant = 'secondary', disabled, small, style }: { children: React.ReactNode; onClick?: (e?: React.MouseEvent) => void; variant?: BtnVariant; disabled?: boolean; small?: boolean; style?: CSSProperties; }) {
  const map: Record<BtnVariant, CSSProperties> = {
    primary:   { background: ACCENT, color: '#fff', border: `1px solid ${ACCENT}` },
    secondary: { background: '#fff', color: '#374151', border: '1px solid #d1d5db' },
    danger:    { background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' },
    ghost:     { background: 'transparent', color: '#6b7280', border: '1px solid transparent' },
    success:   { background: '#16a34a', color: '#fff', border: '1px solid #16a34a' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? '5px 10px' : '8px 16px', borderRadius: 7,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: small ? '0.78rem' : '0.875rem', fontWeight: 600,
      opacity: disabled ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 5,
      ...map[variant], ...style,
    }}>
      {children}
    </button>
  );
}

function Divider() {
  return <hr style={{ borderTop: '1px solid #f1f5f9', borderRight: 'none', borderBottom: 'none', borderLeft: 'none', margin: '16px 0' }} />;
}

function SectionHeading({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string; }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{title}</span>
      </div>
      {subtitle && <p style={{ fontSize: '0.875rem', color: '#64748b', marginLeft: 38 }}>{subtitle}</p>}
    </div>
  );
}

function RangeField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void; }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600, minWidth: 130, flexShrink: 0 }}>{label}</span>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: ACCENT }} />
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: ACCENT, minWidth: 36, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

// ── Section Forms ─────────────────────────────────────────────────────────────

function HeroForm({ data, onChange }: { data: PortfolioData['hero']; onChange: (d: PortfolioData['hero']) => void; }) {
  const set = (k: keyof PortfolioData['hero'], v: string) => onChange({ ...data, [k]: v });
  const setCta = (which: 'ctaPrimary' | 'ctaSecondary', k: 'text' | 'href', v: string) =>
    onChange({ ...data, [which]: { ...data[which], [k]: v } });
  return (
    <>
      <SectionHeading icon="🏠" title="Hero Section" subtitle="The first thing visitors see — your name, tagline, and call-to-action." />
      <Card>
        <CardTitle>Identity</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <Field label="Greeting"><Input value={data.greeting} onChange={v => set('greeting', v)} placeholder="Hello, I'm" /></Field>
          <Field label="Your Name"><Input value={data.name} onChange={v => set('name', v)} placeholder="Your Full Name" /></Field>
        </div>
        <Field label="Tagline"><Textarea value={data.tagline} onChange={v => set('tagline', v)} rows={2} placeholder="Short powerful statement about who you are" /></Field>
        <Field label="Description"><Textarea value={data.description} onChange={v => set('description', v)} rows={4} placeholder="A paragraph describing your background and skills" /></Field>
      </Card>
      <Card>
        <CardTitle>Resume / CV</CardTitle>
        <Field label="Resume Link" hint="Upload your PDF to /public/resume.pdf or paste an external URL">
          <Input value={data.resumeLink ?? ''} onChange={v => onChange({ ...data, resumeLink: v })} placeholder="/resume.pdf or https://..." />
        </Field>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Stats / Highlights ({(data.stats ?? []).length})</span>
          <Btn variant="primary" onClick={() => onChange({ ...data, stats: [...(data.stats ?? []), { id: uid(), value: '', label: '' }] })}>+ Add Stat</Btn>
        </div>
        {(data.stats ?? []).map((stat, i) => (
          <div key={stat.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <Field label="Value"><Input value={stat.value} onChange={v => { const s = [...(data.stats ?? [])]; s[i] = { ...s[i], value: v }; onChange({ ...data, stats: s }); }} placeholder="7+" /></Field>
            <Field label="Label"><Input value={stat.label} onChange={v => { const s = [...(data.stats ?? [])]; s[i] = { ...s[i], label: v }; onChange({ ...data, stats: s }); }} placeholder="Projects Built" /></Field>
            <Btn variant="danger" small onClick={() => onChange({ ...data, stats: (data.stats ?? []).filter((_, j) => j !== i) })} style={{ marginTop: 8 }}>✕</Btn>
          </div>
        ))}
      </Card>
      <Card>
        <CardTitle>Call-to-Action Buttons</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: 12 }}>PRIMARY BUTTON</div>
            <Field label="Button Text"><Input value={data.ctaPrimary.text} onChange={v => setCta('ctaPrimary', 'text', v)} /></Field>
            <Field label="Link / Anchor"><Input value={data.ctaPrimary.href} onChange={v => setCta('ctaPrimary', 'href', v)} placeholder="#projects" /></Field>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: 12 }}>SECONDARY BUTTON</div>
            <Field label="Button Text"><Input value={data.ctaSecondary.text} onChange={v => setCta('ctaSecondary', 'text', v)} /></Field>
            <Field label="Link / Anchor"><Input value={data.ctaSecondary.href} onChange={v => setCta('ctaSecondary', 'href', v)} placeholder="#contact" /></Field>
          </div>
        </div>
      </Card>
    </>
  );
}

function AboutForm({ data, onChange }: { data: PortfolioData['about']; onChange: (d: PortfolioData['about']) => void; }) {
  const setBio = (i: number, v: string) => {
    const bio = [...data.bio];
    bio[i] = v;
    onChange({ ...data, bio });
  };
  const addBio = () => onChange({ ...data, bio: [...data.bio, ''] });
  const removeBio = (i: number) => onChange({ ...data, bio: data.bio.filter((_, idx) => idx !== i) });

  const updateService = (i: number, k: keyof Service, v: string) => {
    const services = data.services.map((s, idx) => idx === i ? { ...s, [k]: v } : s);
    onChange({ ...data, services });
  };
  const addService = () => onChange({ ...data, services: [...data.services, { id: uid(), icon: 'fas fa-star', title: '', description: '' }] });
  const removeService = (i: number) => onChange({ ...data, services: data.services.filter((_, idx) => idx !== i) });

  return (
    <>
      <SectionHeading icon="👤" title="About Me" subtitle="Profile picture, bio paragraphs, and what-I-do service cards." />
      <Card>
        <CardTitle>Profile</CardTitle>
        <Field label="Profile Image Path" hint="Drop your photo in public/images/ and paste the path here, e.g. /images/profile.jpg">
          <Input value={data.profileImage} onChange={v => onChange({ ...data, profileImage: v })} placeholder="/images/profile.jpg" />
        </Field>
      </Card>
      <Card>
        <CardTitle>Bio Paragraphs</CardTitle>
        {data.bio.map((para, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>PARAGRAPH {i + 1}</span>
              {data.bio.length > 1 && <Btn variant="danger" small onClick={() => removeBio(i)}>Remove</Btn>}
            </div>
            <Textarea value={para} onChange={v => setBio(i, v)} rows={3} />
          </div>
        ))}
        <Btn variant="secondary" onClick={addBio}>+ Add Paragraph</Btn>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Services / What I Do ({data.services.length})</span>
          <Btn variant="primary" onClick={addService}>+ Add Service</Btn>
        </div>
        {data.services.map((svc, i) => (
          <div key={svc.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Service #{i + 1}</span>
              <Btn variant="danger" small onClick={() => removeService(i)}>✕ Remove</Btn>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
              <Field label="Icon Class" hint="Font Awesome class"><Input value={svc.icon} onChange={v => updateService(i, 'icon', v)} placeholder="fas fa-brain" /></Field>
              <Field label="Title"><Input value={svc.title} onChange={v => updateService(i, 'title', v)} /></Field>
            </div>
            <Field label="Description"><Textarea value={svc.description} onChange={v => updateService(i, 'description', v)} rows={2} /></Field>
          </div>
        ))}
      </Card>
    </>
  );
}

const ALL_CATS = ['generative-ai', 'full-stack', 'computer-vision', 'hybrid-ai'];

function ProjectsForm({ data, onChange }: { data: Project[]; onChange: (d: Project[]) => void; }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const update = (i: number, k: keyof Project, v: string) =>
    onChange(data.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
  const toggleCat = (i: number, cat: string) => {
    const cats = data[i].category.split(' ').filter(Boolean);
    const next = cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat];
    update(i, 'category', next.join(' '));
  };
  const add = () => {
    const p: Project = { id: uid(), image: '', title: 'New Project', tags: '', category: '', description: '', link: '' };
    onChange([...data, p]);
    setOpen(s => new Set([...s, p.id]));
  };
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const arr = [...data];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  return (
    <>
      <SectionHeading icon="📁" title="Projects" subtitle={`${data.length} projects — click a card to expand and edit.`} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn variant="primary" onClick={add}>+ Add Project</Btn>
      </div>
      {data.map((p, i) => (
        <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 12, overflow: 'hidden', background: '#fff' }}>
          <div onClick={() => toggle(p.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', userSelect: 'none', background: open.has(p.id) ? '#fef9f7' : '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', minWidth: 20 }}>#{i + 1}</span>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{p.title || 'Untitled Project'}</span>
              {p.category && <span style={{ fontSize: '0.72rem', background: '#fef3ee', color: ACCENT, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{p.category}</span>}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Btn variant="ghost" small onClick={e => { e?.stopPropagation(); move(i, -1); }}>↑</Btn>
              <Btn variant="ghost" small onClick={e => { e?.stopPropagation(); move(i, 1); }}>↓</Btn>
              <Btn variant="danger" small onClick={e => { e?.stopPropagation(); remove(i); }}>✕</Btn>
              <span style={{ color: '#94a3b8', marginLeft: 4 }}>{open.has(p.id) ? '▲' : '▼'}</span>
            </div>
          </div>
          {open.has(p.id) && (
            <div style={{ padding: '20px 18px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Project Title"><Input value={p.title} onChange={v => update(i, 'title', v)} /></Field>
                <Field label="Tags (display text)"><Input value={p.tags} onChange={v => update(i, 'tags', v)} placeholder="Flask, Hugging Face & NLTK" /></Field>
              </div>
              <Field label="Image Path" hint="e.g. /images/projects/myproject.jpg"><Input value={p.image} onChange={v => update(i, 'image', v)} /></Field>
              <Field label="GitHub / Project Link"><Input value={p.link} onChange={v => update(i, 'link', v)} placeholder="https://github.com/..." /></Field>
              <Field label="Categories (for filtering)">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                  {ALL_CATS.map(cat => {
                    const active = p.category.split(' ').includes(cat);
                    return (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', padding: '5px 12px', borderRadius: 20, border: `1px solid ${active ? ACCENT : '#e2e8f0'}`, background: active ? '#fef3ee' : '#f8fafc', color: active ? ACCENT : '#64748b' }}>
                        <input type="checkbox" checked={active} onChange={() => toggleCat(i, cat)} style={{ accentColor: ACCENT }} />
                        {cat}
                      </label>
                    );
                  })}
                </div>
              </Field>
              <Field label="Description"><Textarea value={p.description} onChange={v => update(i, 'description', v)} rows={4} /></Field>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function InternshipsForm({ data, onChange }: { data: Internship[]; onChange: (d: Internship[]) => void; }) {
  const update = (i: number, k: keyof Internship, v: string) =>
    onChange(data.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const add = () => onChange([...data, { id: uid(), image: '', title: '', company: '' }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <>
      <SectionHeading icon="💼" title="Internships" subtitle="Internship entries with certificate images shown via modal." />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn variant="primary" onClick={add}>+ Add Internship</Btn>
      </div>
      {data.map((item, i) => (
        <Card key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Internship #{i + 1}</span>
            <Btn variant="danger" small onClick={() => remove(i)}>✕ Remove</Btn>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Role / Title"><Input value={item.title} onChange={v => update(i, 'title', v)} placeholder="Artificial Intelligence" /></Field>
            <Field label="Company / Organisation"><Input value={item.company} onChange={v => update(i, 'company', v)} placeholder="Codtech" /></Field>
          </div>
          <Field label="Certificate Image Path" hint="e.g. /images/internships/internship1.jpg — used in the certificate modal">
            <Input value={item.image} onChange={v => update(i, 'image', v)} />
          </Field>
        </Card>
      ))}
    </>
  );
}

function SkillsForm({ data, onChange }: { data: PortfolioData['skills']; onChange: (d: PortfolioData['skills']) => void; }) {
  const updateCatName = (ci: number, name: string) => {
    const categories = data.categories.map((c, i) => i === ci ? { ...c, name } : c);
    onChange({ categories });
  };
  const addCat = () => onChange({ categories: [...data.categories, { id: uid(), name: 'New Category', skills: [] }] });
  const removeCat = (ci: number) => onChange({ categories: data.categories.filter((_, i) => i !== ci) });

  const updateSkill = (ci: number, si: number, k: keyof Skill, v: string | number) => {
    const categories = data.categories.map((c, i) => {
      if (i !== ci) return c;
      const skills = c.skills.map((s, j) => j === si ? { ...s, [k]: v } : s);
      return { ...c, skills };
    });
    onChange({ categories });
  };
  const addSkill = (ci: number) => {
    const categories = data.categories.map((c, i) =>
      i === ci ? { ...c, skills: [...c.skills, { id: uid(), name: '', level: 80 }] } : c
    );
    onChange({ categories });
  };
  const removeSkill = (ci: number, si: number) => {
    const categories = data.categories.map((c, i) =>
      i === ci ? { ...c, skills: c.skills.filter((_, j) => j !== si) } : c
    );
    onChange({ categories });
  };

  return (
    <>
      <SectionHeading icon="⚡" title="Skills" subtitle="Skill categories and proficiency levels (0–100)." />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn variant="primary" onClick={addCat}>+ Add Category</Btn>
      </div>
      {data.categories.map((cat, ci) => (
        <Card key={cat.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <Input value={cat.name} onChange={v => updateCatName(ci, v)} placeholder="Category Name" />
            </div>
            <Btn variant="danger" small onClick={() => removeCat(ci)}>✕ Remove</Btn>
          </div>
          <Divider />
          {cat.skills.map((sk, si) => (
            <div key={sk.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <input value={sk.name} onChange={e => updateSkill(ci, si, 'name', e.target.value)}
                placeholder="Skill name" style={{ ...inputStyle, maxWidth: 160, minWidth: 120 }} />
              <input type="range" min={0} max={100} value={sk.level}
                onChange={e => updateSkill(ci, si, 'level', Number(e.target.value))}
                style={{ flex: 1, accentColor: ACCENT }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: ACCENT, minWidth: 36, textAlign: 'right' }}>{sk.level}%</span>
              <Btn variant="danger" small onClick={() => removeSkill(ci, si)}>✕</Btn>
            </div>
          ))}
          <Btn variant="secondary" small onClick={() => addSkill(ci)} style={{ marginTop: 8 }}>+ Add Skill</Btn>
        </Card>
      ))}
    </>
  );
}

function CertificatesForm({ data, onChange }: { data: Certificate[]; onChange: (d: Certificate[]) => void; }) {
  const update = (i: number, k: keyof Certificate, v: string) =>
    onChange(data.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const add = () => onChange([...data, { id: uid(), image: '', title: '', link: '' }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <>
      <SectionHeading icon="🎓" title="Certificates" subtitle="Certifications shown with image and external link." />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn variant="primary" onClick={add}>+ Add Certificate</Btn>
      </div>
      {data.map((cert, i) => (
        <Card key={cert.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Certificate #{i + 1}</span>
            <Btn variant="danger" small onClick={() => remove(i)}>✕ Remove</Btn>
          </div>
          <Field label="Certificate Title"><Input value={cert.title} onChange={v => update(i, 'title', v)} /></Field>
          <Field label="Image Path" hint="e.g. /images/certificates/certi1.jpg"><Input value={cert.image} onChange={v => update(i, 'image', v)} /></Field>
          <Field label="External Link (LinkedIn, Coursera, etc.)"><Input value={cert.link} onChange={v => update(i, 'link', v)} placeholder="https://..." /></Field>
        </Card>
      ))}
    </>
  );
}

function ContactForm({ data, onChange }: { data: PortfolioData['contact']; onChange: (d: PortfolioData['contact']) => void; }) {
  const set = (k: keyof PortfolioData['contact'], v: string) => onChange({ ...data, [k]: v });
  return (
    <>
      <SectionHeading icon="📧" title="Contact" subtitle="Your contact info displayed in the Contact section and footer." />
      <Card>
        <CardTitle>Contact Details</CardTitle>
        <Field label="Email Address"><Input value={data.email} onChange={v => set('email', v)} placeholder="you@example.com" /></Field>
        <Field label="Location"><Input value={data.location} onChange={v => set('location', v)} placeholder="City, State, Country" /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="GitHub URL"><Input value={data.github} onChange={v => set('github', v)} placeholder="https://github.com/..." /></Field>
          <Field label="LinkedIn URL"><Input value={data.linkedin} onChange={v => set('linkedin', v)} placeholder="https://linkedin.com/in/..." /></Field>
        </div>
        <Field label="Twitter / X URL (optional)"><Input value={data.twitter ?? ''} onChange={v => set('twitter' as keyof typeof data, v)} placeholder="https://twitter.com/..." /></Field>
      </Card>
    </>
  );
}

function LanguagesForm({ data, onChange }: { data: PortfolioData['languages']; onChange: (d: PortfolioData['languages']) => void; }) {
  return (
    <>
      <SectionHeading icon="🌐" title="Languages" subtitle="Natural languages displayed at the bottom of the Skills section." />
      <Card>
        <Field label="Fluent / Native"><Input value={data.fluent} onChange={v => onChange({ ...data, fluent: v })} placeholder="English (Fluent), Malayalam (Native)" /></Field>
        <Field label="Comprehension / Other"><Input value={data.comprehension} onChange={v => onChange({ ...data, comprehension: v })} placeholder="Comprehension: Kannada, Hindi and Tamil." /></Field>
      </Card>
    </>
  );
}

function FilterCatsForm({ data, onChange }: { data: FilterCat[]; onChange: (d: FilterCat[]) => void; }) {
  const update = (i: number, k: keyof FilterCat, v: string) =>
    onChange(data.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const add = () => onChange([...data, { value: uid(), label: '' }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <>
      <SectionHeading icon="🔠" title="Filter Categories" subtitle="The category tabs shown above the Projects grid. Each value must match the category field on projects." />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn variant="primary" onClick={add}>+ Add Category</Btn>
      </div>
      {data.map((cat, i) => (
        <Card key={i} style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'center' }}>
            <Field label="Value (slug)"><Input value={cat.value} onChange={v => update(i, 'value', v)} placeholder="generative-ai" /></Field>
            <Field label="Label (display)"><Input value={cat.label} onChange={v => update(i, 'label', v)} placeholder="Generative AI" /></Field>
            <Btn variant="danger" small onClick={() => remove(i)} style={{ marginTop: 8 }}>✕</Btn>
          </div>
        </Card>
      ))}
    </>
  );
}

function EducationForm({ data, onChange }: { data: Education[]; onChange: (d: Education[]) => void; }) {
  const update = (i: number, k: keyof Education, v: string) =>
    onChange(data.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const add = () => onChange([...data, { id: uid(), degree: '', institution: '', year: '', description: '', grade: '' }]);
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const arr = [...data]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; onChange(arr);
  };

  return (
    <>
      <SectionHeading icon="🎓" title="Education" subtitle="Academic background shown as a timeline between About and Projects." />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn variant="primary" onClick={add}>+ Add Entry</Btn>
      </div>
      {data.map((item, i) => (
        <Card key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Entry #{i + 1} {i % 2 === 0 ? '(left)' : '(right)'}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn variant="ghost" small onClick={() => move(i, -1)}>↑</Btn>
              <Btn variant="ghost" small onClick={() => move(i, 1)}>↓</Btn>
              <Btn variant="danger" small onClick={() => remove(i)}>✕</Btn>
            </div>
          </div>
          <Field label="Degree / Qualification"><Input value={item.degree} onChange={v => update(i, 'degree', v)} placeholder="Master of Computer Applications (MCA)" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Field label="Institution"><Input value={item.institution} onChange={v => update(i, 'institution', v)} placeholder="University Name" /></Field>
            <Field label="Year / Period"><Input value={item.year} onChange={v => update(i, 'year', v)} placeholder="2023 – Present" /></Field>
          </div>
          <Field label="Description"><Textarea value={item.description} onChange={v => update(i, 'description', v)} rows={2} placeholder="Brief description of your study focus" /></Field>
          <Field label="Grade / Score (optional)"><Input value={item.grade} onChange={v => update(i, 'grade', v)} placeholder="8.5 CGPA" /></Field>
        </Card>
      ))}
    </>
  );
}

function MetaForm({ data, onChange }: { data: PortfolioData['meta']; onChange: (d: PortfolioData['meta']) => void; }) {
  const set = (k: keyof PortfolioData['meta'], v: string) => onChange({ ...data, [k]: v });
  return (
    <>
      <SectionHeading icon="🔍" title="SEO / Meta" subtitle="Page title and meta tags for search engines and social sharing." />
      <Card>
        <Field label="Page Title (shown in browser tab)"><Input value={data.title} onChange={v => set('title', v)} /></Field>
        <Field label="Meta Description"><Textarea value={data.description} onChange={v => set('description', v)} rows={3} /></Field>
        <Field label="Keywords (comma-separated)"><Textarea value={data.keywords} onChange={v => set('keywords', v)} rows={2} /></Field>
      </Card>
    </>
  );
}

function FooterForm({ data, onChange }: { data: PortfolioData['footer']; onChange: (d: PortfolioData['footer']) => void; }) {
  return (
    <>
      <SectionHeading icon="📄" title="Footer" subtitle="Name and year shown at the bottom of the page." />
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 16 }}>
          <Field label="Name"><Input value={data.name} onChange={v => onChange({ ...data, name: v })} placeholder="Your Name" /></Field>
          <Field label="Year"><Input value={data.year} onChange={v => onChange({ ...data, year: v })} placeholder="2025" /></Field>
        </div>
      </Card>
    </>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'hero',         label: 'Hero',             icon: '🏠' },
  { id: 'about',        label: 'About Me',          icon: '👤' },
  { id: 'projects',     label: 'Projects',          icon: '📁' },
  { id: 'filterCats',   label: 'Filter Categories', icon: '🔠' },
  { id: 'education',    label: 'Education',          icon: '🎓' },
  { id: 'internships',  label: 'Internships',       icon: '💼' },
  { id: 'skills',       label: 'Skills',            icon: '⚡' },
  { id: 'certificates', label: 'Certificates',      icon: '🎓' },
  { id: 'contact',      label: 'Contact',           icon: '📧' },
  { id: 'languages',    label: 'Languages',         icon: '🌐' },
  { id: 'meta',         label: 'SEO / Meta',        icon: '🔍' },
  { id: 'footer',       label: 'Footer',            icon: '📄' },
];

function Sidebar({ active, onSelect }: { active: string; onSelect: (s: string) => void; }) {
  return (
    <aside style={{ width: 240, background: SIDEBAR_BG, color: '#cbd5e1', display: 'flex', flexDirection: 'column', flexShrink: 0, minHeight: '100vh' }}>
      <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Portfolio Admin</div>
        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>Content Management</div>
      </div>
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => onSelect(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 20px', background: active === item.id ? '#1e293b' : 'transparent',
            color: active === item.id ? '#fff' : '#94a3b8',
            border: 'none',
            boxShadow: active === item.id ? `inset 3px 0 0 ${ACCENT}` : 'none',
            fontSize: '0.88rem', fontWeight: active === item.id ? 700 : 500,
            cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
          }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
          <span>↗</span> View Live Site
        </a>
      </div>
    </aside>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
      background: type === 'success' ? '#16a34a' : '#dc2626', color: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,.2)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {type === 'success' ? '✓' : '✕'} {message}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [active, setActive] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(r => r.json()).then(setData);
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      showToast('success', 'Saved! Refresh the site to see changes.');
    } catch {
      showToast('error', 'Save failed. Check the console.');
    }
    setSaving(false);
  };

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, borderTop: `4px solid ${ACCENT}`, borderRight: '4px solid #e2e8f0', borderBottom: '4px solid #e2e8f0', borderLeft: '4px solid #e2e8f0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Loading portfolio data…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Sidebar active={active} onSelect={setActive} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
            {NAV_ITEMS.find(n => n.id === active)?.icon} {NAV_ITEMS.find(n => n.id === active)?.label}
          </span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Changes save to portfolio.json</span>
            <Btn variant="primary" onClick={save} disabled={saving} style={{ minWidth: 130, justifyContent: 'center' }}>
              {saving ? '⏳ Saving…' : '💾 Save Changes'}
            </Btn>
          </div>
        </div>

        {/* Content area */}
        <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
          {active === 'hero'         && <HeroForm         data={data.hero}             onChange={v => setData(d => d ? { ...d, hero: v }             : d)} />}
          {active === 'about'        && <AboutForm        data={data.about}            onChange={v => setData(d => d ? { ...d, about: v }            : d)} />}
          {active === 'projects'     && <ProjectsForm     data={data.projects}         onChange={v => setData(d => d ? { ...d, projects: v }         : d)} />}
          {active === 'filterCats'   && <FilterCatsForm   data={data.filterCategories} onChange={v => setData(d => d ? { ...d, filterCategories: v } : d)} />}
          {active === 'education'    && <EducationForm    data={data.education ?? []}    onChange={v => setData(d => d ? { ...d, education: v }    : d)} />}
          {active === 'internships'  && <InternshipsForm  data={data.internships}      onChange={v => setData(d => d ? { ...d, internships: v }      : d)} />}
          {active === 'skills'       && <SkillsForm       data={data.skills}           onChange={v => setData(d => d ? { ...d, skills: v }           : d)} />}
          {active === 'certificates' && <CertificatesForm data={data.certificates}     onChange={v => setData(d => d ? { ...d, certificates: v }     : d)} />}
          {active === 'contact'      && <ContactForm      data={data.contact}          onChange={v => setData(d => d ? { ...d, contact: v }          : d)} />}
          {active === 'languages'    && <LanguagesForm    data={data.languages}        onChange={v => setData(d => d ? { ...d, languages: v }        : d)} />}
          {active === 'meta'         && <MetaForm         data={data.meta}             onChange={v => setData(d => d ? { ...d, meta: v }             : d)} />}
          {active === 'footer'       && <FooterForm       data={data.footer}           onChange={v => setData(d => d ? { ...d, footer: v }           : d)} />}
        </main>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}
