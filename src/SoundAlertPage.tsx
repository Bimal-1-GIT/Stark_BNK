import React, { useState, useEffect, useCallback, useRef } from 'react'
import './SoundAlertPage.css'

interface SoundAlertPageProps {
  onNavigateHome: () => void
}

interface SoundDetectorState {
  isMonitoring: boolean
  hasPermission: boolean
  error: string | null
  currentVolume: number
  threshold: number
  alertActive: boolean
  detectedSoundType: string | null
  soundHistory: number[]
}

interface SoundClassification {
  type: string
  confidence: number
  description: string
}

const SoundAlertPage: React.FC<SoundAlertPageProps> = ({ onNavigateHome }) => {
  const [state, setState] = useState<SoundDetectorState>({
    isMonitoring: false,
    hasPermission: false,
    error: null,
    currentVolume: 0,
    threshold: 30,
    alertActive: false,
    detectedSoundType: null,
    soundHistory: []
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getVolumeLevel = useCallback((volume: number): string => {
    if (volume <= 10) return 'quiet'
    if (volume <= 30) return 'low_noise'
    if (volume <= 60) return 'medium_noise'
    if (volume <= 80) return 'high_noise'
    return 'very_high_noise'
  }, [])

  const classifySound = useCallback((currentVolume: number, soundHistory: number[]): SoundClassification | null => {
    if (currentVolume < state.threshold) return null
    
    const recentHistory = soundHistory.slice(-20)
    const avgVolume = recentHistory.reduce((a, b) => a + b, 0) / recentHistory.length
    const peaks = countPeaks(recentHistory, state.threshold)
    const isSustained = recentHistory.filter(v => v > state.threshold).length > recentHistory.length * 0.7
    
    if (peaks >= 1 && peaks <= 3 && avgVolume > state.threshold * 1.2) {
      return {
        type: 'doorbell',
        confidence: 0.8,
        description: 'Doorbell or chime pattern'
      }
    }
    
    if (isSustained && peaks >= 1) {
      return {
        type: 'alarm',
        confidence: 0.6,
        description: 'Continuous alarm or siren'
      }
    }
    
    if (peaks >= 3 && peaks <= 6) {
      return {
        type: 'knocking',
        confidence: 0.7,
        description: 'Knocking or tapping sounds'
      }
    }
    
    if (avgVolume > state.threshold * 1.5) {
      return {
        type: 'impact',
        confidence: 0.6,
        description: 'Heavy impact or crash'
      }
    }
    
    return {
      type: 'unknown',
      confidence: 0.3,
      description: 'Sound detected'
    }
  }, [state.threshold])

  // Get noise level classification
  const getNoiseLevel = useCallback((volume: number) => {
    if (volume <= 5) {
      return { level: 1, label: 'Silent', emoji: '🔇', description: 'Very quiet environment' }
    } else if (volume <= 25) {
      return { level: 2, label: 'Quiet', emoji: '🔉', description: 'Low ambient noise' }
    } else if (volume <= 50) {
      return { level: 3, label: 'Moderate', emoji: '🔊', description: 'Normal conversation level' }
    } else if (volume <= 75) {
      return { level: 4, label: 'Loud', emoji: '📢', description: 'Busy environment' }
    } else {
      return { level: 5, label: 'Very Noisy', emoji: '🔊', description: 'Very loud environment' }
    }
  }, [])

  // Simple helper function for peak counting
  const countPeaks = (values: number[], threshold: number): number => {
    let peaks = 0
    for (let i = 1; i < values.length - 1; i++) {
      if (values[i] > threshold && values[i] > values[i-1] && values[i] > values[i+1]) {
        peaks++
      }
    }
    return peaks
  }

  const requestMicrophonePermission = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }))
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      })
      
      streamRef.current = stream
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      setState(prev => ({ ...prev, hasPermission: true }))
    } catch (err) {
      console.error('Microphone access denied:', err)
      setState(prev => ({ 
        ...prev, 
        error: 'Microphone access is required for sound detection. Please allow microphone access and try again.' 
      }))
    }
  }, [])

  const monitorSound = useCallback(() => {
    if (!analyserRef.current || !state.isMonitoring) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)
    
    const average = dataArray.reduce((a, b) => a + b) / bufferLength
    const volume = Math.round((average / 255) * 100)
    
    setState(prev => {
      const newHistory = [...prev.soundHistory, volume].slice(-50)
      const soundClassification = classifySound(volume, newHistory)
      
      return {
        ...prev,
        currentVolume: volume,
        soundHistory: newHistory,
        detectedSoundType: soundClassification?.type || null
      }
    })
    
    // Trigger alert if emergency sound is detected OR volume exceeds threshold
    const soundClassification = classifySound(volume, state.soundHistory)
    const shouldAlert = (soundClassification && soundClassification.type !== 'unknown') || 
                       (volume > state.threshold && !soundClassification)
    
    if (shouldAlert && !state.alertActive) {
      console.log('🚨 TRIGGERING ALERT!', { soundClassification, volume, threshold: state.threshold })
      setState(prev => ({ ...prev, alertActive: true }))
      
      // Clear any existing timeout
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current)
      }
      
      // Auto-dismiss alert after 5 seconds for emergency sounds, 3 for regular
      const dismissTime = soundClassification?.type === 'fire_alarm' ? 8000 : 3000
      alertTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, alertActive: false, detectedSoundType: null }))
      }, dismissTime)
    }
    
    animationFrameRef.current = requestAnimationFrame(monitorSound)
  }, [state.isMonitoring, state.threshold, state.alertActive, state.soundHistory, getVolumeLevel, classifySound])

  const startMonitoring = useCallback(async () => {
    if (!state.hasPermission) {
      await requestMicrophonePermission()
      return
    }
    
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume()
    }
    
    setState(prev => ({ ...prev, isMonitoring: true }))
  }, [state.hasPermission, requestMicrophonePermission])

  const stopMonitoring = useCallback(() => {
    setState(prev => ({ ...prev, isMonitoring: false, alertActive: false, detectedSoundType: null }))
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current)
    }
  }, [])

  const updateThreshold = useCallback((newThreshold: number) => {
    setState(prev => ({ ...prev, threshold: newThreshold }))
  }, [])

  const dismissAlert = useCallback(() => {
    setState(prev => ({ ...prev, alertActive: false, detectedSoundType: null }))
    
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current)
    }
  }, [])

  // Start monitoring when permission is granted and monitoring is enabled
  useEffect(() => {
    if (state.isMonitoring && state.hasPermission) {
      monitorSound()
    }
  }, [state.isMonitoring, monitorSound])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="sound-alert-page">
      <header className="sound-alert-header">
        <button className="back-btn" onClick={onNavigateHome}>
          ← Back to Home
        </button>
        <h1>🔊 Sound Alert</h1>
        <p>Accessibility tool for detecting sudden loud sounds</p>
      </header>

      {state.error && (
        <div className="error-message" role="alert">
          <p>{state.error}</p>
          <button onClick={requestMicrophonePermission} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {!state.hasPermission && !state.error && (
        <div className="permission-request">
          <h2>Microphone Access Required</h2>
          <p>This app needs access to your microphone to detect sounds.</p>
          <button onClick={requestMicrophonePermission} className="permission-btn">
            Allow Microphone Access
          </button>
        </div>
      )}

      {state.hasPermission && (
        <main className="app-main">
          <div className="controls">
            <div className="monitoring-control">
              <button 
                onClick={state.isMonitoring ? stopMonitoring : startMonitoring}
                className={`monitor-btn ${state.isMonitoring ? 'stop' : 'start'}`}
                aria-pressed={state.isMonitoring}
              >
                {state.isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'}
              </button>
              <div className="status" aria-live="polite">
                Status: {state.isMonitoring ? 'Listening...' : 'Stopped'}
              </div>
            </div>

            <div className="threshold-control">
              <label htmlFor="threshold-slider">
                Sensitivity Threshold: {state.threshold}%
              </label>
              <input
                id="threshold-slider"
                type="range"
                min="10"
                max="90"
                value={state.threshold}
                onChange={(e) => updateThreshold(parseInt(e.target.value))}
                className="threshold-slider"
                aria-describedby="threshold-help"
              />
              <small id="threshold-help">
                Lower values = more sensitive to quiet sounds
              </small>
            </div>
          </div>

          <div className="sound-meter">
            <h3>Live Sound Level</h3>
            <div className="meter-container">
              <div 
                className="meter-bar"
                style={{ width: `${state.currentVolume}%` }}
                aria-label={`Current sound level: ${state.currentVolume}%`}
              />
              <div 
                className="threshold-line"
                style={{ left: `${state.threshold}%` }}
                aria-label={`Threshold at ${state.threshold}%`}
              />
            </div>
            <div className="meter-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <div className="current-volume" aria-live="polite">
              Current: {state.currentVolume}% 
              {state.currentVolume > state.threshold && state.isMonitoring && (
                <span className="over-threshold"> (Above threshold!)</span>
              )}
            </div>
            
            {/* Noise Level Indicator */}
            {state.isMonitoring && (
              <div className={`noise-level noise-level-${getNoiseLevel(state.currentVolume).level}`} aria-live="polite">
                <span className="noise-emoji">{getNoiseLevel(state.currentVolume).emoji}</span>
                <span className="noise-number">{getNoiseLevel(state.currentVolume).level}️⃣</span>
                <span className="noise-label">{getNoiseLevel(state.currentVolume).label}</span>
                <div className="noise-description">{getNoiseLevel(state.currentVolume).description}</div>
              </div>
            )}
            
            {state.detectedSoundType && state.detectedSoundType !== 'unknown' && (
              <div className="sound-type">
                🎵 Detected: <strong>{state.detectedSoundType}</strong>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Alert Modal */}
      {state.alertActive && (
        <div 
          className="alert-overlay"
          role="alert" 
          aria-live="assertive"
          onClick={dismissAlert}
        >
          <div className="alert-content">
            <div className="alert-icon">
              {state.detectedSoundType === 'doorbell' ? '🔔' :
               state.detectedSoundType === 'alarm' ? '🚨' :
               state.detectedSoundType === 'knocking' ? '🚪' :
               state.detectedSoundType === 'impact' ? '💥' : '🔊'}
            </div>
            <h2>
              {state.detectedSoundType === 'doorbell' ? 'DOORBELL DETECTED!' :
               state.detectedSoundType === 'alarm' ? 'ALARM DETECTED!' :
               state.detectedSoundType === 'knocking' ? 'KNOCKING DETECTED!' :
               state.detectedSoundType === 'impact' ? 'LOUD IMPACT DETECTED!' :
               'LOUD SOUND DETECTED!'}
            </h2>
            <p>
              {state.detectedSoundType === 'doorbell' ? 'Someone may be at your door' :
               state.detectedSoundType === 'alarm' ? 'A continuous alarm is sounding' :
               state.detectedSoundType === 'knocking' ? 'Someone is knocking or tapping' :
               state.detectedSoundType === 'impact' ? 'A heavy impact or crash occurred' :
               'A significant noise was detected'}
            </p>
            <button onClick={dismissAlert} className="dismiss-btn">
              Dismiss Alert
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SoundAlertPage
