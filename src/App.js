import React, { useState } from 'react';
import CombinedGallery from './components/CombinedGallery';
import ZineSection from './components/ZineSection';
import ThanksSection from './components/ThanksSection';

function App() {
  const [activeSection, setActiveSection] = useState('gallery');

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="app-navigation">
        <button 
          className={`nav-tab ${activeSection === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveSection('gallery')}
        >
          🍁 The Gallery
        </button>
        <button 
          className={`nav-tab ${activeSection === 'zines' ? 'active' : ''}`}
          onClick={() => setActiveSection('zines')}
        >
          📚 Zine Collection
        </button>
        <button 
          className={`nav-tab ${activeSection === 'thanks' ? 'active' : ''}`}
          onClick={() => setActiveSection('thanks')}
        >
          🏢 Organizations
        </button>
        
        <button 
          className="nav-tab contact-button"
          onClick={() => {
            const subject = encodeURIComponent('Seattle Climate Puzzle Project - Questions & Collaboration');
            const body = encodeURIComponent(`Hi Carissa and Angela,

I'm reaching out about the Seattle Climate Puzzle project. I'd love to learn more about the project and explore potential collaboration opportunities.

Best regards,
[Your Name]`);
            window.open(`mailto:carissaknipe@gmail.com,angela.goldberg@gmail.com?subject=${subject}&body=${body}`);
          }}
        >
          📧 Contact Us
        </button>
      </nav>

      {/* Main Content */}
      {activeSection === 'gallery' && (
        <main className="app-main">
          <CombinedGallery />
        </main>
      )}
      
      {activeSection === 'zines' && (
        <ZineSection />
      )}
      
      {activeSection === 'thanks' && (
        <main className="app-main">
          <ThanksSection />
        </main>
      )}
    </div>
  );
}

export default App;
