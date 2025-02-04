import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Hero from './components/custom/Hero'
import Footer from "./components/custom/Footer.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/*Hero*/}
      <Hero/>
    </>
  )
}

export default App
