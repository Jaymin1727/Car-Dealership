const BASE_URL = 'http://localhost:8080/api';

// Custom wrapper around native fetch that acts like axios
const apiClient = {
  get: (url, options = {}) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options = {}) => request(url, { ...options, method: 'POST', body }),
  put: (url, body, options = {}) => request(url, { ...options, method: 'PUT', body }),
  delete: (url, options = {}) => request(url, { ...options, method: 'DELETE' }),
};

async function request(url, options = {}) {
  // Build headers
  const headers = new Headers(options.headers || {});
  
  // Content type
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Auth interceptor: read token from localStorage
  const token = localStorage.getItem('mmotor_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${url}`, config);

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Fallback if response is not JSON
    }
    throw new Error(errorMessage);
  }

  // Handle empty/no-content response
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default apiClient;
