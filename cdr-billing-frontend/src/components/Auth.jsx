import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'
import { api } from '../api/api'

export default function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.login({ email, password })
      console.log('Login response:', response)
      
      // Backend returns access_token, not token
      const token = response.access_token || response.token
      
      if (!token) {
        throw new Error('No token in response')
      }
      
      localStorage.setItem('token', token)
      console.log('Token stored:', token.substring(0, 20) + '...')
      
      // Fetch current user info to get is_admin field
      try {
        const userInfo = await api.getCurrentUser(token)
        console.log('User info fetched:', userInfo)
        localStorage.setItem('user', JSON.stringify(userInfo))
      } catch (err) {
        console.error('Failed to fetch user info:', err)
        // Fallback: store just email if user info fetch fails
        localStorage.setItem('user', JSON.stringify({ email }))
      }
      
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>CDR Billing System</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
