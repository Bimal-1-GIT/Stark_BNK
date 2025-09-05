import { useState } from 'react'
import HomePage from './HomePage'
import SoundAlertPage from './SoundAlertPage'
import DyslexiaHelperPage from './DyslexiaHelperPage'
import MentalWellnessPage from './MentalWellnessPage'
import './App.css'

type Page = 'home' | 'sound-alert' | 'dyslexia-helper' | 'mental-wellness'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const handleNavigate = (page: Page) => {
    setCurrentPage(page)
  }

  const handleNavigateHome = () => {
    setCurrentPage('home')
  }

  return (
    <div className="app">
      {currentPage === 'home' && (
        <HomePage onNavigate={(page) => handleNavigate(page)} />
      )}
      {currentPage === 'sound-alert' && (
        <SoundAlertPage onNavigateHome={handleNavigateHome} />
      )}
      {currentPage === 'dyslexia-helper' && (
        <DyslexiaHelperPage onNavigateHome={handleNavigateHome} />
      )}
      {currentPage === 'mental-wellness' && (
        <MentalWellnessPage onNavigateHome={handleNavigateHome} />
      )}
    </div>
  )
}

export default App
