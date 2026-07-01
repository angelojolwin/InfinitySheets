import React from 'react';
import { Infinity, LogOut, Moon, Sun, Eye, X, Sparkles, RotateCcw, LayoutDashboard, GraduationCap, Brain, FileText, Library, History, TrendingUp, Dumbbell, AlertTriangle, User, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Dashboard from './Dashboard';
import StartStudying from './StartStudying';
import Worksheets from './Worksheets';
import WorksheetHistory from './WorksheetHistory';
import ProgressView from './ProgressView';
import Strengths from './Strengths';
import Mistakes from './Mistakes';
import Recommendations from './Recommendations';
import Profile from './Profile';
import SettingsView from './SettingsView';
import MyCourses from './MyCourses';
import TutorialOverlay from './TutorialOverlay';
import CourseWizard from './CourseWizard';
import QuestionBank from './QuestionBank';
import { toast } from 'sonner';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'courses', label: 'My Courses', Icon: GraduationCap },
  { key: 'study', label: 'Start Studying', Icon: Brain },
  { key: 'worksheets', label: 'Worksheets', Icon: FileText },
  { key: 'qbank', label: 'Question Bank', Icon: Library },
  { key: 'history', label: 'Worksheet History', Icon: History },
  { key: 'progress', label: 'Progress', Icon: TrendingUp },
  { key: 'strengths', label: 'Strengths & Weaknesses', Icon: Dumbbell },
  { key: 'recommendations', label: 'Smart Recommendations', Icon: Sparkles },
  { key: 'mistakes', label: 'Mistake History', Icon: AlertTriangle },
  { key: 'profile', label: 'Profile', Icon: User },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '');
  const [key, query] = raw.split('?');
  const params = {};
  (query || '').split('&').filter(Boolean).forEach((pair) => {
    const [k, v = ''] = pair.split('=');
    params[k] = v;
  });
  return { key: key || 'dashboard', params };
}

export default function AppShell({ hash }) {
  const { state, logout, toggleTheme, restartTutorial, restartOnboarding, resetProgress } = useApp();
  const { key: active, params } = parseHash(hash);
  const current = NAV.find((n) => n.key === active) || NAV[0];

  const go = (k) => { window.location.hash = `#${k}`; };

  let content = null;
  switch (current.key) {
    case 'dashboard': content = <Dashboard go={go} />; break;
    case 'courses': content = <MyCourses />; break;
    case 'study': content = <StartStudying go={go} subjectParam={params.subject} />; break;
    case 'worksheets': content = <Worksheets go={go} />; break;
    case 'qbank': content = <QuestionBank go={go} subjectParam={params.subject} />; break;
    case 'history': content = <WorksheetHistory />; break;
    case 'progress': content = <ProgressView />; break;
    case 'strengths': content = <Strengths />; break;
    case 'recommendations': content = <Recommendations go={go} />; break;
    case 'mistakes': content = <Mistakes />; break;
    case 'profile': content = <Profile />; break;
    case 'settings': content = <SettingsView />; break;
    default: content = <Dashboard go={go} />;
  }

  const isDemo = !!state.user?.isDemo;
  const isDark = state.theme === 'dark';
  const showOnboarding = !state.onboardingDone;
  const showTutorial = state.onboardingDone && !state.tutorialDone;

  const resetDemo = () => {
    resetProgress();
    restartOnboarding();
    restartTutorial();
    window.location.hash = '#dashboard';
    toast.success('Demo reset — starting setup from the top');
  };

  return (
    <div className="min-h-screen section-bg grid grid-cols-[230px_1fr]">
      <aside className="border-r border-[color:var(--color-border)] flex flex-col bg-white relative overflow-hidden">
        <div className="relative px-5 pt-5 pb-6 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-[color:var(--color-primary)] flex items-center justify-center">
            <Infinity className="w-5 h-5 text-white" strokeWidth={2.6} />
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-[14.5px] tracking-tight">InfinitySheets</div>
            <div className="text-[10px] text-slate-500">{isDemo ? 'Demo session' : 'Adaptive study'}</div>
          </div>
        </div>
        <nav className="relative flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map((n) => {
            const isActive = current.key === n.key;
            const Icon = n.Icon;
            return (
              <button key={n.key} data-nav-key={n.key} onClick={() => go(n.key)}
                className={`text-left text-[13.5px] px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} strokeWidth={2} />
                <span className="flex-1">{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="relative px-3 pb-4 pt-4 border-t border-[color:var(--color-border)] flex flex-col gap-1">
          <button onClick={toggleTheme} className="w-full text-left text-[13.5px] px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          {isDemo && (
            <button onClick={resetDemo} className="w-full text-left text-[13.5px] px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Reset demo</span>
            </button>
          )}
          <button onClick={() => { logout(); window.location.hash = ''; }} className="w-full text-left text-[13.5px] px-3 py-2 rounded-lg flex items-center gap-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>{isDemo ? 'Exit demo' : 'Logout'}</span>
          </button>
        </div>
      </aside>
      <main className="min-w-0 relative">
        {isDemo && (
          <div className="px-8 pt-3">
            <div className="rounded-xl border border-blue-200/70 bg-blue-50 px-4 py-2.5 flex items-center justify-between gap-3 text-[13px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center"><Eye className="w-3.5 h-3.5" /></span>
                <span><span className="font-semibold">Demo mode</span> · explore the app without an account. Progress saves on this device.</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={resetDemo} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12.5px] font-medium text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset demo
                </button>
                <button onClick={() => { logout(); window.location.hash = ''; }} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12.5px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                  <X className="w-3.5 h-3.5" /> Exit
                </button>
              </div>
            </div>
          </div>
        )}
        <header className="px-8 pt-7 pb-2 flex items-start justify-between border-b border-[color:var(--color-border)] bg-white">
          <div>
            <div className="eyebrow-muted mb-1 flex items-center gap-2">
              <span>{state.user?.examTrack || 'SSLC'}</span>
            </div>
            <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">{current.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-lg border border-[color:var(--color-border)] bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
            {current.key === 'dashboard' && (
              <button onClick={() => go('worksheets')} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium">
                <Sparkles className="w-4 h-4" /> New worksheet
              </button>
            )}
            {current.key === 'courses' && (
              <div className="text-[13px] text-slate-500">{(state.courses || []).length} course{(state.courses || []).length === 1 ? '' : 's'}</div>
            )}
          </div>
        </header>
        <div className="px-8 py-7 max-w-[1280px]">{content}</div>
      </main>

      {showOnboarding && <CourseWizard mode="onboarding" />}
      {showTutorial && <TutorialOverlay />}
    </div>
  );
}
