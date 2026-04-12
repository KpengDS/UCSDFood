import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
  <div>
    <h1>Welcome to Food App 🍔</h1>
    <p>This is our first React app!</p>
  </div>
)
}

export default App
