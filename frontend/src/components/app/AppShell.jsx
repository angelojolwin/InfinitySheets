import React, { useState, useEffect } from 'react';
import { Menu, X, Infinity } from 'lucide-react';
import { LayoutDashboard, GraduationCap, Pencil, FileText, Library, History, TrendingUp, Dumbbell, Sparkles, AlertTriangle, User, Settings, Shield, Trophy } from 'lucide-react';
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
import AdminPlaceholder from './AdminPlaceholder';
import Achievements from './Achievements';
import CourseOverview from './CourseOverview';
import Sidebar from './shell/Sidebar';
import DemoBanner from './shell/DemoBanner';
import TopHeader from './shell/TopHeader';
import { toast } from 'sonner';

const BASE_NAV = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'courses', label: 'My Courses', Icon: GraduationCap },
  { key: 'study', label: 'Start Studying', Icon: Pencil },
  { key: 'qbank', label: 'Question Bank', Icon: Library },
  { key: 'history', label: 'Worksheet History', Icon: History },
  { key: 'progress', label: 'Progress', Icon: TrendingUp },
  { key: 'strengths', label: 'Strengths & Weaknesses', Icon: Dumbbell },
  { key: 'recommendations', label: 'Smart Recommendations', Icon: Sparkles },
  { key: 'achievements', label: 'Achievements', Icon: Trophy },
  { key: 'profile', label: 'Profile', Icon: User },
  { key: 'settings', label: 'Settings', Icon: Settings },
];
const ADMIN_ITEM = { key: 'admin', label: 'Admin', Icon: Shield };
const HIDDEN_ROUTES = [
  { key: 'worksheets', label: 'Create a Worksheet', Icon: FileText },
  { key: 'mistakes', label: 'Mistake History', Icon: AlertTriangle },
  { key: 'course-overview', label: 'Course Overview', Icon: GraduationCap },
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

function renderRoute(activeKey, params, go, isAdmin) {
  switch (activeKey) {
    case 'dashboard': return <Dashboard go={go} />;
    case 'courses': return <MyCourses />;
    case 'study': return <StartStudying go={go} subjectParam={params.subject} />;
    case 'worksheets': return <Worksheets go={go} linkParams={params} />;
    case 'qbank': return <QuestionBank go={go} subjectParam={params.subject} />;
    case 'history': return <WorksheetHistory />;
    case 'progress': return <ProgressView />;
    case 'strengths': return <Strengths />;
    case 'recommendations': return <Recommendations go={go} />;
    case 'achievements': return <Achievements />;
    case 'mistakes': return <Mistakes />;
    case 'profile': return <Profile />;
    case 'settings': return <SettingsView />;
    case 'admin': return isAdmin ? <AdminPlaceholder /> : <Dashboard go={go} />;
    case 'course-overview': return <CourseOverview courseId={params.id} go={go} />;
    default: return <Dashboard go={go} />;
  }
}

export default function AppShell({ hash }) {
  const { state, logout, apiLogout, toggleTheme, restartTutorial, restartOnboarding, resetProgress } = useApp();
  const { key: active, params } = parseHash(hash);
  const isDemo = !!state.user?.isDemo;
  const isAdmin = state.user?.role === 'admin' || isDemo;
  const NAV = isAdmin ? [...BASE_NAV, ADMIN_ITEM] : BASE_NAV;
  const ALL_ITEMS = [...NAV, ...HIDDEN_ROUTES];
  const current = ALL_ITEMS.find((n) => n.key === active) || NAV[0];

  const [mobileNav, setMobileNav] = useState(false);
  const go = (k) => {
    const target = `#${k}`;
    if (window.location.hash === target) {
      // Re-clicking the current route (e.g. "New worksheet" while on the
      // results screen) — views listen for this to reset themselves.
      window.dispatchEvent(new CustomEvent('same-route-nav', { detail: k }));
    } else {
      window.location.hash = target;
    }
    setMobileNav(false);
  };
  // Close the drawer on any hash change (e.g. deep links, back button).
  useEffect(() => { setMobileNav(false); }, [hash]);
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

  const exitAccount = async () => {
    if (isDemo) {
      logout();
    } else {
      await apiLogout();
    }
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen section-bg grid grid-cols-1 lg:grid-cols-[230px_1fr]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          nav={NAV}
          activeKey={current.key}
          isDemo={isDemo}
          onNavigate={go}
          onResetDemo={resetDemo}
          onLogout={exitAccount}
        />
      </div>
      {/* Mobile top bar + slide-over drawer */}
      <div className="lg:hidden sticky top-0 z-40 liquid-glass border-b border-[color:var(--color-border)] flex items-center justify-between px-4 h-[54px]">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[color:var(--color-primary)] flex items-center justify-center">
            <Infinity className="w-[18px] h-[18px] text-white" strokeWidth={2.6} />
          </span>
          <span className="font-semibold text-[14px]">{current.label}</span>
        </div>
        <button onClick={() => setMobileNav(true)} aria-label="Open menu" className="w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-slate-100">
          <Menu className="w-5 h-5" />
        </button>
      </div>
      {mobileNav && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-[270px] max-w-[85vw] shadow-2xl animate-tut-in">
            <button onClick={() => setMobileNav(false)} aria-label="Close menu" className="absolute top-4 right-3 z-10 w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100">
              <X className="w-[18px] h-[18px]" />
            </button>
            <div className="h-full [&>aside]:h-full">
              <Sidebar
                nav={NAV}
                activeKey={current.key}
                isDemo={isDemo}
                onNavigate={go}
                onResetDemo={() => { setMobileNav(false); resetDemo(); }}
                onLogout={() => { setMobileNav(false); exitAccount(); }}
              />
            </div>
          </div>
        </div>
      )}
      <main className="min-w-0 relative">
        {isDemo && <DemoBanner onResetDemo={resetDemo} onExit={exitAccount} />}
        <TopHeader
          examTrack={state.user?.examTrack || 'SSLC'}
          title={current.label}
          activeKey={current.key}
          isDark={isDark}
          courseCount={(state.courses || []).length}
          onToggleTheme={toggleTheme}
          onNewWorksheet={() => go('worksheets')}
        />
        <div className="px-4 sm:px-6 lg:px-8 py-7 max-w-[1280px]">
          {renderRoute(current.key, params, go, isAdmin)}
        </div>
      </main>

      {showOnboarding && <CourseWizard mode="onboarding" />}
      {showTutorial && <TutorialOverlay />}
    </div>
  );
}
