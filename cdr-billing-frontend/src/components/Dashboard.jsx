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
      
      let tableData = Array.isArray(response) ? response : response.data || []

      // If we are looking at billing or CDR, replace user_id with username and email
      if (['billing', 'cdr'].includes(endpoint) && tableData.length > 0) {
        if (user.role === 'admin') {
          // fetch all users to map user_id
          try {
            const allUsers = await api.getUsers(token)
            const userMap = {}
            allUsers.forEach(u => { userMap[u.id || u._id] = u })
            tableData = tableData.map(item => {
              const u = userMap[item.user_id]
              if (u) {
                // eslint-disable-next-line no-unused-vars
                const { user_id, ...rest } = item
                return { username: u.name, email: u.email, ...rest }
              }
              return item
            })
          } catch(e) {
            console.error('Failed to fetch users to map names', e)
          }
        } else {
          // Customer is only seeing their own data
          tableData = tableData.map(item => {
            // eslint-disable-next-line no-unused-vars
            const { user_id, ...rest } = item
            return { username: user.name, email: user.email, ...rest }
          })
        }
      }

      setData(tableData)
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err)
      setError(err.message || `Failed to load ${endpoint}`)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [token, user.role, user.name, user.email])

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

  const tabs = [
    ...(user.role === 'admin' ? [{ key: 'users', label: 'Users' }] : []),
    { key: 'plans', label: 'Plans' },
    { key: 'billing', label: 'Billing' },
    { key: 'cdr', label: 'CDR' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left side: Logo & Desktop Tabs */}
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded shadow-sm flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none">C</span>
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight block sm:mr-4">CDR Billing</span>
              </div>
              
              {/* Desktop Nav Tabs */}
              <div className="hidden sm:flex h-full items-center gap-6 lg:gap-8 ml-4 lg:ml-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center px-1 py-5 border-b-2 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'border-indigo-600 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Actions & User */}
            <div className="flex items-center gap-3 sm:gap-4">
              {user.role === 'admin' && (
                <button 
                  onClick={handleGenerateData}
                  className="text-xs sm:text-sm px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                >
                  Generate Data
                </button>
              )}
              <div className="flex items-center gap-3 border-l border-gray-200 pl-3 sm:pl-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-700 leading-tight">{user.name || 'User'}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{user.role || 'Member'}</span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold sm:hidden">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors ml-2"
                  title="Sign out"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="sm:hidden border-t border-gray-200 bg-gray-50 overflow-x-auto">
          <div className="flex px-4 gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 flex-shrink-0 text-sm font-medium border-b-2 ${
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] z-10 relative relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900 capitalize tracking-tight m-0">
            {tabs.find(t => t.key === activeTab)?.label || activeTab}
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-sm font-medium">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="bg-white border text-center border-gray-200 border-dashed rounded-lg py-16 px-4 flex flex-col items-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
               </svg>
             </div>
            <p className="text-gray-900 font-medium text-base mb-1">No data available</p>
            <p className="text-gray-500 text-sm">Check back later or generate sample data.</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="table-container shadow-sm border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} scope="col" className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      {Object.values(item).map((value, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs" title={String(value)}>
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
