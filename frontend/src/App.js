import React, { useEffect, useState } from 'react';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/landing/LandingPage';
import ResourcesPage from './components/landing/ResourcesPage';
import { Toaster } from './components/ui/sonner';

// LANDING-ONLY BUILD: this branch ships just the marketing site — the
// landing page and the free resource directory. No demo, no app shell.
function Router() {
  const { loaded } = useApp();
  const [hash, setHash] = useState(window.location.hash || '');

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!loaded) return null;

  if (hash.startsWith('#resources')) {
    return <ResourcesPage />;
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
