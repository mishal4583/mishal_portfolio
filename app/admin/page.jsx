'use client';
import { useState, useEffect } from 'react';

const ADMIN_PASS = 'mishalmca2026';
const uid = () => Math.random().toString(36).slice(2) + Date.now();

/* ── Color palette ── */
const cl = {
  bg: '#0d0c0c',
  surface: '#161412',
  card: '#1e1b19',
  border: '#2e2a27',
  text: '#f4f1ec',
  sub: '#9b938a',
  accent: '#FF5722',
  error: '#ef4444',
  success: '#22c55e',
};

/* ── Shared styles ── */
const S = {
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: cl.bg, fontFamily: "'Space Grotesk', 'Sora', sans-serif" },
  loginCard: { width: 400, padding: '48px 40px', background: cl.surface, borderRadius: 16, border: `1px solid ${cl.border}` },
  loginM: { width: 56, height: 56, borderRadius: '50%', background: cl.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, color: '#fff', margin: '0 0 20px' },
  loginH1: { margin: '0 0 8px', fontSize: 26, fontWeight: 700, color: cl.text },
  loginSub: { margin: '0 0 28px', color: cl.sub, fontSize: 14 },
  loginInput: { width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${cl.border}`, background: cl.card, color: cl.text, fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  loginError: { marginTop: 8, color: cl.error, fontSize: 13 },
  loginBtn: { marginTop: 20, width: '100%', padding: '12px', borderRadius: 8, background: cl.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'inherit' },
  wrap: { display: 'flex', minHeight: '100vh', background: cl.bg, fontFamily: "'Space Grotesk', 'Sora', sans-serif", color: cl.text },
  sidebar: { width: 220, flexShrink: 0, background: cl.surface, borderRight: `1px solid ${cl.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: 10, padding: '24px 18px 20px', borderBottom: `1px solid ${cl.border}` },
  sidebarM: { width: 34, height: 34, borderRadius: '50%', background: cl.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 },
  sidebarTitle: { fontSize: 13, fontWeight: 700, color: cl.text },
  sidebarSub: { fontSize: 11, color: cl.sub, marginTop: 1 },
  sidebarNav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 },
  navBtn: { display: 'block', width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', background: 'none', color: cl.sub, textAlign: 'left', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' },
  navBtnActive: { background: cl.accent + '22', color: cl.accent, fontWeight: 600 },
  sidebarFoot: { padding: '12px 10px 16px', borderTop: `1px solid ${cl.border}`, display: 'flex', flexDirection: 'column', gap: 2 },
  logoutBtn: { display: 'block', width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', background: 'none', color: cl.error, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left' },
  viewSiteLink: { display: 'block', padding: '9px 12px', borderRadius: 8, color: cl.sub, fontSize: 13, textDecoration: 'none' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', borderBottom: `1px solid ${cl.border}`, background: cl.surface, position: 'sticky', top: 0, zIndex: 10 },
  topTitle: { fontSize: 17, fontWeight: 700, color: cl.text },
  savingBadge: { fontSize: 12, color: cl.sub, padding: '4px 12px', borderRadius: 100, border: `1px solid ${cl.border}` },
  content: { flex: 1, overflowY: 'auto', padding: '28px 32px' },
  secRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  secTitle: { fontSize: 14, fontWeight: 600, color: cl.text },
  addBtn: { padding: '8px 16px', borderRadius: 8, background: cl.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' },
  saveBtn: { padding: '10px 24px', borderRadius: 8, background: cl.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', marginTop: 22 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: cl.sub, borderBottom: `1px solid ${cl.border}`, textTransform: 'uppercase', letterSpacing: '0.08em' },
  td: { padding: '12px 12px', fontSize: 13, color: cl.text, borderBottom: `1px solid ${cl.border}`, verticalAlign: 'middle' },
  tdSub: { color: cl.sub, fontSize: 12, marginTop: 3 },
  editBtn: { padding: '5px 11px', borderRadius: 6, background: cl.card, color: cl.text, border: `1px solid ${cl.border}`, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', marginRight: 5 },
  delBtn: { padding: '5px 11px', borderRadius: 6, background: 'none', color: cl.error, border: `1px solid ${cl.border}`, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' },
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: cl.surface, borderRadius: 16, border: `1px solid ${cl.border}`, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: 32 },
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 17, fontWeight: 700, color: cl.text },
  closeBtn: { background: 'none', border: 'none', color: cl.sub, cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 0 },
  fieldWrap: { marginBottom: 15 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: cl.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 },
  input: { width: '100%', padding: '10px 13px', borderRadius: 8, border: `1px solid ${cl.border}`, background: cl.card, color: cl.text, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 13px', borderRadius: 8, border: `1px solid ${cl.border}`, background: cl.card, color: cl.text, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', minHeight: 88, resize: 'vertical' },
  checkWrap: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 },
  modalActions: { display: 'flex', gap: 10, marginTop: 24 },
  modalSave: { flex: 1, padding: '11px', borderRadius: 8, background: cl.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' },
  modalCancel: { flex: 1, padding: '11px', borderRadius: 8, background: 'none', color: cl.sub, border: `1px solid ${cl.border}`, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' },
  toast: { position: 'fixed', bottom: 24, right: 24, padding: '12px 22px', borderRadius: 10, background: cl.success, color: '#fff', fontSize: 14, fontWeight: 600, zIndex: 2000, boxShadow: '0 4px 28px rgba(0,0,0,.5)', pointerEvents: 'none' },
  toastErr: { background: cl.error },
  card: { padding: '14px 16px', borderRadius: 10, background: cl.card, border: `1px solid ${cl.border}` },
  chipWrap: { display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 },
  chip: { padding: '4px 11px', borderRadius: 100, background: cl.bg, border: `1px solid ${cl.border}`, color: cl.sub, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 },
  chipX: { background: 'none', border: 'none', color: cl.error, cursor: 'pointer', fontSize: 15, padding: '0 0 0 3px', lineHeight: 1 },
  liveBadge: { display: 'inline-block', padding: '2px 7px', borderRadius: 100, background: cl.accent + '22', color: cl.accent, fontSize: 11, fontWeight: 600, marginLeft: 7 },
};

/* ── Shared helpers ── */
function Field({ label, value, onChange, multiline, placeholder, type = 'text' }) {
  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>{label}</label>
      {multiline
        ? <textarea style={S.textarea} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input style={S.input} type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}

function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.url) onChange(json.url);
      else setErr(json.error || 'Upload failed');
    } catch {
      setErr('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div style={S.fieldWrap}>
      <label style={S.label}>{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input style={{ ...S.input, flex: 1 }} type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="URL or upload below" />
        <label style={{ ...S.editBtn, cursor: 'pointer', whiteSpace: 'nowrap', padding: '7px 14px' }}>
          {uploading ? 'Uploading…' : 'Upload Image'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {value && <img src={value} alt="preview" style={{ marginTop: 8, maxHeight: 80, borderRadius: 6, objectFit: 'cover' }} />}
      {err && <div style={{ color: cl.error, fontSize: 12, marginTop: 4 }}>{err}</div>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={S.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.modalHead}>
          <div style={S.modalTitle}>{title}</div>
          <button style={S.closeBtn} onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Login ── */
function LoginScreen({ onAuth }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = () => {
    if (pw === ADMIN_PASS) { localStorage.setItem('portfolio-admin', ADMIN_PASS); onAuth(); }
    else { setErr('Incorrect password'); }
  };
  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={S.loginM}>M</div>
        <h1 style={S.loginH1}>Portfolio Admin</h1>
        <p style={S.loginSub}>Sign in to manage your portfolio content</p>
        <input style={S.loginInput} type="password" placeholder="Password" value={pw}
          onChange={e => { setPw(e.target.value); setErr(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()} />
        {err && <div style={S.loginError}>{err}</div>}
        <button style={S.loginBtn} onClick={submit}>Enter Dashboard →</button>
      </div>
    </div>
  );
}

/* ── Projects Tab ── */
function ProjectsTab({ data, saveSection }) {
  const [items, setItems] = useState([...(data.projects || [])]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const f = (k) => v => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    setForm({ id: uid(), num: String(items.length + 1).padStart(2, '0'), img: '', alt: '', stack: '', title: '', desc: '', link: '', live: false });
    setModal('add');
  };
  const openEdit = item => { setForm({ ...item }); setModal('edit'); };

  const commit = () => {
    if (!form.title?.trim()) return;
    const next = modal === 'add' ? [...items, form] : items.map(i => i.id === form.id ? form : i);
    setItems(next); saveSection('projects', next); setModal(null);
  };

  const del = id => {
    if (!confirm('Delete this project?')) return;
    const next = items.filter(i => i.id !== id);
    setItems(next); saveSection('projects', next);
  };

  return (
    <div>
      <div style={S.secRow}>
        <div style={S.secTitle}>{items.length} Projects</div>
        <button style={S.addBtn} onClick={openAdd}>+ Add Project</button>
      </div>
      <table style={S.table}>
        <thead><tr>
          <th style={S.th}>#</th>
          <th style={S.th}>Title</th>
          <th style={S.th}>Stack</th>
          <th style={S.th}>Link</th>
          <th style={S.th}>Actions</th>
        </tr></thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td style={{ ...S.td, width: 40, color: cl.sub, fontSize: 12 }}>{p.num}</td>
              <td style={S.td}>
                <div>{p.title}{p.live && <span style={S.liveBadge}>LIVE</span>}</div>
                <div style={S.tdSub}>{p.desc?.slice(0, 90)}…</div>
              </td>
              <td style={{ ...S.td, color: cl.sub, fontSize: 12 }}>{p.stack}</td>
              <td style={S.td}>
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: cl.accent, fontSize: 13 }}>↗</a>
              </td>
              <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                <button style={S.editBtn} onClick={() => openEdit(p)}>Edit</button>
                <button style={S.delBtn} onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <Field label="Number (e.g. 01)" value={form.num} onChange={f('num')} />
          <Field label="Title *" value={form.title} onChange={f('title')} />
          <Field label="Tech Stack (e.g. FLUTTER · FIREBASE)" value={form.stack} onChange={f('stack')} />
          <Field label="Description" value={form.desc} onChange={f('desc')} multiline />
          <ImageUploadField label="Project Image" value={form.img} onChange={v => setForm(p => ({ ...p, img: v }))} />
          <Field label="Image alt text" value={form.alt} onChange={f('alt')} />
          <Field label="Project URL" value={form.link} onChange={f('link')} />
          <div style={S.checkWrap}>
            <input type="checkbox" id="proj-live" checked={!!form.live} onChange={e => setForm(p => ({ ...p, live: e.target.checked }))} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: cl.accent }} />
            <label htmlFor="proj-live" style={{ color: cl.text, fontSize: 14, cursor: 'pointer' }}>Mark as LIVE (production)</label>
          </div>
          <div style={S.modalActions}>
            <button style={S.modalCancel} onClick={() => setModal(null)}>Cancel</button>
            <button style={S.modalSave} onClick={commit}>Save Project</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Certifications Tab ── */
function CertsTab({ data, saveSection }) {
  const [items, setItems] = useState([...(data.certs || [])]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const openAdd = () => { setForm({ id: uid(), issuer: '', year: '2025', title: '', link: '' }); setModal('add'); };
  const openEdit = item => { setForm({ ...item }); setModal('edit'); };

  const commit = () => {
    if (!form.title?.trim()) return;
    const next = modal === 'add' ? [...items, form] : items.map(i => i.id === form.id ? form : i);
    setItems(next); saveSection('certs', next); setModal(null);
  };

  const del = id => {
    if (!confirm('Delete this certification?')) return;
    const next = items.filter(i => i.id !== id);
    setItems(next); saveSection('certs', next);
  };

  return (
    <div>
      <div style={S.secRow}>
        <div style={S.secTitle}>{items.length} Certifications</div>
        <button style={S.addBtn} onClick={openAdd}>+ Add Certification</button>
      </div>
      <table style={S.table}>
        <thead><tr>
          <th style={S.th}>Year</th>
          <th style={S.th}>Issuer</th>
          <th style={S.th}>Title</th>
          <th style={S.th}>Actions</th>
        </tr></thead>
        <tbody>
          {items.map(cert => (
            <tr key={cert.id}>
              <td style={{ ...S.td, width: 56, color: cl.sub }}>{cert.year}</td>
              <td style={{ ...S.td, width: 160, color: cl.sub, fontSize: 12 }}>{cert.issuer}</td>
              <td style={S.td}>
                {cert.title}
                {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ color: cl.accent, fontSize: 12, marginLeft: 8 }}>↗</a>}
              </td>
              <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                <button style={S.editBtn} onClick={() => openEdit(cert)}>Edit</button>
                <button style={S.delBtn} onClick={() => del(cert.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Certification' : 'Edit Certification'} onClose={() => setModal(null)}>
          <Field label="Issuer" value={form.issuer} onChange={f('issuer')} placeholder="e.g. IBM · COURSERA" />
          <Field label="Year" value={form.year} onChange={f('year')} />
          <Field label="Title *" value={form.title} onChange={f('title')} />
          <Field label="Credential URL" value={form.link} onChange={f('link')} placeholder="https://…" />
          <div style={S.modalActions}>
            <button style={S.modalCancel} onClick={() => setModal(null)}>Cancel</button>
            <button style={S.modalSave} onClick={commit}>Save Certification</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Experience & Education Tab ── */
function PathTab({ data, saveSection }) {
  const [items, setItems] = useState([...(data.path || [])]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [editIdx, setEditIdx] = useState(null);

  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const openAdd = () => { setForm({ year: '', title: '', sub: '' }); setEditIdx(null); setModal('add'); };
  const openEdit = (item, i) => { setForm({ ...item }); setEditIdx(i); setModal('edit'); };

  const commit = () => {
    if (!form.title?.trim()) return;
    const next = modal === 'add' ? [...items, form] : items.map((x, i) => i === editIdx ? form : x);
    setItems(next); saveSection('path', next); setModal(null);
  };

  const del = i => {
    if (!confirm('Delete this item?')) return;
    const next = items.filter((_, idx) => idx !== i);
    setItems(next); saveSection('path', next);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next); saveSection('path', next);
  };

  return (
    <div>
      <div style={S.secRow}>
        <div style={S.secTitle}>{items.length} Items</div>
        <button style={S.addBtn} onClick={openAdd}>+ Add Item</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ color: cl.accent, fontSize: 13, fontWeight: 700, minWidth: 80, paddingTop: 2 }}>{item.year}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: cl.text }}>{item.title}</div>
              <div style={{ color: cl.sub, fontSize: 13, marginTop: 4 }}>{item.sub}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button style={{ ...S.editBtn, padding: '4px 8px' }} onClick={() => move(i, -1)}>↑</button>
              <button style={{ ...S.editBtn, padding: '4px 8px' }} onClick={() => move(i, 1)}>↓</button>
              <button style={S.editBtn} onClick={() => openEdit(item, i)}>Edit</button>
              <button style={S.delBtn} onClick={() => del(i)}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Experience / Education' : 'Edit Item'} onClose={() => setModal(null)}>
          <Field label="Year / Period" value={form.year} onChange={f('year')} placeholder="e.g. 2024—Now" />
          <Field label="Title / Role *" value={form.title} onChange={f('title')} />
          <Field label="Organisation / Details" value={form.sub} onChange={f('sub')} multiline />
          <div style={S.modalActions}>
            <button style={S.modalCancel} onClick={() => setModal(null)}>Cancel</button>
            <button style={S.modalSave} onClick={commit}>Save Item</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Tech Stack Tab ── */
function StackTab({ data, saveSection }) {
  const [groups, setGroups] = useState(JSON.parse(JSON.stringify(data.stack || [])));
  const [chipInputs, setChipInputs] = useState({});
  const [newGroup, setNewGroup] = useState('');

  const commit = next => { setGroups(next); saveSection('stack', next); };

  const addGroup = () => {
    if (!newGroup.trim()) return;
    commit([...groups, { label: newGroup.trim().toUpperCase(), chips: [] }]);
    setNewGroup('');
  };

  const delGroup = i => {
    if (!confirm('Delete this group?')) return;
    commit(groups.filter((_, idx) => idx !== i));
  };

  /* Only update local state while typing; save to disk on blur */
  const editLabel = (i, val) => setGroups(prev => prev.map((g, idx) => idx === i ? { ...g, label: val } : g));

  const addChip = gi => {
    const val = (chipInputs[gi] || '').trim();
    if (!val) return;
    commit(groups.map((g, i) => i === gi ? { ...g, chips: [...g.chips, val] } : g));
    setChipInputs(p => ({ ...p, [gi]: '' }));
  };

  const removeChip = (gi, ci) => commit(groups.map((g, i) => i === gi ? { ...g, chips: g.chips.filter((_, j) => j !== ci) } : g));

  return (
    <div>
      <div style={S.secRow}>
        <div style={S.secTitle}>{groups.length} Skill Groups</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={S.card}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                style={{ ...S.input, flex: 1, padding: '7px 11px', fontSize: 11, fontWeight: 700, color: cl.accent, background: 'transparent', border: `1px solid ${cl.border}`, letterSpacing: '0.07em' }}
                value={g.label}
                onChange={e => editLabel(gi, e.target.value)}
                onBlur={() => saveSection('stack', groups)}
              />
              <button style={{ ...S.delBtn, flexShrink: 0 }} onClick={() => delGroup(gi)}>Delete Group</button>
            </div>
            <div style={S.chipWrap}>
              {g.chips.map((chip, ci) => (
                <span key={ci} style={S.chip}>
                  {chip}
                  <button style={S.chipX} onClick={() => removeChip(gi, ci)}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input
                style={{ ...S.input, flex: 1, padding: '6px 10px', fontSize: 13 }}
                placeholder="Add chip and press Enter…"
                value={chipInputs[gi] || ''}
                onChange={e => setChipInputs(p => ({ ...p, [gi]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addChip(gi)}
              />
              <button style={{ ...S.addBtn, padding: '6px 14px', fontSize: 13 }} onClick={() => addChip(gi)}>Add</button>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...S.input, flex: 1 }}
            placeholder="New group name (e.g. DEVOPS)…"
            value={newGroup}
            onChange={e => setNewGroup(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGroup()}
          />
          <button style={S.addBtn} onClick={addGroup}>+ Add Group</button>
        </div>
      </div>
    </div>
  );
}

/* ── Hero Tab ── */
function HeroTab({ data, saveSection }) {
  const [form, setForm] = useState({ name: '', subtitle: '', description: '', resumeUrl: '', ...(data.hero || {}) });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <div>
      <Field label="Full Name (first + last — last part gets accent colour)" value={form.name} onChange={f('name')} placeholder="Mishal KS" />
      <Field label="Subtitle" value={form.subtitle} onChange={f('subtitle')} placeholder="FULL-STACK DEVELOPER · AI ENGINEER · MOBILE & WEB" />
      <Field label="Description" value={form.description} onChange={f('description')} multiline />
      <Field label="Resume URL (paste Google Drive / Notion link)" value={form.resumeUrl} onChange={f('resumeUrl')} placeholder="https://drive.google.com/…" />
      <button style={S.saveBtn} onClick={() => saveSection('hero', form)}>Save Hero</button>
    </div>
  );
}

/* ── Featured Tab ── */
function FeaturedTab({ data, saveSection }) {
  const def = { title: '', description: '', url: '', img: '', tags: [], details: [] };
  const [form, setForm] = useState({ ...def, ...(data.featured || {}) });
  const [newTag, setNewTag] = useState('');

  const f = k => v => setForm(p => ({ ...p, [k]: v }));

  const addTag = () => {
    if (!newTag.trim()) return;
    setForm(p => ({ ...p, tags: [...(p.tags || []), newTag.trim()] }));
    setNewTag('');
  };
  const removeTag = i => setForm(p => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }));

  const updDetail = (i, key, val) => setForm(p => ({ ...p, details: p.details.map((d, idx) => idx === i ? { ...d, [key]: val } : d) }));
  const addDetail = () => setForm(p => ({ ...p, details: [...(p.details || []), { label: '', text: '' }] }));
  const delDetail = i => setForm(p => ({ ...p, details: p.details.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <Field label="Project Title" value={form.title} onChange={f('title')} />
      <Field label="Description" value={form.description} onChange={f('description')} multiline />
      <Field label="Live URL (e.g. https://veycho.in)" value={form.url} onChange={f('url')} />
      <ImageUploadField label="Featured Image" value={form.img} onChange={v => setForm(p => ({ ...p, img: v }))} />

      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Tags</label>
        <div style={S.chipWrap}>
          {(form.tags || []).map((t, i) => (
            <span key={i} style={S.chip}>{t}<button style={S.chipX} onClick={() => removeTag(i)}>×</button></span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Add tag…" value={newTag}
            onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} />
          <button style={S.addBtn} onClick={addTag}>Add</button>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={S.label}>Detail Blocks</label>
          <button style={{ ...S.addBtn, fontSize: 12, padding: '5px 12px' }} onClick={addDetail}>+ Add Block</button>
        </div>
        {(form.details || []).map((d, i) => (
          <div key={i} style={{ ...S.card, marginBottom: 10, position: 'relative' }}>
            <button style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: cl.error, cursor: 'pointer', fontSize: 17 }} onClick={() => delDetail(i)}>×</button>
            <Field label="Label (e.g. THE PROBLEM)" value={d.label} onChange={v => updDetail(i, 'label', v)} />
            <Field label="Text" value={d.text} onChange={v => updDetail(i, 'text', v)} multiline />
          </div>
        ))}
      </div>

      <button style={S.saveBtn} onClick={() => saveSection('featured', form)}>Save Featured</button>
    </div>
  );
}

/* ── Manifesto & Marquee Tab ── */
function ManifestoTab({ data, saveSection, saveMulti }) {
  const [text, setText] = useState(data.manifesto || '');
  const [rows, setRows] = useState({ row1: [], row2: [], ...(data.marquee || {}) });
  const [chipIn, setChipIn] = useState({ r1: '', r2: '' });

  const addChip = (row, val) => {
    if (!val.trim()) return;
    setRows(p => ({ ...p, [row]: [...(p[row] || []), val.trim()] }));
    setChipIn(p => ({ ...p, [row === 'row1' ? 'r1' : 'r2']: '' }));
  };
  const removeChip = (row, i) => setRows(p => ({ ...p, [row]: p[row].filter((_, idx) => idx !== i) }));

  const save = () => saveMulti({ manifesto: text, marquee: rows });

  return (
    <div>
      <div style={S.fieldWrap}>
        <label style={S.label}>Manifesto Text</label>
        <p style={{ color: cl.sub, fontSize: 12, margin: '0 0 8px' }}>
          Wrap words in *asterisks* to give them the orange accent colour. E.g. <code style={{ color: cl.accent }}>I build *full-stack* products</code>
        </p>
        <textarea style={{ ...S.textarea, minHeight: 100 }} value={text} onChange={e => setText(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
        {[{ key: 'row1', label: 'Marquee Row 1 (forward)', inp: 'r1' }, { key: 'row2', label: 'Marquee Row 2 (reverse)', inp: 'r2' }].map(({ key, label, inp }) => (
          <div key={key} style={S.card}>
            <label style={S.label}>{label}</label>
            <div style={S.chipWrap}>
              {(rows[key] || []).map((w, i) => (
                <span key={i} style={S.chip}>{w}<button style={S.chipX} onClick={() => removeChip(key, i)}>×</button></span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input style={{ ...S.input, flex: 1, fontSize: 13 }} placeholder="Add word…" value={chipIn[inp]}
                onChange={e => setChipIn(p => ({ ...p, [inp]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addChip(key, chipIn[inp])} />
              <button style={{ ...S.addBtn, fontSize: 13, padding: '6px 14px' }} onClick={() => addChip(key, chipIn[inp])}>Add</button>
            </div>
          </div>
        ))}
      </div>

      <button style={S.saveBtn} onClick={save}>Save Manifesto & Marquee</button>
    </div>
  );
}

/* ── GitHub Tab ── */
function GitHubTab({ data, saveSection }) {
  const def = { username: '', pinnedRepos: [], languages: [] };
  const [form, setForm] = useState({ ...def, ...(data.github || {}) });
  const [repoModal, setRepoModal] = useState(null);
  const [repoForm, setRepoForm] = useState({});
  const [repoIdx, setRepoIdx] = useState(null);
  const [langModal, setLangModal] = useState(null);
  const [langForm, setLangForm] = useState({});
  const [langIdx, setLangIdx] = useState(null);

  const rf = k => v => setRepoForm(p => ({ ...p, [k]: v }));
  const lf = k => v => setLangForm(p => ({ ...p, [k]: v }));

  const openRepo = (item, i) => { setRepoForm(item ? { ...item } : { name: '', desc: '', href: '', live: false }); setRepoIdx(i ?? null); setRepoModal(i == null ? 'add' : 'edit'); };
  const commitRepo = () => {
    const next = repoModal === 'add' ? [...form.pinnedRepos, repoForm] : form.pinnedRepos.map((r, i) => i === repoIdx ? repoForm : r);
    const updated = { ...form, pinnedRepos: next };
    setForm(updated); saveSection('github', updated); setRepoModal(null);
  };
  const delRepo = i => {
    if (!confirm('Delete?')) return;
    const updated = { ...form, pinnedRepos: form.pinnedRepos.filter((_, idx) => idx !== i) };
    setForm(updated); saveSection('github', updated);
  };

  const openLang = (item, i) => { setLangForm(item ? { ...item } : { lang: '', sub: '', pct: 0, color: '#ffffff' }); setLangIdx(i ?? null); setLangModal(i == null ? 'add' : 'edit'); };
  const commitLang = () => {
    const item = { ...langForm, pct: parseInt(langForm.pct) || 0 };
    const next = langModal === 'add' ? [...form.languages, item] : form.languages.map((l, i) => i === langIdx ? item : l);
    const updated = { ...form, languages: next };
    setForm(updated); saveSection('github', updated); setLangModal(null);
  };
  const delLang = i => {
    if (!confirm('Delete?')) return;
    const updated = { ...form, languages: form.languages.filter((_, idx) => idx !== i) };
    setForm(updated); saveSection('github', updated);
  };

  const saveUsername = () => saveSection('github', form);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <Field label="GitHub Username" value={form.username} onChange={v => setForm(p => ({ ...p, username: v }))} placeholder="mishal4583" />
        </div>
        <button style={{ ...S.saveBtn, marginTop: 22, padding: '10px 16px', flexShrink: 0 }} onClick={saveUsername}>Save</button>
      </div>

      <div style={S.secRow}>
        <div style={S.secTitle}>Pinned Repos ({form.pinnedRepos.length})</div>
        <button style={S.addBtn} onClick={() => openRepo(null, null)}>+ Add Repo</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {form.pinnedRepos.map((r, i) => (
          <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, color: r.live ? cl.accent : cl.sub }}>{r.live ? '◉' : '◈'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: cl.text }}>{r.name}{r.live && <span style={S.liveBadge}>LIVE</span>}</div>
              <div style={{ color: cl.sub, fontSize: 12, marginTop: 2 }}>{r.desc}</div>
            </div>
            <button style={S.editBtn} onClick={() => openRepo(r, i)}>Edit</button>
            <button style={S.delBtn} onClick={() => delRepo(i)}>Del</button>
          </div>
        ))}
      </div>

      <div style={S.secRow}>
        <div style={S.secTitle}>Languages ({form.languages.length})</div>
        <button style={S.addBtn} onClick={() => openLang(null, null)}>+ Add Language</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {form.languages.map((l, i) => (
          <div key={i} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              <div style={{ fontWeight: 700, fontSize: 13, color: cl.text }}>{l.pct}%</div>
            </div>
            <div style={{ fontSize: 13, color: cl.text, fontWeight: 600 }}>{l.lang}</div>
            <div style={{ fontSize: 12, color: cl.sub }}>{l.sub}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button style={{ ...S.editBtn, flex: 1, textAlign: 'center' }} onClick={() => openLang(l, i)}>Edit</button>
              <button style={{ ...S.delBtn, flex: 1, textAlign: 'center' }} onClick={() => delLang(i)}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {repoModal && (
        <Modal title={repoModal === 'add' ? 'Add Pinned Repo' : 'Edit Repo'} onClose={() => setRepoModal(null)}>
          <Field label="Name" value={repoForm.name} onChange={rf('name')} placeholder="repo-name" />
          <Field label="Description" value={repoForm.desc} onChange={rf('desc')} />
          <Field label="URL" value={repoForm.href} onChange={rf('href')} placeholder="https://…" />
          <div style={S.checkWrap}>
            <input type="checkbox" id="repo-live" checked={!!repoForm.live} onChange={e => setRepoForm(p => ({ ...p, live: e.target.checked }))} style={{ width: 16, height: 16, accentColor: cl.accent }} />
            <label htmlFor="repo-live" style={{ color: cl.text, fontSize: 14, cursor: 'pointer' }}>Mark as LIVE</label>
          </div>
          <div style={S.modalActions}>
            <button style={S.modalCancel} onClick={() => setRepoModal(null)}>Cancel</button>
            <button style={S.modalSave} onClick={commitRepo}>Save</button>
          </div>
        </Modal>
      )}

      {langModal && (
        <Modal title={langModal === 'add' ? 'Add Language' : 'Edit Language'} onClose={() => setLangModal(null)}>
          <Field label="Language name" value={langForm.lang} onChange={lf('lang')} placeholder="e.g. Dart" />
          <Field label="Sub-label" value={langForm.sub} onChange={lf('sub')} placeholder="e.g. Flutter" />
          <Field label="Percentage" type="number" value={String(langForm.pct ?? '')} onChange={lf('pct')} />
          <div style={S.fieldWrap}>
            <label style={S.label}>Dot Colour</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={langForm.color || '#ffffff'} onChange={e => setLangForm(p => ({ ...p, color: e.target.value }))} style={{ width: 44, height: 36, borderRadius: 6, border: `1px solid ${cl.border}`, cursor: 'pointer', background: 'none', padding: 2 }} />
              <input style={{ ...S.input, flex: 1 }} value={langForm.color || ''} onChange={e => setLangForm(p => ({ ...p, color: e.target.value }))} placeholder="#54C5F8" />
            </div>
          </div>
          <div style={S.modalActions}>
            <button style={S.modalCancel} onClick={() => setLangModal(null)}>Cancel</button>
            <button style={S.modalSave} onClick={commitLang}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── About Tab ── */
function AboutTab({ data, saveSection }) {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(data.about || { heading: '', paragraphs: [], cards: [] })));

  const updPara = (i, val) => setForm(f => ({ ...f, paragraphs: f.paragraphs.map((p, idx) => idx === i ? val : p) }));
  const addPara = () => setForm(f => ({ ...f, paragraphs: [...f.paragraphs, ''] }));
  const delPara = i => setForm(f => ({ ...f, paragraphs: f.paragraphs.filter((_, idx) => idx !== i) }));

  const updCard = (i, key, val) => setForm(f => ({ ...f, cards: f.cards.map((c, idx) => idx === i ? { ...c, [key]: val } : c) }));
  const addCard = () => setForm(f => ({ ...f, cards: [...f.cards, { label: '', val: '' }] }));
  const delCard = i => setForm(f => ({ ...f, cards: f.cards.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <div style={S.fieldWrap}>
        <label style={S.label}>Heading</label>
        <textarea style={S.textarea} value={form.heading} onChange={e => setForm(f => ({ ...f, heading: e.target.value }))} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={S.label}>Paragraphs</label>
          <button style={{ ...S.addBtn, fontSize: 12, padding: '5px 12px' }} onClick={addPara}>+ Add Paragraph</button>
        </div>
        {form.paragraphs.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <textarea style={{ ...S.textarea, flex: 1, minHeight: 72 }} value={p} onChange={e => updPara(i, e.target.value)} placeholder={`Paragraph ${i + 1}`} />
            <button style={{ ...S.delBtn, alignSelf: 'flex-start', padding: '6px 10px' }} onClick={() => delPara(i)}>×</button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={S.label}>Info Cards</label>
          <button style={{ ...S.addBtn, fontSize: 12, padding: '5px 12px' }} onClick={addCard}>+ Add Card</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {form.cards.map((card, i) => (
            <div key={i} style={{ ...S.card, position: 'relative' }}>
              <button style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: cl.error, cursor: 'pointer', fontSize: 17 }} onClick={() => delCard(i)}>×</button>
              <Field label="Label" value={card.label} onChange={v => updCard(i, 'label', v)} />
              <Field label="Value" value={card.val} onChange={v => updCard(i, 'val', v)} />
            </div>
          ))}
        </div>
      </div>

      <button style={S.saveBtn} onClick={() => saveSection('about', form)}>Save About</button>
    </div>
  );
}

/* ── Contact Tab ── */
function ContactTab({ data, saveSection }) {
  const [form, setForm] = useState({ ...(data.contact || { email: '', phone: '', location: '', github: '', linkedin: '', roles: [] }) });
  const [newRole, setNewRole] = useState('');

  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const addRole = () => {
    if (!newRole.trim()) return;
    setForm(p => ({ ...p, roles: [...(p.roles || []), newRole.trim()] }));
    setNewRole('');
  };
  const removeRole = i => setForm(p => ({ ...p, roles: p.roles.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <Field label="Email" value={form.email} onChange={f('email')} />
      <Field label="Phone" value={form.phone} onChange={f('phone')} />
      <Field label="Location" value={form.location} onChange={f('location')} />
      <Field label="GitHub URL" value={form.github} onChange={f('github')} />
      <Field label="LinkedIn URL" value={form.linkedin} onChange={f('linkedin')} />

      <div style={{ marginBottom: 8 }}>
        <label style={S.label}>Availability Roles</label>
        <div style={S.chipWrap}>
          {(form.roles || []).map((r, i) => (
            <span key={i} style={S.chip}>
              {r}<button style={S.chipX} onClick={() => removeRole(i)}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Add role (e.g. UI/UX Designer)…" value={newRole}
            onChange={e => setNewRole(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRole()} />
          <button style={S.addBtn} onClick={addRole}>Add</button>
        </div>
      </div>

      <button style={S.saveBtn} onClick={() => saveSection('contact', form)}>Save Contact</button>
    </div>
  );
}

/* ── Numbers Tab ── */
function NumbersTab({ data, saveSection }) {
  const [items, setItems] = useState([...(data.numbers || [])]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [editIdx, setEditIdx] = useState(null);

  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const openAdd = () => { setForm({ target: 0, suffix: '', label: '' }); setEditIdx(null); setModal('add'); };
  const openEdit = (item, i) => { setForm({ ...item }); setEditIdx(i); setModal('edit'); };

  const commit = () => {
    const item = { ...form, target: parseInt(form.target) || 0 };
    const next = modal === 'add' ? [...items, item] : items.map((x, i) => i === editIdx ? item : x);
    setItems(next); saveSection('numbers', next); setModal(null);
  };

  const del = i => {
    if (!confirm('Delete this stat?')) return;
    const next = items.filter((_, idx) => idx !== i);
    setItems(next); saveSection('numbers', next);
  };

  return (
    <div>
      <div style={S.secRow}>
        <div style={S.secTitle}>{items.length} Stats</div>
        <button style={S.addBtn} onClick={openAdd}>+ Add Stat</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
        {items.map((s, i) => (
          <div key={i} style={S.card}>
            <div style={{ fontSize: 38, fontWeight: 700, color: cl.accent, lineHeight: 1 }}>{s.target}{s.suffix}</div>
            <div style={{ color: cl.sub, fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              <button style={{ ...S.editBtn, flex: 1, textAlign: 'center' }} onClick={() => openEdit(s, i)}>Edit</button>
              <button style={{ ...S.delBtn, flex: 1, textAlign: 'center' }} onClick={() => del(i)}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Stat' : 'Edit Stat'} onClose={() => setModal(null)}>
          <Field label="Number *" type="number" value={String(form.target ?? '')} onChange={f('target')} />
          <Field label="Suffix (e.g. + or leave empty)" value={form.suffix} onChange={f('suffix')} placeholder="+" />
          <Field label="Label" value={form.label} onChange={f('label')} placeholder="e.g. Projects shipped" />
          <div style={S.modalActions}>
            <button style={S.modalCancel} onClick={() => setModal(null)}>Cancel</button>
            <button style={S.modalSave} onClick={commit}>Save Stat</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Tabs config ── */
const TABS = [
  { id: 'projects',  label: 'Projects' },
  { id: 'certs',     label: 'Certifications' },
  { id: 'path',      label: 'Experience & Edu' },
  { id: 'stack',     label: 'Tech Stack' },
  { id: 'hero',      label: 'Hero' },
  { id: 'about',     label: 'About' },
  { id: 'contact',   label: 'Contact' },
  { id: 'numbers',   label: 'Numbers / Stats' },
  { id: 'featured',  label: 'Featured Project' },
  { id: 'manifesto', label: 'Manifesto & Marquee' },
  { id: 'github',    label: 'GitHub' },
];

/* ── Main Admin Page ── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [data, setData]     = useState(null);
  const [tab, setTab]       = useState('projects');
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState(null);

  /* Persist auth in localStorage */
  useEffect(() => {
    if (localStorage.getItem('portfolio-admin') === ADMIN_PASS) setAuthed(true);
  }, []);

  /* Load data once authed */
  useEffect(() => {
    if (!authed) return;
    fetch('/api/portfolio').then(r => r.json()).then(setData).catch(() => showToast('Failed to load data', 'error'));
  }, [authed]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveFull = async (newData) => {
    setSaving(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || `HTTP ${res.status}`);
      setData(newData);
      showToast('Saved!');
    } catch (e) {
      showToast(e.message || 'Save failed', 'error');
    }
    setSaving(false);
  };

  /* Each tab calls this with (sectionKey, newSectionValue) */
  const saveSection = (key, val) => saveFull({ ...data, [key]: val });
  const saveMulti   = (updates)  => saveFull({ ...data, ...updates });

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: cl.bg, color: cl.text, fontFamily: 'sans-serif', fontSize: 15 }}>
        Loading portfolio data…
      </div>
    );
  }

  const tabProps = { data, saveSection };

  return (
    <>
      {/* Reset global styles for admin */}
      <style>{`body{margin:0;padding:0;background:${cl.bg}!important;} *{box-sizing:border-box;}`}</style>

      <div style={S.wrap}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.sidebarLogo}>
            <div style={S.sidebarM}>M</div>
            <div>
              <div style={S.sidebarTitle}>Portfolio</div>
              <div style={S.sidebarSub}>Admin CMS</div>
            </div>
          </div>
          <nav style={S.sidebarNav}>
            {TABS.map(t => (
              <button
                key={t.id}
                style={{ ...S.navBtn, ...(tab === t.id ? S.navBtnActive : {}) }}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div style={S.sidebarFoot}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={S.viewSiteLink}>View Portfolio ↗</a>
            <button style={S.logoutBtn} onClick={() => { localStorage.removeItem('portfolio-admin'); setAuthed(false); }}>
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={S.main}>
          <div style={S.topBar}>
            <div style={S.topTitle}>{TABS.find(t => t.id === tab)?.label}</div>
            {saving && <div style={S.savingBadge}>Saving…</div>}
          </div>
          <div style={S.content}>
            {tab === 'projects'  && <ProjectsTab   {...tabProps} />}
            {tab === 'certs'     && <CertsTab      {...tabProps} />}
            {tab === 'path'      && <PathTab        {...tabProps} />}
            {tab === 'stack'     && <StackTab       {...tabProps} />}
            {tab === 'hero'      && <HeroTab        {...tabProps} />}
            {tab === 'about'     && <AboutTab       {...tabProps} />}
            {tab === 'contact'   && <ContactTab     {...tabProps} />}
            {tab === 'numbers'   && <NumbersTab     {...tabProps} />}
            {tab === 'featured'  && <FeaturedTab    {...tabProps} />}
            {tab === 'manifesto' && <ManifestoTab   {...tabProps} saveMulti={saveMulti} />}
            {tab === 'github'    && <GitHubTab      {...tabProps} />}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{ ...S.toast, ...(toast.type === 'error' ? S.toastErr : {}) }}>
          {toast.type === 'success' ? '✓ ' : '✕ '}{toast.msg}
        </div>
      )}
    </>
  );
}
