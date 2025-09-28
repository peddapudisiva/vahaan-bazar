import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, register as apiRegister, me as apiMe } from '../utils/api'

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // bootstrap from localStorage
  useEffect(() => {
    const t = localStorage.getItem('vb_token')
    const u = localStorage.getItem('vb_user')
    if (t) setToken(t)
    if (u) {
      try { setUser(JSON.parse(u)) } catch { setUser(null) }
    }
    setLoading(false)
  }, [])

  const persist = (t, u) => {
    if (t) localStorage.setItem('vb_token', t)
    if (u) localStorage.setItem('vb_user', JSON.stringify(u))
  }

  const clear = () => {
    localStorage.removeItem('vb_token')
    localStorage.removeItem('vb_user')
  }

  const login = useCallback(async (payload) => {
    const { user: u, token: t } = await apiLogin(payload)
    setUser(u)
    setToken(t)
    persist(t, u)
    return u
  }, [])

  const register = useCallback(async (payload) => {
    const { user: u, token: t } = await apiRegister(payload)
    setUser(u)
    setToken(t)
    persist(t, u)
    return u
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    clear()
  }, [])

  const refreshMe = useCallback(async () => {
    try {
      const { user: u } = await apiMe()
      setUser(u)
      if (u) localStorage.setItem('vb_user', JSON.stringify(u))
    } catch {}
  }, [])

  const value = useMemo(() => ({ user, token, loading, login, register, logout, refreshMe }), [user, token, loading, login, register, logout, refreshMe])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
