import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, GraduationCap, Trash2, X, BookOpen, Target } from 'lucide-react';
import { EXAM_TRACKS, SUBJECTS } from '../../data/mock';
import { toast } from 'sonner';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const STATUS = ['Active', 'On hold', 'Completed'];

export default function MyCourses() {
  const { state, addCourse, removeCourse, updateCourse } = useApp();
  const courses = state.courses || [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', exam: state.user?.examTrack || 'SSLC', subject: '', target: '', level: 'Intermediate', status: 'Active' });

  const subjects = SUBJECTS[form.exam] || [];

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Enter a course name'); return; }
    addCourse({ ...form, name: form.name.trim() });
    toast.success('Course added');
    setOpen(false);
    setForm({ name: '', exam: state.user?.examTrack || 'SSLC', subject: '', target: '', level: 'Intermediate', status: 'Active' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-[14px] text-slate-500">Track every course you are studying. Add a new course or manage existing ones.</p>
        <button onClick={() => setOpen(true)} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium">
          <Plus className="w-4 h-4" /> Add course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-12 text-center bg-white">
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-[15.5px] font-semibold text-slate-900">No courses yet</div>
          <p className="text-[13.5px] text-slate-500 mt-1 max-w-[420px] mx-auto">Add your first course to start building a personalized study plan. You can track multiple courses across exam tracks.</p>
          <button onClick={() => setOpen(true)} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium mt-6">
            <Plus className="w-4 h-4" /> Add your first course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="card-soft p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-block px-2 py-0.5 text-[10.5px] font-semibold rounded-md bg-violet-100 text-violet-700 mb-2">{(EXAM_TRACKS.find((e) => e.id === c.exam) || {}).name || c.exam}</span>
                  <div className="text-[15.5px] font-semibold text-slate-900 leading-tight">{c.name}</div>
                  {c.subject && <div className="text-[12.5px] text-slate-500 mt-1">{c.subject}</div>}
                </div>
                <button onClick={() => { removeCourse(c.id); toast.success('Course removed'); }} className="w-8 h-8 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors" aria-label="Remove course">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-slate-100 px-2.5 py-2">
                  <div className="text-[9.5px] tracking-wider uppercase font-semibold text-slate-500">Target</div>
                  <div className="text-[12.5px] text-slate-800 font-medium mt-0.5">{c.target || '—'}</div>
                </div>
                <div className="rounded-md border border-slate-100 px-2.5 py-2">
                  <div className="text-[9.5px] tracking-wider uppercase font-semibold text-slate-500">Level</div>
                  <div className="text-[12.5px] text-slate-800 font-medium mt-0.5">{c.level}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <select value={c.status} onChange={(e) => updateCourse(c.id, { status: e.target.value })}
                  className={`text-[12px] font-medium rounded-md px-2 py-1 border transition-colors ${c.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : c.status === 'Completed' ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="text-[11.5px] text-slate-500">Added {new Date(c.addedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-[520px] bg-white rounded-2xl border border-[color:var(--color-border)] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.3)] overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[color:var(--color-border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center"><BookOpen className="w-4 h-4" /></div>
                <div className="text-[15px] font-semibold text-slate-900">Add a course</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <Field label="Course name">
                <input className="input-base" placeholder="e.g., IB Physics HL" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Exam track">
                  <select className="input-base" value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value, subject: '' })}>
                    {EXAM_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </Field>
                <Field label="Subject (optional)">
                  <select className="input-base" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    <option value="">None</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Target grade / score">
                  <input className="input-base" placeholder="e.g., 7 or A* or 1400" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                </Field>
                <Field label="Level">
                  <select className="input-base" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Status">
                <div className="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
                  {STATUS.map((s) => (
                    <button type="button" key={s} onClick={() => setForm({ ...form, status: s })} className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${form.status === s ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>{s}</button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="px-6 py-4 border-t border-[color:var(--color-border)] flex items-center justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-outline-dark px-4 py-2 rounded-lg text-[13.5px]">Cancel</button>
              <button type="submit" className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium">
                <Target className="w-4 h-4" /> Add course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}
