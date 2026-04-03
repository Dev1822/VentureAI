import './App.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import NewIdea from './pages/NewIdea'
import ReportDetail from './pages/ReportDetails'
import History from './pages/History'
import Compare from './pages/Compare'
import PitchDeck from './pages/PitchDeck'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-idea" element={<NewIdea />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
      </Routes>
    </>
  )
}

export default App
