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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-md shadow-sm p-8 sm:p-10">
        <h1 className="text-center text-lg font-semibold text-gray-900 mb-6">Create your account</h1>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-xs text-gray-700 mb-1">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

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
            <label htmlFor="mobileNumber" className="block text-xs text-gray-700 mb-1">Mobile number</label>
            <input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength="10"
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="planId" className="block text-xs text-gray-700 mb-1">Plan</label>
            {loadingPlans ? (
              <div className="w-full h-8 px-2 text-xs border border-gray-300 rounded bg-gray-50 text-gray-500 flex items-center">
                Loading plans...
              </div>
            ) : !loadingPlans && plans.length === 0 ? (
              <div className="w-full h-8 px-2 text-xs border border-red-300 rounded bg-red-50 text-red-600 flex items-center">
                No plans available
              </div>
            ) : (
              <select
                id="planId"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                disabled={plans.length === 0}
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              >
                <option value="">Choose a plan</option>
                {plans.map((plan) => {
                  const planValue = plan._id || plan.id
                  return (
                    <option key={planValue} value={planValue}>
                      {plan.name} {plan.price ? `- $${plan.price}/month` : ''}
                    </option>
                  )
                })}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs text-gray-700 mb-1">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
