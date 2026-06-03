import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import MarketAnalysis from './components/MarketAnalysis';
import TechnicalArchitecture from './components/TechnicalArchitecture';
import FeaturePrioritization from './components/FeaturePrioritization';
import CompetitiveLandscape from './components/CompetitiveLandscape';
import DevelopmentRoadmap from './components/DevelopmentRoadmap';
import MonetizationStrategy from './components/MonetizationStrategy';
import ExtensionStoreStrategy from './components/ExtensionStoreStrategy';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navigation />
      <Hero />
      <MarketAnalysis />
      <TechnicalArchitecture />
      <FeaturePrioritization />
      <CompetitiveLandscape />
      <DevelopmentRoadmap />
      <MonetizationStrategy />
      <ExtensionStoreStrategy />
      <Footer />
    </div>
  );
};

export default App;
