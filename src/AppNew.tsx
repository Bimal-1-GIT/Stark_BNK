import { useState } from 'react'
import HomePage from './HomePage'
import SoundAlertPage from './SoundAlertPage'
import './App.css'

type Page = 'home' | 'sound-alert'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const handleNavigate = (page: Page) => {
    setCurrentPage(page)
  }

  const handleNavigateHome = () => {
    setCurrentPage('home')
  }

  const handleNavigateFromHome = (page: 'sound-alert' | 'dyslexia-helper' | 'mental-wellness') => {
    // Only handle sound-alert in AppNew
    if (page === 'sound-alert') {
      handleNavigate(page)
    }
  }

  return (
    <div className="app">
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigateFromHome} />
      )}
      {currentPage === 'sound-alert' && (
        <SoundAlertPage onNavigateHome={handleNavigateHome} />
      )}
    </div>
  )
}

export default App
