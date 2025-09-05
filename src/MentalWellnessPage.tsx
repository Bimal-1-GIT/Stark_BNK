import React, { useState } from 'react'
import './MentalWellnessPage.css'

interface MentalWellnessPageProps {
  onNavigateHome: () => void
}

type WellnessView = 'main' | 'mindfulness'

const MentalWellnessPage: React.FC<MentalWellnessPageProps> = ({ onNavigateHome }) => {
  const [currentView, setCurrentView] = useState<WellnessView>('main')

  const handleNavigateToMindfulness = () => {
    setCurrentView('mindfulness')
  }

  const handleBackToMain = () => {
    setCurrentView('main')
  }

  const handleHomeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🏠 Home button clicked! Navigating back to AccessiCare homepage...')
    console.log('onNavigateHome function:', onNavigateHome)
    if (onNavigateHome && typeof onNavigateHome === 'function') {
      onNavigateHome()
    } else {
      console.error('onNavigateHome is not a function:', onNavigateHome)
    }
  }

  if (currentView === 'mindfulness') {
    return (
      <div className="wellness-page mindfulness-page">
        <div className="page-header">
          <button className="back-btn" onClick={handleBackToMain}>
            ← Back to MindEase
          </button>
          <div className="page-title">
            <span className="page-icon">🧘‍♀️</span>
            <h1>Mindfulness Hub</h1>
          </div>
        </div>
        
        <div className="content-container">
          <div className="mindfulness-content">
            <div className="welcome-card">
              <h2>Welcome to Your Mindfulness Journey</h2>
              <p>Take a moment to breathe, center yourself, and explore our guided practices designed to bring peace and clarity to your day.</p>
            </div>

            <div className="activities-grid">
              <div className="activity-card meditation">
                <div className="activity-icon">🌿</div>
                <h3>Guided Meditation</h3>
                <p>5, 10, or 20-minute sessions for beginners and experienced practitioners</p>
                <button className="activity-btn">Start Meditation</button>
              </div>

              <div className="activity-card breathing">
                <div className="activity-icon">⏱</div>
                <h3>Breathing Exercises</h3>
                <p>Simple techniques to reduce stress and increase focus</p>
                <button className="activity-btn">Begin Breathing</button>
              </div>

              <div className="activity-card sleep">
                <div className="activity-icon">🌙</div>
                <h3>Sleep Relaxation</h3>
                <p>Gentle guides to help you unwind and prepare for restful sleep</p>
                <button className="activity-btn">Explore Sleep</button>
              </div>

              <div className="activity-card music">
                <div className="activity-icon">🎧</div>
                <h3>Calming Music</h3>
                <p>Curated playlists for meditation, work, and relaxation</p>
                <button className="activity-btn">Listen Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wellness-page">
      <div className="wellness-header">
        <button 
          className="home-btn" 
          onClick={handleHomeClick}
          type="button"
          aria-label="Return to AccessiCare homepage"
        >
          ← Home
        </button>
        <div className="logo-section">
          <div className="logo">🌸</div>
          <h1 className="main-title">MindEase</h1>
          <p className="tagline">Nurturing mental wellness through self-care and support</p>
        </div>
      </div>

      <div className="cards-container">
        <div className="wellness-card mindfulness-card" onClick={handleNavigateToMindfulness}>
          <div className="card-content">
            <div className="card-icon">🧘‍♀️</div>
            <h2 className="card-title">Mindfulness & Meditation</h2>
            <p className="card-description">
              Guided meditation and relaxation practices for stress relief and inner peace.
            </p>
            <ul className="feature-list">
              <li><span className="feature-icon">🌿</span> Guided audio meditation</li>
              <li><span className="feature-icon">⏱</span> Breathing exercises</li>
              <li><span className="feature-icon">🌙</span> Sleep relaxation guides</li>
              <li><span className="feature-icon">🎧</span> Calming music playlists</li>
            </ul>
            <button className="card-button mindfulness-btn">
              Launch Mindfulness
            </button>
          </div>
        </div>
      </div>

      <div className="footer-section">
        <p>✨ Your mental health journey matters ✨</p>
      </div>
    </div>
  )
}

export default MentalWellnessPage
