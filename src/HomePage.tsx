import React from 'react'
import './HomePage.css'

interface HomePageProps {
  onNavigate: (page: 'sound-alert' | 'dyslexia-helper' | 'mental-wellness') => void
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>🌟 AccessiCare</h1>
        <p>Empowering accessibility, reading support, and mental wellness for everyone</p>
        <div className="intro-text">
          AccessiCare is an inclusive digital platform designed to empower specially-abled individuals through smart tools like sound alert systems, mindful training, AI-powered lenses, and a dyslexia helper—making everyday life more accessible, independent, and supportive.
        </div>
      </header>

      <main className="home-main">
        <div className="feature-cards">
          <div className="feature-card sound-alert-card">
            <div className="card-icon">🔊</div>
            <h2>Sound Alert System</h2>
            <p>
              Accessibility tool designed for deaf and hard-of-hearing individuals. 
              Detects important sounds like doorbells, alarms, knocking, and alerts you visually.
            </p>
            <ul className="feature-list">
              <li>🔔 Real-time sound detection</li>
              <li>📊 Visual noise level indicators</li>
              <li>⚡ Instant visual alerts</li>
              <li>🎛️ Customizable sensitivity</li>
            </ul>
            <button 
              className="feature-btn sound-btn"
              onClick={() => onNavigate('sound-alert')}
            >
              Launch Sound Alert
            </button>
          </div>

          <div className="feature-card dyslexia-helper-card">
            <div className="card-icon">📖</div>
            <h2>Dyslexia Helper</h2>
            <p>
              Comprehensive reading assistance tool designed for individuals with dyslexia. 
              Features dyslexia-friendly fonts, text-to-speech, and customizable reading environments.
            </p>
            <ul className="feature-list">
              <li>🔤 OpenDyslexic font support</li>
              <li>� Text-to-speech with highlighting</li>
              <li>� Customizable background colors</li>
              <li>✨ Enhanced letter & word spacing</li>
            </ul>
            <button 
              className="feature-btn dyslexia-btn"
              onClick={() => onNavigate('dyslexia-helper')}
            >
              Launch FocusRead
            </button>
          </div>

          <div className="feature-card mental-wellness-card">
            <div className="card-icon">🌸</div>
            <h2>Mental Wellness Hub</h2>
            <p>
              Modern, soothing platform for mental health support and mindfulness practices. 
              Beautifully designed with soft interfaces and calming experiences.
            </p>
            <ul className="feature-list">
              <li>🧘‍♀️ Guided meditation & mindfulness</li>
              <li>💚 Wellness tools & resources</li>
              <li>📖 Expert articles & tips</li>
              <li>❤️ Daily affirmations & journaling</li>
            </ul>
            <button 
              className="feature-btn wellness-btn"
              onClick={() => onNavigate('mental-wellness')}
            >
              Enter MindEase
            </button>
          </div>

          <div className="feature-card lens-ai-card">
            <div className="card-icon">👓</div>
            <h2>Lens AI</h2>
            <p>
              Object recognition for low-vision users. Detects common household items with
              clear visuals, bounding boxes, and optional voice feedback.
            </p>
            <ul className="feature-list">
              <li>🧠 AI object detection (COCO‑SSD & MobileNet)</li>
              <li>🟩 On‑screen bounding boxes with labels</li>
              <li>🔊 Voice feedback toggle</li>
              <li>📱 Camera mirroring and responsive canvas</li>
            </ul>
            <button 
              className="feature-btn lens-btn"
              onClick={() => window.open('/op.html', '_blank', 'noopener,noreferrer')}
            >
              Launch Lens AI
            </button>
          </div>
        </div>

        <div className="home-footer">
          <p>Built with ❤️ for accessibility and reading assistance</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">4</span>
              <span className="stat-label">Essential Tools</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Availability</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Privacy Focused</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
