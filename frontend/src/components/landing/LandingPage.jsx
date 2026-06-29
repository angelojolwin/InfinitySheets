import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import WhyInfinity from './WhyInfinity';
import HowItWorks from './HowItWorks';
import Features from './Features';
import WhatIs from './WhatIs';
import WhyItWorks from './WhyItWorks';
import Research from './Research';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import FinalCTA from './FinalCTA';
import SignupSection from './SignupSection';
import Footer from './Footer';

export default function LandingPage({ hash }) {
  useEffect(() => {
    if (hash && hash.startsWith('#') && hash.length > 1) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [hash]);

  const onStart = () => { window.location.hash = '#signup'; };

  return (
    <div className="section-bg">
      <Navbar onStart={onStart} />
      <Hero />
      <WhyInfinity />
      <HowItWorks />
      <Features />
      <WhatIs />
      <WhyItWorks />
      <Research />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <SignupSection />
      <Footer />
    </div>
  );
}
