import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md animate-slide-up">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">CDR Billing System</h1>
        <p className="text-center text-gray-600 text-sm mb-8">Sign in to your account</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-500 hover:text-blue-600 transition-colors">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

