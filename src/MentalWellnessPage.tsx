import React, { useEffect, useRef, useState } from 'react'
import './MentalWellnessPage.css'

interface MentalWellnessPageProps {
  onNavigateHome: () => void
}

type WellnessView = 'main' | 'mindfulness'

const MentalWellnessPage: React.FC<MentalWellnessPageProps> = ({ onNavigateHome }) => {
  const [currentView, setCurrentView] = useState<WellnessView>('mindfulness')
  const [activeActivity, setActiveActivity] = useState<'none' | 'meditation' | 'breathing' | 'sleep'>('none')

  // Guided Meditation state
  const [meditationDuration, setMeditationDuration] = useState<number>(600) // default 10 min in seconds
  const [meditationRemaining, setMeditationRemaining] = useState<number>(0)
  const [isMeditating, setIsMeditating] = useState<boolean>(false)
  const meditationIntervalRef = useRef<number | null>(null)

  // Breathing Exercise state (simple 4-4-4 box breathing)
  const breathingPhases: Array<{ label: 'Inhale' | 'Hold' | 'Exhale'; seconds: number }> = [
    { label: 'Inhale', seconds: 4 },
    { label: 'Hold', seconds: 4 },
    { label: 'Exhale', seconds: 4 }
  ]
  const [breathingRunning, setBreathingRunning] = useState<boolean>(false)
  const [breathingPhaseIndex, setBreathingPhaseIndex] = useState<number>(0)
  const [breathingPhaseRemaining, setBreathingPhaseRemaining] = useState<number>(breathingPhases[0].seconds)
  const breathingIntervalRef = useRef<number | null>(null)

  // Sleep Relaxation timer state
  const [sleepRunning, setSleepRunning] = useState<boolean>(false)
  const [sleepElapsed, setSleepElapsed] = useState<number>(0)
  const sleepIntervalRef = useRef<number | null>(null)

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

  // Utility: format seconds as mm:ss or hh:mm:ss
  function formatTime(totalSeconds: number): string {
    const s = Math.max(0, Math.floor(totalSeconds || 0))
    const hrs = Math.floor(s / 3600)
    const mins = Math.floor((s % 3600) / 60)
    const secs = s % 60
    const mm = String(mins).padStart(2, '0')
    const ss = String(secs).padStart(2, '0')
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${mm}:${ss}`
    }
    return `${mm}:${ss}`
  }

  // Guided Meditation handlers
  function startMeditation() {
    setMeditationRemaining(meditationDuration)
    setIsMeditating(true)
    if (meditationIntervalRef.current) window.clearInterval(meditationIntervalRef.current)
    meditationIntervalRef.current = window.setInterval(() => {
      setMeditationRemaining(prev => {
        if (prev <= 1) {
          stopMeditation()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function stopMeditation() {
    setIsMeditating(false)
    if (meditationIntervalRef.current) window.clearInterval(meditationIntervalRef.current)
    meditationIntervalRef.current = null
  }

  // Breathing handlers
  function startBreathing() {
    setBreathingRunning(true)
    if (breathingIntervalRef.current) window.clearInterval(breathingIntervalRef.current)
    breathingIntervalRef.current = window.setInterval(() => {
      setBreathingPhaseRemaining(prev => {
        if (prev <= 1) {
          setBreathingPhaseIndex(i => (i + 1) % breathingPhases.length)
          return breathingPhases[(breathingPhaseIndex + 1) % breathingPhases.length].seconds
        }
        return prev - 1
      })
    }, 1000)
  }

  function stopBreathing() {
    setBreathingRunning(false)
    if (breathingIntervalRef.current) window.clearInterval(breathingIntervalRef.current)
    breathingIntervalRef.current = null
  }

  function resetBreathing() {
    stopBreathing()
    setBreathingPhaseIndex(0)
    setBreathingPhaseRemaining(breathingPhases[0].seconds)
  }

  // Sleep handlers
  function startSleep() {
    setSleepRunning(true)
    if (sleepIntervalRef.current) window.clearInterval(sleepIntervalRef.current)
    sleepIntervalRef.current = window.setInterval(() => {
      setSleepElapsed(prev => prev + 1)
    }, 1000)
  }

  function stopSleep() {
    setSleepRunning(false)
    if (sleepIntervalRef.current) window.clearInterval(sleepIntervalRef.current)
    sleepIntervalRef.current = null
  }

  function resetSleep() {
    stopSleep()
    setSleepElapsed(0)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (meditationIntervalRef.current) window.clearInterval(meditationIntervalRef.current)
      if (breathingIntervalRef.current) window.clearInterval(breathingIntervalRef.current)
      if (sleepIntervalRef.current) window.clearInterval(sleepIntervalRef.current)
    }
  }, [])

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
                <button className="activity-btn" onClick={() => setActiveActivity('meditation')}>Start Meditation</button>
              </div>

              <div className="activity-card breathing">
                <div className="activity-icon">⏱</div>
                <h3>Breathing Exercises</h3>
                <p>Simple techniques to reduce stress and increase focus</p>
                <button className="activity-btn" onClick={() => setActiveActivity('breathing')}>Begin Breathing</button>
              </div>

              <div className="activity-card sleep">
                <div className="activity-icon">🌙</div>
                <h3>Sleep Relaxation</h3>
                <p>Gentle guides to help you unwind and prepare for restful sleep</p>
                <button className="activity-btn" onClick={() => setActiveActivity('sleep')}>Explore Sleep</button>
              </div>

              
            </div>
            {activeActivity === 'meditation' && (
              <div className="activity-panel bg-white/90 rounded-2xl shadow-xl border border-white/40 p-4 md:p-6 mt-6">
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">Guided Meditation Timer</h3>
                <div className="controls-row flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                  <label htmlFor="med-duration" className="text-slate-700 font-medium">Duration:</label>
                  <select
                    id="med-duration"
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={meditationDuration}
                    onChange={(e) => setMeditationDuration(Number(e.target.value))}
                  >
                    <option value={300}>5 minutes</option>
                    <option value={600}>10 minutes</option>
                    <option value={1200}>20 minutes</option>
                  </select>
                  {!isMeditating ? (
                    <button
                      className="activity-btn md:w-auto"
                      onClick={() => startMeditation()}
                    >
                      Start
                    </button>
                  ) : (
                    <button className="activity-btn md:w-auto" onClick={stopMeditation}>Stop</button>
                  )}
                </div>
                <div className="timer-display text-center mt-4 text-4xl md:text-5xl font-bold text-purple-700 tracking-wider" aria-live="polite">
                  {formatTime(meditationRemaining)}
                </div>
              </div>
            )}

            {activeActivity === 'breathing' && (
              <div className="activity-panel bg-white/90 rounded-2xl shadow-xl border border-white/40 p-4 md:p-6 mt-6">
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">Breathing Exercise</h3>
                <p className="text-slate-600 mb-4">Follow the cycle: Inhale → Hold → Exhale (4s each)</p>
                <div className="controls-row flex gap-3 flex-wrap">
                  {!breathingRunning ? (
                    <button className="activity-btn md:w-auto" onClick={startBreathing}>Start</button>
                  ) : (
                    <button className="activity-btn md:w-auto" onClick={stopBreathing}>Stop</button>
                  )}
                  <button className="activity-btn md:w-auto" onClick={resetBreathing}>Reset</button>
                </div>
                <div className="timer-display text-center mt-4 text-3xl md:text-4xl font-bold text-emerald-700" aria-live="polite">
                  Phase: {breathingPhases[breathingPhaseIndex].label} — {breathingPhaseRemaining}s
                </div>
              </div>
            )}

            {activeActivity === 'sleep' && (
              <div className="activity-panel bg-white/90 rounded-2xl shadow-xl border border-white/40 p-4 md:p-6 mt-6">
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">Sleep Relaxation Timer</h3>
                <div className="controls-row flex gap-3 flex-wrap">
                  {!sleepRunning ? (
                    <button className="activity-btn md:w-auto" onClick={startSleep}>Start</button>
                  ) : (
                    <button className="activity-btn md:w-auto" onClick={stopSleep}>Stop</button>
                  )}
                  <button className="activity-btn md:w-auto" onClick={resetSleep}>Reset</button>
                </div>
                <div className="timer-display text-center mt-4 text-3xl md:text-4xl font-bold text-indigo-700" aria-live="polite">Elapsed: {formatTime(sleepElapsed)}</div>
              </div>
            )}
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
