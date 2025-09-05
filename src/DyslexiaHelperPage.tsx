import React, { useState, useRef, useEffect } from 'react'
import './DyslexiaHelperPage.css'

interface DyslexiaHelperPageProps {
  onNavigateHome: () => void
}

const DyslexiaHelperPage: React.FC<DyslexiaHelperPageProps> = ({ onNavigateHome }) => {
  const [inputText, setInputText] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#fffffa')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Stop any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  // Split text into words for highlighting
  const renderTextWithSpans = (text: string) => {
    if (!text.trim()) return []
    return text.split(/(\s+)/).filter(part => part.trim()).map((word, index) => ({
      word,
      index
    }))
  }

  const words = renderTextWithSpans(inputText)

  const handlePlay = () => {
    if (!inputText.trim()) return
    
    if (isPlaying) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      return
    }

    setIsPlaying(true)
    setCurrentWordIndex(0)

    const utterance = new SpeechSynthesisUtterance(inputText)
    utterance.rate = 1
    utterance.pitch = 1
    
    let wordIndex = 0
    
    utterance.onboundary = (event) => {
      if (event.name === 'word' && wordIndex < words.length) {
        setCurrentWordIndex(wordIndex)
        wordIndex++
      }
    }
    
    utterance.onend = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    }
    
    utterance.onerror = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setCurrentWordIndex(-1)
  }

  return (
    <div className="dyslexia-helper" style={{ backgroundColor }}>
      {/* Header */}
      <div className="helper-header">
        <button className="back-button" onClick={onNavigateHome}>
          <span className="back-icon">←</span> Home
        </button>
        <div className="header-content">
          <div className="helper-title">
            <span className="title-icon">📖</span> FocusRead
          </div>
          <div className="helper-subtitle">
            Dyslexia-friendly reading and text-to-speech tool
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="helper-main">
        <div className="helper-description">
          <p>
            Paste or type your text below. Instantly view it in a dyslexia-friendly format. 
            Hit <strong>Play</strong> to have it read aloud with word highlighting.
          </p>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="control-group">
            <label htmlFor="bgcolor">Background Color:</label>
            <input 
              type="color" 
              id="bgcolor" 
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
          <div className="control-group">
            <button 
              className={`play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlay}
              disabled={!inputText.trim()}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            {isPlaying && (
              <button className="stop-btn" onClick={handleStop}>
                ⏹️ Stop
              </button>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="text-input-section">
          <label htmlFor="inputText">Enter or paste your text:</label>
          <textarea 
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type text here..."
            rows={6}
          />
        </div>

        {/* Output Area */}
        <div className="text-output-section">
          <label>Dyslexia-friendly format:</label>
          <div 
            ref={outputRef}
            className="output-text"
            tabIndex={0}
          >
            {words.map((wordObj, index) => (
              <span 
                key={index}
                className={`word-span ${currentWordIndex === index ? 'highlight' : ''}`}
              >
                {wordObj.word}{' '}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="features-section">
          <h3>Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🔤</span>
              <div>
                <strong>OpenDyslexic Font</strong>
                <p>Specially designed font that reduces reading errors</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <div>
                <strong>Customizable Background</strong>
                <p>Choose colors that work best for your reading comfort</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔊</span>
              <div>
                <strong>Text-to-Speech</strong>
                <p>Listen while following highlighted words</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <div>
                <strong>Enhanced Spacing</strong>
                <p>Improved letter and word spacing for easier reading</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DyslexiaHelperPage
