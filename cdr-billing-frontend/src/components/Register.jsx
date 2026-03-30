import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'
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
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

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
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="planId">Select Plan</label>
            {loadingPlans && plans.length === 0 ? (
              <p style={{ color: '#667eea', margin: '10px 0', fontSize: '12px' }}>Loading plans...</p>
            ) : null}
            {!loadingPlans && plans.length === 0 ? (
              <p style={{ color: '#dc3545', margin: '10px 0', fontSize: '12px' }}>No plans available. Check backend.</p>
            ) : null}
            <select
              id="planId"
              value={planId}
              onChange={(e) => {
                console.log('Selected plan:', e.target.value)
                setPlanId(e.target.value)
              }}
              disabled={plans.length === 0}
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
              <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                Selected: {planId}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <div className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
