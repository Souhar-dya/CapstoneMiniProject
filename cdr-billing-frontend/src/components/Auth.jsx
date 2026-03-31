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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-md shadow-sm p-8 sm:p-10">
        <h1 className="text-center text-lg font-semibold text-gray-900 mb-6">Sign in to your account</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs text-gray-700 mb-1">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="text-xs text-gray-700">Password</label>
              <button type="button" className="text-[11px] text-indigo-600 hover:underline">Forgot password?</button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-xs text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-8 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-500 mt-6">
          Not a member?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Sign up to try free trial
          </Link>
        </p>
      </div>
    </div>
  )
}

