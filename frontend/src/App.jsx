import './App.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Routes,Route } from 'react-router-dom'

function App() {

  return (  
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    </>
  )
}

export default App
