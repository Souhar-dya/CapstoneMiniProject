import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-500 via-blue-500 to-purple-600 text-white px-8 py-6 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">CDR Billing Dashboard</h1>
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold opacity-90">Welcome, <span className="text-lg">{user.name || 'User'}</span></span>
            {user.role === 'admin' && (
              <button 
                onClick={handleGenerateData}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Generate Sample Data
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex gap-0">
          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 text-sm tracking-wide ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-500 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-50'
              }`}
            >
              Users
            </button>
          )}
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 text-sm tracking-wide ${
              activeTab === 'plans'
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-50'
            }`}
          >
            Plans
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 text-sm tracking-wide ${
              activeTab === 'billing'
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-50'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('cdr')}
            className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 text-sm tracking-wide ${
              activeTab === 'cdr'
                ? 'border-blue-500 text-blue-500 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-50'
            }`}
          >
            CDR
          </button>
        </div>
      </nav>

      <div className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-medium">No data available</p>
          </div>
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
                      <td key={i} className="truncate" title={String(value)}>
                        {String(value).substring(0, 50)}
                      </td>
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
