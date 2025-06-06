import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadSection from './components/UploadSection';
import OptionsPanel from './components/OptionsPanel';
import PreviewSection from './components/PreviewSection';
import ActionButtons from './components/ActionButtons';
import { AnimationProvider } from './context/AnimationContext';

function App() {
  // The main application state is managed through the AnimationContext provider
  // Each component will access what it needs from the context

  return (
    <AnimationProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-6">
              <UploadSection />
              <OptionsPanel />
            </div>
            
            <div className="flex flex-col space-y-6">
              <PreviewSection />
              <ActionButtons />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimationProvider>
  );
}

export default App;