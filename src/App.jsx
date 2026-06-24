import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import CircuitsPage from './pages/CircuitsPage'
import CircuitDetail from './pages/CircuitDetail'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import BookingConfirmation from './pages/BookingConfirmation'
import BookingRecap from './pages/BookingRecap'
import GuideSelection from './pages/GuideSelection'
import Chat from './pages/Chat'
import Footer from './components/Footer'
import InstallPWA from './components/InstallPWA'
import './App.css'

const AUTH_ROUTES = ['/inscription', '/connexion']

function App() {
  const { pathname } = useLocation()
  const isAuth = AUTH_ROUTES.includes(pathname)

  return (
    <AuthProvider>
    <div className="app">
      {!isAuth && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/circuits" element={<CircuitsPage />} />
          <Route path="/circuits/:slug" element={<CircuitDetail />} />
          <Route path="/reservation/recap" element={<BookingRecap />} />
          <Route path="/reservation/guides" element={<GuideSelection />} />
          <Route path="/reservation/confirmation" element={<BookingConfirmation />} />
          <Route path="/checkout/confirmer" element={<BookingConfirmation />} />
          <Route path="/chat/:guideId" element={<Chat />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/connexion" element={<Login />} />
        </Routes>
      </main>
      {!isAuth && <Footer />}
      <InstallPWA />
    </div>
    </AuthProvider>
  )
}

export default App
