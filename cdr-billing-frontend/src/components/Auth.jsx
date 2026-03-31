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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header with accent */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-500">CDR Billing System</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2.5">
                  📧 Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2.5">
                  🔐 Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
                  ⚠️ {error}
                </div>
              )}

              {/* Login Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 mt-6"
              >
                {loading ? '⏳ Logging in...' : '🚀 Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">NEW HERE?</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">
                Don't have an account?
              </p>
              <Link 
                to="/register" 
                className="inline-block w-full py-3 px-4 border-2 border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                ✨ Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

