import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, loginUser, registerUser } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    getMe()
      .then((data) => {
        setUser(data.user)
      })
      .catch((err) => {
        console.error('Failed to verify token:', err)
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const data = await loginUser(username, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      localStorage.removeItem('token')
      setUser(null)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, password) => {
    setLoading(true)
    try {
      const data = await registerUser(username, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      localStorage.removeItem('token')
      setUser(null)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
