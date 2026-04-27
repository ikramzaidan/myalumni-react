/**
 * Centralized API client for all HTTP requests.
 * Handles authentication, error handling, and request/response processing.
 * 
 * Production improvements over direct fetch:
 * - Single point for API URL configuration
 * - Automatic Authorization header injection
 * - Consistent error handling
 * - Request/response interceptors ready for expansion
 */

import { API_BASE_URL } from './endpoints';

// Store token in memory (more secure than localStorage for access tokens)
// Note: For production, consider HttpOnly cookies for access tokens
let authToken = '';

/**
 * Set the authentication token
 * @param {string} token - JWT access token
 */
export const setAuthToken = (token) => {
    authToken = token;
};

/**
 * Get the current authentication token
 * @returns {string} Current JWT token
 */
export const getAuthToken = () => authToken;

/**
 * Clear the authentication token (on logout)
 */
export const clearAuthToken = () => {
    authToken = '';
};

/**
 * Build request options with authentication headers
 * @param {object} options - Additional fetch options
 * @returns {object} Complete fetch options with headers
 */
const buildRequestOptions = (options = {}) => {
    const headers = new Headers();

    // Set default Content-Type if not FormData
    if (!(options.body instanceof FormData)) {
        headers.append('Content-Type', 'application/json');
    }

    // Add authorization header if token exists
    if (authToken) {
        headers.append('Authorization', `Bearer ${authToken}`);
    }

    // Merge with provided options
    return {
        credentials: 'include',
        ...options,
        headers: new Headers({
            ...Object.fromEntries(headers),
            ...(options.headers ? Object.fromEntries(new Headers(options.headers)) : {})
        })
    };
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (relative to base URL)
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<object>} Response data
 * @throws {Error} On network error or non-OK response
 */
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = buildRequestOptions(options);

    try {
        const response = await fetch(url, requestOptions);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            // Handle API errors
            if (!response.ok) {
                const error = new Error(data.error || 'API request failed');
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        }

        // For non-JSON responses (like file downloads)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;

    } catch (error) {
        // Log error in development
        if (process.env.NODE_ENV !== 'production') {
            console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
        }
        throw error;
    }
};

/**
 * Convenience methods for common HTTP verbs
 */
export const apiGet = (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return apiRequest(endpoint, { ...options, method: 'POST', body: isFormData ? body : JSON.stringify(body) });
};

export const apiPut = (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return apiRequest(endpoint, { ...options, method: 'PUT', body: isFormData ? body : JSON.stringify(body) });
};

export const apiPatch = (endpoint, body, options = {}) => {
    const isFormData = body instanceof FormData;
    return apiRequest(endpoint, { ...options, method: 'PATCH', body: isFormData ? body : JSON.stringify(body) });
};

export const apiDelete = (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' });

/**
 * Upload file with FormData
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with file
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>} Response data
 */
export const apiUpload = async (endpoint, formData, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = new Headers();
    if (authToken) {
        headers.append('Authorization', `Bearer ${authToken}`);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.error || 'Upload failed');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(`Upload Error:`, error);
        }
        throw error;
    }
};

export default {
    setAuthToken,
    getAuthToken,
    clearAuthToken,
    request: apiRequest,
    get: apiGet,
    post: apiPost,
    put: apiPut,
    patch: apiPatch,
    delete: apiDelete,
    upload: apiUpload
};