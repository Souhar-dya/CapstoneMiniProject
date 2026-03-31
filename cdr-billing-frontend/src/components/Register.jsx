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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md animate-slide-up">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-center text-gray-600 text-sm mb-8">Join the CDR Billing System</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
              required
            />
          </div>

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
            <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
            <input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="planId" className="form-label">Select Plan</label>
            {loadingPlans && plans.length === 0 ? (
              <p className="text-blue-500 text-xs my-2">Loading plans...</p>
            ) : null}
            {!loadingPlans && plans.length === 0 ? (
              <p className="text-red-600 text-xs my-2">No plans available. Check backend.</p>
            ) : null}
            <select
              id="planId"
              value={planId}
              onChange={(e) => {
                console.log('Selected plan:', e.target.value)
                setPlanId(e.target.value)
              }}
              disabled={plans.length === 0}
              className="form-select disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {plans.length === 0 ? 'No plans available' : 'Choose a plan'}
              </option>
              {plans.map((plan) => {
                const planValue = plan._id || plan.id
                return (
                  <option key={planValue} value={planValue}>
                    {plan.name} {plan.price ? `- $${plan.price}/month` : ''}
                  </option>
                )
              })}
            </select>
            {planId && (
              <p className="text-xs text-gray-600 mt-2">
                Selected: <span className="font-semibold text-blue-500">{planId.slice(0, 8)}...</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 6 characters)"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-600 transition-colors">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
