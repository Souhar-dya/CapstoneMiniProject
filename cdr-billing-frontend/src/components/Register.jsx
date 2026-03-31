import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/api'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [planId, setPlanId] = useState('')
  const [plans, setPlans] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(true)

  // Fetch available plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log('Fetching plans...')
        const plansData = await api.getPlans()
        console.log('Plans response:', plansData)
        console.log('Type of plansData:', typeof plansData)
        
        let plansList = []
        if (Array.isArray(plansData)) {
          plansList = plansData
        } else if (plansData && typeof plansData === 'object') {
          plansList = plansData.data || plansData.plans || []
        }
        
        console.log('Processed plans list:', plansList)
        setPlans(plansList)
        
        if (plansList.length > 0) {
          const firstPlanId = plansList[0]._id || plansList[0].id
          console.log('Setting default plan to:', firstPlanId)
          setPlanId(firstPlanId)
        }
      } catch (err) {
        console.error('Failed to fetch plans:', err)
        setError(`Failed to load plans: ${err.message}`)
        setPlans([])
      } finally {
        setLoadingPlans(false)
      }
    }
    fetchPlans()
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    console.log('Registration attempt:', {
      name,
      email,
      mobileNumber,
      planId,
    })

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (mobileNumber.length !== 10) {
      setError('Mobile number must be exactly 10 digits')
      return
    }

    if (!planId) {
      setError('Please select a plan')
      return
    }

    setLoading(true)

    try {
      const registrationData = {
        name,
        email,
        mobile_number: mobileNumber,
        password,
        plan_id: planId,
      }
      console.log('Sending registration data:', registrationData)
      await api.register(registrationData)
      
      // Clear form
      setName('')
      setEmail('')
      setMobileNumber('')
      setPassword('')
      setConfirmPassword('')
      
      // Show success and redirect
      alert('Registration successful! Please login with your credentials.')
      navigate('/login')
    } catch (err) {
      console.error('Registration error:', err)
      // More user-friendly error messages
      if (err.message.includes('already exists')) {
        setError('Email already exists. Please use a different email or login with existing account.')
      } else if (err.message.includes('Invalid plan')) {
        setError('Selected plan is invalid. Please choose another plan.')
      } else {
        setError(err.message || 'Registration failed')
      }
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
                <span className="text-3xl">🎯</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
              <p className="text-gray-500">Create your CDR Billing account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                  👤 Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  📧 Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-800 mb-2">
                  📱 Mobile Number (10 digits)
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  maxLength="10"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                  required
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label htmlFor="planId" className="block text-sm font-semibold text-gray-800 mb-2">
                  💳 Select Plan
                </label>
                {loadingPlans ? (
                  <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Loading plans...
                  </div>
                ) : !loadingPlans && plans.length === 0 ? (
                  <div className="w-full px-4 py-2.5 border-2 border-red-200 rounded-xl bg-red-50 text-red-600 text-sm">
                    ⚠️ No plans available
                  </div>
                ) : (
                  <select
                    id="planId"
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    disabled={plans.length === 0}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300 cursor-pointer appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"%233b82f6\\" stroke-width=\\"2\\"\\3e%3cpolyline points=\\"6 9 12 15 18 9\\"\\3e%3c/polyline\\3e%3c/svg\\3e")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem'
                    }}
                    required
                  >
                    <option value="">Choose a plan</option>
                    {plans.map((plan) => {
                      const planValue = plan._id || plan.id
                      return (
                        <option key={planValue} value={planValue}>
                          {plan.name} {plan.price ? `- ₹${plan.price}/month` : ''}
                        </option>
                      )
                    })}
                  </select>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                  🔐 Password (min 6 characters)
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                  ✅ Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
                  ⚠️ {error}
                </div>
              )}

              {/* Register Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 mt-6"
              >
                {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">ALREADY MEMBER?</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">
                Have an existing account?
              </p>
              <Link 
                to="/login" 
                className="inline-block w-full py-3 px-4 border-2 border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                🔓 Login Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
