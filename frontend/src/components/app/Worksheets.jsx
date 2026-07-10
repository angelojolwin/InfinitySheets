import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS, TOPICS, QUESTION_BANK, EXAM_DURATIONS } from '../../data/mock';
import { Check, X, Clock, ChevronLeft, ChevronRight, Sparkles, FileText, AlertCircle, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { playComplete } from '../../utils/sound';

const ANSWER_TYPES = ['Multiple choice', 'Typed response', 'Exam style'];
const DIFFICULTIES = ['Easy', 'Medium', 'Exam level', 'Hard'];
const DURATION_MIN = 5;
const DURATION_MAX = 240;
const DURATION_STEP = 5;
const QUESTION_COUNT_MIN = 3;
const QUESTION_COUNT_MAX = 30;

/* ================== Normalization + grading helpers ================== */

function normalizeText(s) {
  return (s || '')
    .toString()
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[^a-z0-9\s\.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function gradeTyped(userAnswer, expected, aliases = []) {
  const u = normalizeText(userAnswer);
  if (!u) return false;
  const candidates = [expected, ...(aliases || [])].map(normalizeText).filter(Boolean);
  if (!candidates.length) return false;
  // Exact match after normalization, or containment — but only when the
  // contained string is substantial. Without the length guards a single
  // typed letter that happens to appear in the expected answer (or a long
  // ramble containing one short expected word) was graded correct.
  return candidates.some((c) => {
    if (u === c) return true;
    // Full expected answer appears inside what the student typed.
    if (c.length >= 4 && u.includes(c)) return true;
    // Student typed most of the expected answer (short answers only).
    if (u.length >= 4 && u.length >= Math.ceil(c.length * 0.6) && c.includes(u)) return true;
    return false;
  });
}

function gradeExamStyle(userAnswer, keywords = []) {
  const kw = (keywords || []).map(normalizeText).filter(Boolean);
  if (!kw.length) return null; // not gradable → treat as ungraded (won't count as mistake)
  const u = normalizeText(userAnswer);
  if (!u) return false;
  const hit = kw.filter((k) => u.includes(k)).length;
  // Pass threshold: at least half of the keywords must appear.
  return hit / kw.length >= 0.5;
}

/* ================== Question shaping ================== */

// Convert a raw MCQ pool item into a question of the requested answer type.
function toAnswerType(base, answerType) {
  if (answerType === 'Multiple choice') {
    return { ...base, answerType };
  }
  if (answerType === 'Typed response') {
    // Use the correct MCQ option text as the expected typed answer.
    const expected = base.options ? base.options[base.a] : '';
    return {
      ...base,
      answerType,
      typedAnswer: expected,
      typedAliases: [],
      // Keep options so we can still display correct answer on results screen.
    };
  }
  // Exam style
  const expected = base.options ? base.options[base.a] : '';
  const keywords = Array.from(new Set(
    normalizeText(expected).split(' ').filter((w) => w.length >= 3)
  )).slice(0, 4);
  return {
    ...base,
    answerType,
    examAnswer: expected,
    examKeywords: keywords,
  };
}

function safeQuestionCount(value) {
  const rounded = Math.round(Number(value));
  if (!Number.isFinite(rounded)) return 10;
  return Math.max(QUESTION_COUNT_MIN, Math.min(QUESTION_COUNT_MAX, rounded));
}

function fallbackQuestion(topic, index) {
  const label = topic || 'this topic';
  // Stagger the template sequence per topic so two topics without custom
  // questions don't ask the identical series in the same order.
  const topicOffset = (topic || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const templates = [
    {
      q: `Which study method gives the strongest evidence that you understand ${label}?`,
      options: ['Rereading the heading', 'Solving a new problem and explaining the reasoning', 'Highlighting every sentence', 'Memorizing one example without testing it'],
      a: 1,
    },
    {
      q: `What should you do first when a ${label} question feels unfamiliar?`,
      options: ['Skip it immediately', 'Identify the known information and concept being tested', 'Copy the longest formula you remember', 'Choose the most detailed-looking option'],
      a: 1,
    },
    {
      q: `Which mistake is most likely to reduce accuracy in ${label}?`,
      options: ['Writing one clear working step', 'Answering before checking what the question is asking', 'Reviewing the final unit or wording', 'Comparing the answer with the given data'],
      a: 1,
    },
    {
      q: `What is the best next step after missing a ${label} question?`,
      options: ['Ignore it if the score was acceptable', 'Review the error, retry a similar question, then record the weak point', 'Only reread the chapter title', 'Delete the result from your history'],
      a: 1,
    },
    {
      q: `How should you prove you are improving at ${label}?`,
      options: ['Count how long the notes are', 'Track scores across repeated worksheets on the topic', 'Only measure how confident you feel', 'Avoid timed or mixed practice forever'],
      a: 1,
    },
    {
      q: `When revising ${label} the night before an exam, what deserves the most time?`,
      options: ['Topics you already score highly on', 'The questions and question styles you keep missing', 'Rewriting your notes in neater handwriting', 'Reading the entire textbook chapter once more'],
      a: 1,
    },
    {
      q: `A friend says they "understand ${label} but lose marks anyway." What is the most likely cause?`,
      options: ['The topic is impossible to score in', 'They have not practised answering in the exam format and timing', 'They study at the wrong time of day', 'Their pen is too slow'],
      a: 1,
    },
    {
      q: `What makes a practice session on ${label} most effective?`,
      options: ['Doing it with the textbook open the whole time', 'Attempting questions first, then checking and correcting against the answers', 'Only attempting questions you are sure about', 'Stopping as soon as one answer is right'],
      a: 1,
    },
    {
      q: `Which habit best prevents forgetting ${label} before the exam?`,
      options: ['One long cram session the week you learn it', 'Short, spaced practice sessions returning to the topic over several weeks', 'Copying a classmate’s summary once', 'Watching videos without attempting questions'],
      a: 1,
    },
    {
      q: `You have 20 minutes for ${label} today. What is the highest-value use of it?`,
      options: ['Reorganizing your folder', 'A short timed set of questions followed by reviewing every mistake', 'Rereading yesterday’s notes start to finish', 'Making a new colour-coded timetable'],
      a: 1,
    },
  ];
  return templates[(index + topicOffset) % templates.length];
}

function buildQuestions({ topics, answerType, difficulty, length, pastPapers, aiGenerated, pastPaperPool }) {
  const list = (topics && topics.length) ? topics : [];
  const safeLength = safeQuestionCount(length);
  // Past-paper questions matching selected topics + answer type.
  const ppMatching = (pastPaperPool || []).filter((p) => list.includes(p.topic) && p.answerType === answerType);
  // Filter by difficulty if it matches; otherwise still include.
  const preferPP = pastPapers && ppMatching.length > 0;
  const preferAI = !!aiGenerated;

  // Track how many questions each topic has produced and which question
  // texts are already on the sheet, so small pools overflow into varied
  // fallback templates instead of repeating the same question.
  const perTopicCount = {};
  const usedTexts = new Set();
  const aiPool = (i) => {
    const t = list.length ? list[i % list.length] : null;
    const key = t || '_';
    const n = perTopicCount[key] || 0;
    perTopicCount[key] = n + 1;
    const pool = (t && QUESTION_BANK[t]) || [];
    let base = n < pool.length ? pool[n] : fallbackQuestion(t, n - pool.length);
    // If this exact question is somehow already on the sheet, walk the
    // fallback templates until we find an unused one.
    let guard = 0;
    while (usedTexts.has(base.q) && guard < 12) {
      base = fallbackQuestion(t, n - pool.length + ++guard);
    }
    usedTexts.add(base.q);
    return toAnswerType({ ...base, _topic: t, difficulty, source: 'ai-generated' }, answerType);
  };
  const ppPool = (i) => {
    if (!ppMatching.length) return null;
    const base = ppMatching[i % ppMatching.length];
    // Normalize shape so it matches AI-shape.
    const shaped = { ...base, _topic: base.topic, source: 'past-paper' };
    // Ensure options+a exist for MCQ, typedAnswer for typed, examKeywords for exam.
    return shaped;
  };

  const out = [];
  for (let i = 0; i < safeLength; i++) {
    let picked = null;
    if (preferPP && preferAI) {
      picked = (i % 2 === 0) ? ppPool(Math.floor(i / 2)) : aiPool(i);
    } else if (preferPP) {
      picked = ppPool(i);
    } else if (preferAI) {
      picked = aiPool(i);
    }
    if (!picked) picked = aiPool(i);
    out.push(picked);
  }
  return out;
}

function fmtDuration(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

/* ================== Main component ================== */

export default function Worksheets({ go, linkParams = {} }) {
  const { state, recordWorksheet } = useApp();
  // Deep-link parameters (#worksheets?subject=..&topics=..&difficulty=..&type=..&duration=..)
  const link = useMemo(() => ({
    subject: linkParams.subject ? decodeURIComponent(linkParams.subject) : null,
    topics: linkParams.topics ? decodeURIComponent(linkParams.topics).split(',').filter(Boolean) : null,
    difficulty: linkParams.difficulty ? decodeURIComponent(linkParams.difficulty) : null,
    answerType: linkParams.type ? decodeURIComponent(linkParams.type) : null,
    duration: linkParams.duration ? parseInt(linkParams.duration, 10) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);
  const track = state.user?.examTrack || 'SSLC';
  const examMinutes = EXAM_DURATIONS[track] || 60;

  // Only past-paper questions from the learner's own exam-track. Uploads
  // without a board attached remain visible to everyone.
  const pastPaperPool = useMemo(() => {
    return (state.pastPapers || []).filter((p) => !p.board || p.board === track);
  }, [state.pastPapers, track]);

  // Only subjects the user has actually chosen (from onboarding / courses).
  // Includes any subject on a custom course too, so custom subjects show up
  // in the picker.
  const allTrackSubjects = useMemo(() => SUBJECTS[track] || [], [track]);
  const customSubjectTopics = useMemo(() => {
    // Map<subject, topics[]> for custom courses.
    const m = {};
    (state.courses || []).forEach((c) => {
      const subs = Array.isArray(c.subjects) ? c.subjects : [];
      subs.forEach((s) => {
        if (s && s.subject && Array.isArray(s.topics) && s.topics.length && !m[s.subject]) {
          m[s.subject] = s.topics;
        }
      });
    });
    return m;
  }, [state.courses]);

  const chosenSubjects = useMemo(() => {
    const fromUser = state.user?.subjects || [];
    const fromCourses = [];
    (state.courses || []).forEach((c) => {
      const subs = Array.isArray(c.subjects) ? c.subjects.map((x) => x.subject) : [c.subject];
      subs.forEach((s) => { if (s && !fromCourses.includes(s)) fromCourses.push(s); });
    });
    // Standard-track subjects + any custom-course subjects (even if not on the track).
    const merged = Array.from(new Set([...fromUser, ...fromCourses])).filter((s) => allTrackSubjects.includes(s) || customSubjectTopics[s]);
    return merged.length ? merged : allTrackSubjects;
  }, [state.user?.subjects, state.courses, allTrackSubjects, customSubjectTopics]);

  const topicsForSubject = (s) => (customSubjectTopics[s] || TOPICS[s] || []);

  const preselect = typeof window !== 'undefined' ? window.sessionStorage.getItem('preselect_subject') : null;
  const preselectTopic = typeof window !== 'undefined' ? window.sessionStorage.getItem('preselect_topic') : null;

  const [subject, setSubject] = useState(() => {
    if (link.subject && chosenSubjects.includes(link.subject)) return link.subject;
    if (preselect && chosenSubjects.includes(preselect)) return preselect;
    return chosenSubjects[0] || '';
  });
  const topicsList = topicsForSubject(subject);
  const [topics, setTopics] = useState(() => {
    if (link.topics) {
      const valid = link.topics.filter((t) => topicsList.includes(t));
      if (valid.length) return valid;
    }
    if (preselectTopic && topicsList.includes(preselectTopic)) return [preselectTopic];
    return topicsList.length ? [topicsList[0]] : [];
  });

  const [answerType, setAnswerType] = useState(() => ANSWER_TYPES.includes(link.answerType) ? link.answerType : 'Multiple choice');
  const [difficulty, setDifficulty] = useState(() => DIFFICULTIES.includes(link.difficulty) ? link.difficulty : 'Medium');
  const [duration, setDuration] = useState(() => {
    if (Number.isFinite(link.duration) && link.duration >= DURATION_MIN && link.duration <= DURATION_MAX) return link.duration;
    return examMinutes;
  });
  const [pastPapers, setPastPapers] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(true);

  const [stage, setStage] = useState('build');

  // "New worksheet" / sidebar clicks while already on this route should
  // reset back to the builder instead of silently doing nothing.
  useEffect(() => {
    const onRepeat = (e) => {
      if (e.detail === 'worksheets') { setStage('build'); setResult(null); }
    };
    window.addEventListener('same-route-nav', onRepeat);
    return () => window.removeEventListener('same-route-nav', onRepeat);
  }, []);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]); // holds number (MCQ index) or string (typed/exam)
  const [current, setCurrent] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);

  // Reset topics when the subject actually changes — comparing against the
  // previous subject (rather than a mount flag) keeps deep-linked topic
  // selections intact even under StrictMode's double-invoked effects.
  const prevSubject = React.useRef(subject);
  useEffect(() => {
    if (prevSubject.current === subject) return;
    prevSubject.current = subject;
    const t = topicsForSubject(subject);
    setTopics(t.length ? [t[0]] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  useEffect(() => {
    if (preselect) window.sessionStorage.removeItem('preselect_subject');
    if (preselectTopic) window.sessionStorage.removeItem('preselect_topic');
  }, [preselect, preselectTopic]);

  useEffect(() => {
    if (stage !== 'take') return;
    if (timeLeft <= 0) { finalize(); return; }
    const id = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timeLeft]);

  const toggleTopic = (t) => {
    setTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  // Count of admin-uploaded past-paper questions matching current filters.
  const ppAvailable = useMemo(() => {
    return (pastPaperPool || []).filter((p) => topics.includes(p.topic) && p.answerType === answerType).length;
  }, [pastPaperPool, topics, answerType]);

  const start = () => {
    if (!subject) { toast.error('Select a subject'); return; }
    if (!topics.length) { toast.error('Select at least one topic'); return; }
    if (!pastPapers && !aiGenerated) { toast.error('Pick past papers, AI generated, or both'); return; }
    if (pastPapers && !aiGenerated && ppAvailable === 0) {
      toast.error('No past-paper questions match this selection. Ask an admin to upload some, or also tick AI generated.');
      return;
    }
    const length = safeQuestionCount(duration / 3);
    const qs = buildQuestions({ topics, answerType, difficulty, length, pastPapers, aiGenerated, pastPaperPool });
    if (!qs.length) {
      toast.error('Could not create questions for this worksheet. Pick another topic or source.');
      return;
    }
    setQuestions(qs);
    // For MCQ, -1 means unanswered. For typed/exam, empty string.
    setAnswers(new Array(qs.length).fill(answerType === 'Multiple choice' ? -1 : ''));
    setCurrent(0);
    setStartTime(Date.now());
    setTimeLeft(duration * 60);
    setStage('take');
  };

  const gradeOne = (q, given) => {
    if (q.answerType === 'Multiple choice') {
      return given === q.a;
    }
    if (q.answerType === 'Typed response') {
      return gradeTyped(given, q.typedAnswer, q.typedAliases || []);
    }
    // Exam style
    const graded = gradeExamStyle(given, q.examKeywords || []);
    // If not gradable (no keywords), give credit for any non-empty response.
    if (graded === null) return !!(given && given.toString().trim());
    return graded;
  };

  const finalize = () => {
    if (!questions.length) {
      toast.error('This worksheet has no questions. Create a new worksheet before submitting.');
      setStage('build');
      return;
    }
    const results = questions.map((q, i) => gradeOne(q, answers[i]));
    const correct = results.filter(Boolean).length;
    const total = questions.length;
    const durationSec = Math.round((Date.now() - startTime) / 1000);
    const sheet = {
      id: `ws_${Date.now()}`,
      subject,
      topic: topics.join(', '),
      topics,
      difficulty,
      length: total,
      answerType,
      duration,
      pastPapers,
      aiGenerated,
      questions,
      answers,
      results,
      total,
      correct,
      score: Math.round((correct / total) * 100),
      durationSec,
      date: new Date().toISOString(),
    };
    recordWorksheet(sheet);
    setResult(sheet);
    setStage('result');
    if (state.settings?.sound === true) { try { playComplete(sheet.score); } catch { /* audio unavailable */ } }
  };

  // Shareable deep link reproducing this exact worksheet setup.
  const shareLink = () => {
    const params = new URLSearchParams();
    params.set('subject', subject);
    params.set('topics', topics.join(','));
    params.set('difficulty', difficulty);
    params.set('type', answerType);
    params.set('duration', String(duration));
    const url = `${window.location.origin}${window.location.pathname}#worksheets?${params.toString()}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success('Link copied — anyone who opens it gets this exact worksheet setup'),
      () => toast.error('Could not copy the link'),
    );
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const setAnswerAt = (idx, value) => {
    setAnswers((prev) => {
      const c = [...prev];
      c[idx] = value;
      return c;
    });
  };

  // Keyboard shortcuts while taking a worksheet:
  //   A / B / C / D → pick that MCQ option
  //   1 / 2 / 3 / 4 → same, using numbers
  //   → / Enter / Space → next question (or submit on last)
  //   ← / Backspace → previous question
  // Ignored while typing in an input/textarea (Typed / Exam-style).
  // Disabled entirely when the user turns off shortcuts in Settings.
  const shortcutsEnabled = state.settings?.keyboardShortcuts !== false;
  useEffect(() => {
    if (stage !== 'take') return;
    if (!shortcutsEnabled) return;
    const handler = (e) => {
      const target = e.target;
      const tag = (target && target.tagName) || '';
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || (target && target.isContentEditable);
      if (isEditable) return;
      const q = questions[current];
      if (!q) return;
      if (q.answerType === 'Multiple choice') {
        const key = (e.key || '').toLowerCase();
        // Letter A-Z or digit 1-9.
        let idx = -1;
        if (/^[a-z]$/.test(key)) idx = key.charCodeAt(0) - 97;
        else if (/^[1-9]$/.test(key)) idx = parseInt(key, 10) - 1;
        const opts = q.options || [];
        if (idx >= 0 && idx < opts.length) {
          e.preventDefault();
          setAnswerAt(current, idx);
          return;
        }
      }
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        if (current < questions.length - 1) setCurrent((c) => c + 1);
        else finalize();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        if (current > 0) { e.preventDefault(); setCurrent((c) => c - 1); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, current, questions, shortcutsEnabled]);

  /* ================== Take stage ================== */
  if (stage === 'take') {
    const q = questions[current];
    const isMCQ = q.answerType === 'Multiple choice';
    const isTyped = q.answerType === 'Typed response';
    const isExam = q.answerType === 'Exam style';
    return (
      <div className="max-w-[820px]">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[13px] text-zinc-500">{subject} · {topics.join(' · ')}</div>
          <div className="inline-flex items-center gap-2 text-[13px] text-zinc-700 bg-blue-50 px-3 py-1.5 rounded-md">
            <Clock className="w-3.5 h-3.5" /> {fmtTime(timeLeft)}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6">
          <div className="text-[12px] text-zinc-500 mb-2 flex items-center gap-2">
            <span>Question {current + 1} of {questions.length}{q._topic ? ` · ${q._topic}` : ''}</span>
            {q.source === 'past-paper' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                <FileText className="w-3 h-3" /> Past paper{q.year ? ` · ${q.year}` : ''}
              </span>
            )}
            {q.source === 'ai-generated' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-semibold">
                <Sparkles className="w-3 h-3" /> AI generated
              </span>
            )}
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden mb-5">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
          <h3 className="text-[18px] font-semibold mb-5 leading-snug">{q.q}</h3>

          {isMCQ && (
            <>
              <div className="flex flex-col gap-2.5">
                {(q.options || []).map((opt, i) => (
                  <button key={`${q.q}-${i}`}
                    onClick={() => setAnswerAt(current, i)}
                    className={`text-left px-4 py-3 rounded-lg border text-[14px] transition-colors ${answers[current] === i ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}>
                    <span className="inline-block w-6 text-zinc-500 font-medium">{String.fromCharCode(65 + i)}.</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
              {shortcutsEnabled && (
                <div className="text-[11.5px] text-slate-500 mt-3">
                  Tip: press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10.5px] font-mono">A</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10.5px] font-mono">{String.fromCharCode(64 + Math.max(2, (q.options || []).length))}</kbd> on your keyboard to pick an answer, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10.5px] font-mono">→</kbd> to advance.
                </div>
              )}
            </>
          )}

          {isTyped && (
            <div>
              <input
                type="text"
                autoFocus
                value={answers[current] || ''}
                onChange={(e) => setAnswerAt(current, e.target.value)}
                placeholder="Type your answer"
                className="input-base w-full text-[14px]"
                data-testid={`typed-input-${current}`}
              />
              <div className="text-[11.5px] text-slate-500 mt-2">Answers are checked with lenient matching (case, punctuation, extra words are ignored).</div>
            </div>
          )}

          {isExam && (
            <div>
              <textarea
                autoFocus
                rows={6}
                value={answers[current] || ''}
                onChange={(e) => setAnswerAt(current, e.target.value)}
                placeholder="Write a full exam-style response. Include the key ideas the examiner is looking for."
                className="input-base w-full text-[14px]"
                data-testid={`exam-input-${current}`}
              />
              {(q.examKeywords || []).length > 0 && (
                <div className="text-[11.5px] text-slate-500 mt-2">Graded on presence of key ideas from the mark scheme.</div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className="btn-outline-dark inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={finalize} className="btn-violet inline-flex items-center px-5 py-2 rounded-lg text-[13.5px] font-medium">Submit worksheet</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ================== Result stage ================== */
  if (stage === 'result' && result) {
    return (
      <div className="max-w-[820px]">
        <div className="rounded-2xl border border-zinc-200 p-6 mb-5">
          <div className="eyebrow-muted mb-1">Worksheet complete</div>
          <div className="flex items-end justify-between">
            <h2 className="text-[26px] font-semibold tracking-tight">{result.score}% · {result.correct}/{result.total} correct</h2>
            <div className="text-[13px] text-zinc-500">{result.subject} · {result.topic}</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-zinc-100 overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${result.score}%` }} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {result.questions.map((q, i) => {
            const ok = result.results ? result.results[i] : (result.answers[i] === q.a);
            const isMCQ = q.answerType === 'Multiple choice';
            const isTyped = q.answerType === 'Typed response';
            const isExam = q.answerType === 'Exam style';
            const given = result.answers[i];
            return (
              <div key={`${q.q}-${i}`} className={`rounded-xl border p-4 ${ok ? 'border-zinc-200' : 'border-rose-200 bg-rose-50/40'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-zinc-900">{i + 1}. {q.q}</div>
                    {isMCQ && (
                      <>
                        <div className="text-[13px] text-zinc-600 mt-1">Correct: <span className="font-medium text-zinc-800">{q.options[q.a]}</span></div>
                        {!ok && given !== -1 && (
                          <div className="text-[13px] text-rose-600 mt-0.5">Your answer: {q.options[given]}</div>
                        )}
                      </>
                    )}
                    {isTyped && (
                      <>
                        <div className="text-[13px] text-zinc-600 mt-1">Expected: <span className="font-medium text-emerald-700">{q.typedAnswer || (q.options ? q.options[q.a] : '')}</span></div>
                        <div className={`text-[13px] mt-0.5 ${ok ? 'text-slate-600' : 'text-rose-600'}`}>Your answer: {given || <span className="italic text-slate-400">(blank)</span>}</div>
                      </>
                    )}
                    {isExam && (
                      <>
                        {(q.examKeywords || []).length > 0 && (
                          <div className="text-[13px] text-zinc-600 mt-1">Key ideas: <span className="font-medium text-slate-800">{(q.examKeywords || []).join(', ')}</span></div>
                        )}
                        {q.examAnswer && (
                          <div className="text-[13px] text-zinc-600 mt-0.5">Model answer: <span className="font-medium text-slate-800">{q.examAnswer}</span></div>
                        )}
                        <div className={`text-[13px] mt-0.5 whitespace-pre-wrap ${ok ? 'text-slate-600' : 'text-rose-600'}`}>Your answer: {given || <span className="italic text-slate-400">(blank)</span>}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={() => { setStage('build'); setResult(null); }} className="btn-violet px-4 py-2 rounded-lg text-[14px] font-medium">Create another</button>
          <button onClick={shareLink} className="btn-outline-dark inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium">
            <Link2 className="w-4 h-4" /> Challenge a friend
          </button>
          <button onClick={() => go('dashboard')} className="btn-outline-dark px-4 py-2 rounded-lg text-[14px] font-medium">Back to dashboard</button>
        </div>
      </div>
    );
  }

  /* ================== Build stage ================== */
  const isDurationDefault = duration === examMinutes;

  return (
    <div className="max-w-[820px]">
      <p className="text-[14px] text-zinc-500 mb-6">Create targeted practice. Choose a subject you&apos;re studying, pick one or more topics, and dial in the format.</p>
      <div className="rounded-2xl border border-zinc-200 p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Subject">
            <select className="input-base" value={subject} onChange={(e) => setSubject(e.target.value)} data-testid="ws-subject">
              {chosenSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {chosenSubjects.length < allTrackSubjects.length && (
              <div className="text-[11px] text-slate-500 mt-1">Only showing subjects from your courses.</div>
            )}
          </Field>
          <Field label="Answer type">
            <Segmented value={answerType} onChange={setAnswerType} options={ANSWER_TYPES} />
          </Field>
        </div>

        <Field label={`Topics (${topics.length} selected)`}>
          {topicsList.length === 0 ? (
            <div className="text-[13px] text-slate-500 italic">No topics available for this subject yet.</div>
          ) : (
            <div className="flex flex-wrap gap-2" data-testid="ws-topics">
              {topicsList.map((t) => {
                const sel = topics.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTopic(t)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium border transition-colors ${sel ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-zinc-200 bg-white text-slate-700 hover:bg-slate-100'}`}
                  >
                    {sel && <Check className="w-3.5 h-3.5" />}
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </Field>

        <Field label="Difficulty">
          <Segmented value={difficulty} onChange={setDifficulty} options={DIFFICULTIES} />
        </Field>

        <Field label={`Duration · ${fmtDuration(duration)}${isDurationDefault ? ' (real exam length)' : ''}`}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={DURATION_MIN}
              max={DURATION_MAX}
              step={DURATION_STEP}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="flex-1 accent-blue-600"
              data-testid="ws-duration"
            />
            <button
              type="button"
              onClick={() => setDuration(examMinutes)}
              className="text-[11.5px] font-medium text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap"
              title="Reset to real exam length"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span>{fmtDuration(DURATION_MIN)}</span>
            <span>{fmtDuration(DURATION_MAX)}</span>
          </div>
        </Field>

        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-zinc-500 mb-2">Question source</div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <CheckboxCard
              label={<span>Past paper questions <span className="text-slate-500 font-normal">({ppAvailable} available)</span></span>}
              icon={<FileText className="w-4 h-4 text-slate-600" />}
              checked={pastPapers}
              onChange={setPastPapers}
              testid="ws-past-papers"
            />
            <CheckboxCard
              label={<>&#x2728; AI generated questions</>}
              icon={<Sparkles className="w-4 h-4 text-blue-700" />}
              checked={aiGenerated}
              onChange={setAiGenerated}
              testid="ws-ai-generated"
            />
          </div>
          {pastPapers && ppAvailable === 0 && (
            <div className="text-[11.5px] text-amber-700 mt-2 inline-flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> No past-paper questions match this subject / topic / answer type. Uploads live on the Admin page.</div>
          )}
          {!pastPapers && !aiGenerated && (
            <div className="text-[11.5px] text-rose-600 mt-2">Pick at least one question source.</div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={start} data-testid="ws-start" className="btn-violet px-5 py-3 rounded-lg text-[14px] font-medium">Create interactive worksheet</button>
        <button onClick={shareLink} data-testid="ws-share-link" className="btn-outline-dark inline-flex items-center gap-1.5 px-4 py-3 rounded-lg text-[14px] font-medium" title="Copy a link that opens this exact setup">
          <Link2 className="w-4 h-4" /> Copy share link
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

function Segmented({ value, onChange, options, format }) {
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 bg-zinc-100 rounded-lg">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${value === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}>{format ? format(o) : o}</button>
      ))}
    </div>
  );
}

function CheckboxCard({ label, icon, checked, onChange, testid }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      data-testid={testid}
      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-[13px] font-medium transition-colors flex-1 min-w-0 ${checked ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-zinc-200 bg-white text-slate-700 hover:bg-slate-100'}`}
    >
      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
        {checked && <Check className="w-3 h-3" />}
      </span>
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
