import './styles/app.css'
import { useEffect, useState } from 'react'
import Home from './components/Home/Home';

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [isLoaded, setIsLoaded] = useState(false);
  const startScreen = async () => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000)
  }

  // Load the app and transition to the start menu when done
  useEffect(() => {
    if (!isLoaded) {
      startScreen()
    }
  }, [isLoaded])



  // While loading - Welcome Message
  if (!isLoaded) {
    return (
      <>
        <div id='welcome-message'>
          <h1>Welcome to Appolio</h1>
        </div>
      </>
    )
    // When loaded - Menu
  } else {
    return (
      <Home />
    )
  }
}

export default App
