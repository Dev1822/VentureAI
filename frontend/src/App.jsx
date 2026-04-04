import './App.css'
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Lazy load all page components
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NewIdea = lazy(() => import('./pages/NewIdea'))
const ReportDetail = lazy(() => import('./pages/ReportDetails'))
const History = lazy(() => import('./pages/History'))
const Compare = lazy(() => import('./pages/Compare'))
const PitchDeck = lazy(() => import('./pages/PitchDeck'))

// Simple loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  )
}

export default App
