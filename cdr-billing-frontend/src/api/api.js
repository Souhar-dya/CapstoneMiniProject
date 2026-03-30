// Simple API client for communicating with backend
// 
// ROLE-BASED ACCESS CONTROL:
// ===========================
// ADMIN Users can access:
// - GET  /api/users                - List all users
// - GET  /api/users/me             - Get current admin info
// - GET  /api/plans                - List all plans
// - GET  /api/billing/my           - Get all billing data in system
// - POST /api/billing/generate     - Generate billing for any user
// - PUT  /api/billing/pay/{id}     - Pay any billing
// - GET  /api/cdr/my               - Get all CDR data in system
// - POST /api/cdr                  - Add CDR records
// - GET  /api/cdr/summary/my       - Get user's CDR summary
//
// CUSTOMER Users can access:
// - GET  /api/users/me             - Get own account info
// - GET  /api/plans                - List all plans
// - GET  /api/billing/my           - Get own billing data only
// - PUT  /api/billing/pay/{id}     - Pay own billing only
// - GET  /api/cdr/my               - Get own CDR data only
// - GET  /api/cdr/summary/my       - Get own CDR summary
//
const API_BASE_URL = '/api';

export const apiCall = async (endpoint, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`[API] Adding token to ${method} ${endpoint}`)
  } else {
    console.log(`[API] No token for ${method} ${endpoint}`)
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`[API] ${method} ${API_BASE_URL}${endpoint}`, { hasToken: !!token })
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      let errorDetails = ''
      try {
        const errorData = await response.json()
        console.error('Backend error response:', errorData)
        errorDetails = errorData.detail || errorData.message || JSON.stringify(errorData)
      } catch {
        errorDetails = await response.text()
      }
      throw new Error(`API Error ${response.status}: ${errorDetails}`)
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Common API methods
export const api = {
  // Auth endpoints
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  logout: () => apiCall('/auth/logout', 'POST'),
  register: (userData) => apiCall('/auth/register', 'POST', userData),

  // User endpoints
  getUsers: (token) => apiCall('/users', 'GET', null, token),
  getUser: (id, token) => apiCall(`/users/${id}`, 'GET', null, token),
  getCurrentUser: (token) => apiCall('/users/me', 'GET', null, token),
  updateUser: (id, data, token) => apiCall(`/users/${id}`, 'PUT', data, token),
  deleteUser: (id, token) => apiCall(`/users/${id}`, 'DELETE', null, token),

  // Plan endpoints
  getPlans: (token = null) => apiCall('/plans', 'GET', null, token),
  getPlan: (id, token) => apiCall(`/plans/${id}`, 'GET', null, token),
  createPlan: (data, token) => apiCall('/plans', 'POST', data, token),
  updatePlan: (id, data, token) => apiCall(`/plans/${id}`, 'PUT', data, token),
  deletePlan: (id, token) => apiCall(`/plans/${id}`, 'DELETE', null, token),

  // Billing endpoints
  getBillings: (token) => apiCall('/billing/my', 'GET', null, token),
  getBilling: (id, token) => apiCall(`/billing/${id}`, 'GET', null, token),
  createBilling: (data, token) => apiCall('/billing', 'POST', data, token),
  generateBilling: (userId, billingCycle, token) => 
    apiCall(`/billing/generate?user_id=${userId}&billing_cycle=${billingCycle}`, 'POST', null, token),
  getUserBilling: (userId, token) => apiCall(`/billing/user/${userId}`, 'GET', null, token),

  // CDR endpoints
  getCDRs: (token) => apiCall('/cdr/my', 'GET', null, token),
  getCDR: (id, token) => apiCall(`/cdr/${id}`, 'GET', null, token),
  createCDR: (data, token) => apiCall('/cdr', 'POST', data, token),
  addCDRData: (cdrData, token) => apiCall('/cdr', 'POST', cdrData, token),
  getUserCDR: (userId, token) => apiCall(`/cdr/user/${userId}`, 'GET', null, token),
};
