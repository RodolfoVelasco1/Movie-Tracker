import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AppRoutes } from './routes/AppRoutes'

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <AppRoutes/>
      </div>
    </>
  )
}

export default App
