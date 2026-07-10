import React, { useEffect, useState } from 'react';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/landing/LandingPage';
import ResourcesPage from './components/landing/ResourcesPage';
import AppShell from './components/app/AppShell';
import { Toaster } from './components/ui/sonner';

function Router() {
  const { state, loaded, startDemo } = useApp();
  const [hash, setHash] = useState(window.location.hash || '');

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Challenge deep links (#worksheets?subject=...) should work for friends
  // who aren't signed in — drop them straight into demo mode with the
  // link's worksheet setup intact.
  const isChallengeLink = /^#(worksheets|study|qbank)\?/.test(hash);
  useEffect(() => {
    if (loaded && !state.user && isChallengeLink) startDemo({ skipTutorial: true });
  }, [loaded, state.user, isChallengeLink, startDemo]);

  if (!loaded) return null;

  // Free resource directory — reachable whether signed in or not
  if (hash.startsWith('#resources')) {
    return <ResourcesPage />;
  }

  // If user is logged in, show the dashboard app
  if (state.user) {
    return <AppShell hash={hash} />;
  }
  return <LandingPage hash={hash} />;
}

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Router />
        <Toaster position="top-right" />
      </AppProvider>
    </div>
  );
}

export default App;
