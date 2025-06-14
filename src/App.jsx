import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tentang from './pages/Tentang'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Home />
      <Tentang />
    </>
  )
}

export default App
