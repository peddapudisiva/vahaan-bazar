import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home.jsx'
import BikeDetail from './pages/BikeDetail.jsx'
import Compare from './pages/Compare.jsx'
import Booking from './pages/Booking.jsx'
import Showrooms from './pages/Showrooms.jsx'
import Launches from './pages/Launches.jsx'
import NotFound from './pages/NotFound.jsx'
import { CompareProvider } from './context/CompareContext.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'
import CompareBar from './components/CompareBar.jsx'
import MotionPage from './components/MotionPage.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DealerDashboard from './pages/DealerDashboard.jsx'
import Profile from './pages/Profile.jsx'
import UsedList from './pages/UsedList.jsx'
import UsedDetail from './pages/UsedDetail.jsx'
import SellUsed from './pages/SellUsed.jsx'

function Header() {
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-30 border-b border-secondary-200 bg-white/80 backdrop-blur-md dark:border-secondary-800 dark:bg-secondary-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="https://tse1.mm.bing.net/th/id/OIP.Axi2UD1LU2wRwxZ_EUe3lwHaEK?pid=Api&P=0&h=220" alt="Vahaan Bazar" className="h-7 w-7 rounded" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/logo.svg'}} />
          <span className="text-lg font-semibold text-secondary-900 dark:text-white">Vahaan Bazar</span>
        </NavLink>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/">Home</NavLink>
          <NavLink className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/compare">Compare</NavLink>
          <NavLink className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/booking">Book Test Ride</NavLink>
          <NavLink className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/showrooms">Showrooms</NavLink>
          <NavLink className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/launches">Launches</NavLink>
          <NavLink className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/used">Used</NavLink>
          {user?.role === 'dealer' || user?.role === 'admin' ? (
            <NavLink className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/dealer">Dealer</NavLink>
          ) : null}
          <button onClick={toggle} className="ml-2 rounded-lg border border-secondary-300 px-2 py-1 text-xs text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {!user ? (
            <>
              <NavLink className={({isActive}) => `rounded-md border border-secondary-300 px-2 py-1 hover:bg-secondary-50 dark:border-secondary-700 dark:hover:bg-secondary-800 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/login">Login</NavLink>
              <NavLink className={({isActive}) => `rounded-md border border-primary-500 px-2 py-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-secondary-800 ${isActive ? 'text-primary-700' : ''}`} to="/register">Register</NavLink>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <NavLink className={({isActive}) => `rounded-md border border-secondary-300 px-2 py-1 hover:bg-secondary-50 dark:border-secondary-700 dark:hover:bg-secondary-800 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/profile">Profile</NavLink>
              <NavLink className={({isActive}) => `rounded-md border border-secondary-300 px-2 py-1 hover:bg-secondary-50 dark:border-secondary-700 dark:hover:bg-secondary-800 ${isActive ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-200'}`} to="/used/sell">Sell</NavLink>
              <span className="hidden text-secondary-600 dark:text-secondary-300 sm:inline">Hi, {user.name}</span>
              <button onClick={logout} className="rounded-md border border-secondary-300 px-2 py-1 text-xs text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-secondary-200 bg-white dark:border-secondary-800 dark:bg-secondary-900">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-secondary-600 dark:text-secondary-300 md:px-6">
        <p>© {new Date().getFullYear()} Vahaan Bazar. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <AuthProvider>
      <ThemeProvider>
        <CompareProvider>
          <div className="min-h-screen bg-secondary-50 text-secondary-900 dark:bg-secondary-950 dark:text-secondary-100">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<MotionPage><Home /></MotionPage>} />
                  <Route path="/login" element={<MotionPage><Login /></MotionPage>} />
                  <Route path="/register" element={<MotionPage><Register /></MotionPage>} />
                  <Route path="/bike/:id" element={<MotionPage><BikeDetail /></MotionPage>} />
                  <Route path="/compare" element={<MotionPage><Compare /></MotionPage>} />
                  <Route path="/booking" element={<MotionPage><Booking /></MotionPage>} />
                  <Route path="/showrooms" element={<MotionPage><Showrooms /></MotionPage>} />
                  <Route path="/launches" element={<MotionPage><Launches /></MotionPage>} />
                  <Route path="/used" element={<MotionPage><UsedList /></MotionPage>} />
                  <Route path="/used/:id" element={<MotionPage><UsedDetail /></MotionPage>} />
                  <Route element={<ProtectedRoute roles={["user","dealer","admin"]} /> }>
                    <Route path="/profile" element={<MotionPage><Profile /></MotionPage>} />
                    <Route path="/used/sell" element={<MotionPage><SellUsed /></MotionPage>} />
                  </Route>
                  <Route element={<ProtectedRoute roles={["dealer","admin"]} /> }>
                    <Route path="/dealer" element={<MotionPage><DealerDashboard /></MotionPage>} />
                  </Route>
                  <Route path="*" element={<MotionPage><NotFound /></MotionPage>} />
                </Routes>
              </AnimatePresence>
            </main>
            <CompareBar />
            <Footer />
          </div>
        </CompareProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
