import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { api } from '../api/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('plans')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')
  
  let user = {}
  try {
    const userStr = localStorage.getItem('user')
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      user = JSON.parse(userStr)
      console.log('[Dashboard] User loaded from storage:', { name: user.name, role: user.role, email: user.email, isAdmin: user.role === 'admin' })
    }
  } catch (err) {
    console.error('Error parsing user from localStorage:', err)
    user = {}
  }

  const loadData = useCallback(async (endpoint) => {
    setLoading(true)
    setError('')

    console.log(`[Dashboard] Loading ${endpoint} with token:`, token ? `${token.substring(0, 20)}...` : 'NO TOKEN')
    
    if (!token) {
      setError('No authentication token found. Please login again.')
      setLoading(false)
      return
    }

    try {
      let response = []
      switch (endpoint) {
        case 'users':
          response = await api.getUsers(token)
          break
        case 'plans':
          response = await api.getPlans(token)
          break
        case 'billing':
          response = await api.getBillings(token)
          break
        case 'cdr':
          response = await api.getCDRs(token)
          break
        default:
          response = []
      }
      setData(Array.isArray(response) ? response : response.data || [])
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err)
      setError(err.message || `Failed to load ${endpoint}`)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData(activeTab)
  }, [activeTab, loadData])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleGenerateData = async () => {
    if (!window.confirm('Generate sample billing and CDR data for all users?')) {
      return
    }

    try {
      // Get all users first to generate data for them
      const users = await api.getUsers(token)
      const currentCycle = new Date().toISOString().slice(0, 7) // YYYY-MM

      console.log('[Dashboard] Generating data for users:', users.length)

      // Generate billing for each user
      for (const user of users) {
        try {
          await api.generateBilling(user._id, currentCycle, token)
          console.log(`[Dashboard] Generated billing for user ${user._id}`)
        } catch (err) {
          console.error(`Failed to generate billing for ${user._id}:`, err)
        }
      }

      // Generate sample CDR data
      for (const user of users) {
        try {
          const callCDR = {
            user_id: user._id,
            type: 'call',
            duration: Math.floor(Math.random() * 300),
            destination_number: `555${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
          }
          await api.addCDRData(callCDR, token)

          const smsCDR = {
            user_id: user._id,
            type: 'sms',
            destination_number: `555${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
          }
          await api.addCDRData(smsCDR, token)

          const dataCDR = {
            user_id: user._id,
            type: 'data',
            data_used: Math.floor(Math.random() * 1000) / 100,
          }
          await api.addCDRData(dataCDR, token)

          console.log(`[Dashboard] Added CDR records for user ${user._id}`)
        } catch (err) {
          console.error(`Failed to add CDR records for ${user._id}:`, err)
        }
      }

      alert('Sample data generated successfully! Refresh to see updated data.')
      loadData(activeTab)
    } catch (err) {
      console.error('Error generating data:', err)
      alert('Failed to generate data: ' + err.message)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>CDR Billing Dashboard</h1>
        <div className="header-right">
          <span className="user-name">Welcome, {user.name || 'User'}</span>
          {user.role === 'admin' && (
            <button className="generate-btn" onClick={handleGenerateData}>
              Generate Sample Data
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="tabs">
        {user.role === 'admin' && (
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        )}
        <button
          className={`tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Plans
        </button>
        <button
          className={`tab ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing
        </button>
        <button
          className={`tab ${activeTab === 'cdr' ? 'active' : ''}`}
          onClick={() => setActiveTab('cdr')}
        >
          CDR
        </button>
      </nav>

      <div className="content">
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && data.length === 0 && (
          <p className="no-data">No data available</p>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx}>
                    {Object.values(item).map((value, i) => (
                      <td key={i}>{String(value).substring(0, 50)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
