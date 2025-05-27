import apiClient from './apiClient';

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Log the response to debug the structure
    console.log('Login response:', response.data);
    
    // Adjust based on your actual API response structure
    // If your API returns { data: { token: "...", user: {...} } }
    if (response.data && response.data.data) {
      return {
        token: response.data.data.token,
        user: response.data.data.user || response.data.data,
        message: response.data.message
      };
    }
    
    // If your API returns { token: "...", user: {...} } directly
    if (response.data && response.data.token) {
      return {
        token: response.data.token,
        user: response.data.user,
        message: response.data.message
      };
    }
    
    // Fallback - return the response as is and let AuthContext handle it
    return response.data;
    
  } catch (error) {
    console.error('Login API error:', error);
    
    // Handle error response structure
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    
    throw { error: error.message || 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    
    // Log the response to debug the structure
    console.log('Register response:', response.data);
    
    // Adjust based on your actual API response structure
    // If your API returns { data: { token: "...", user: {...} } }
    if (response.data && response.data.data) {
      return {
        token: response.data.data.token,
        user: response.data.data.user || response.data.data,
        message: response.data.message
      };
    }
    
    // If your API returns { token: "...", user: {...} } directly
    if (response.data && response.data.token) {
      return {
        token: response.data.token,
        user: response.data.user,
        message: response.data.message
      };
    }
    
    // Fallback - return the response as is
    return response.data;
    
  } catch (error) {
    console.error('Register API error:', error);
    
    // Handle error response structure
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    
    throw { error: error.message || 'Registration failed' };
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout API error:', error);
    
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    
    throw { error: error.message || 'Logout failed' };
  }
};