/**
 * Authentication Context
 * 
 * Centralized authentication state management.
 * Provides auth state and methods to all child components.
 * 
 * Production improvements:
 * - Centralized auth state (no prop drilling)
 * - Token refresh logic in one place
 * - Consistent logout handling
 * - Ready for token rotation/refresh improvements
 */

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiGet, apiPost, setAuthToken, clearAuthToken } from '../api/apiClient';
import { AUTH } from '../api/endpoints';

const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState('');
    const [myUsername, setMyUsername] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tickInterval, setTickInterval] = useState(null);

    /**
     * Decode JWT token and extract user info
     */
    const decodeToken = useCallback((token) => {
        try {
            const decodedJwt = jwtDecode(token);
            setIsAdmin(decodedJwt.adm || false);
            setMyUsername(decodedJwt.name || null);
            return decodedJwt;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }, []);

    /**
     * Set token in both state and API client
     */
    const setToken = useCallback((token) => {
        setJwtToken(token);
        setAuthToken(token);
        if (token) {
            decodeToken(token);
        }
    }, [decodeToken]);

    /**
     * Clear token on logout
     */
    const clearToken = useCallback(() => {
        setJwtToken('');
        setMyUsername(null);
        setIsAdmin(false);
        clearAuthToken();
    }, []);

    /**
     * Login function
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<object>} Login result
     */
    const login = useCallback(async (email, password) => {
        try {
            const data = await apiPost(AUTH.LOGIN, { email, password });
            
            if (data.error) {
                return { error: data.error };
            }
            
            setToken(data.access_token);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { error: error.message || 'Login failed' };
        }
    }, [setToken]);

    /**
     * Register function
     * @param {object} userData - User registration data
     * @returns {Promise<object>} Registration result
     */
    const register = useCallback(async (userData) => {
        try {
            const data = await apiPost(AUTH.REGISTER, userData);
            
            if (data.error) {
                return { error: data.error };
            }
            
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { error: error.message || 'Registration failed' };
        }
    }, []);

    /**
     * Logout function
     */
    const logOut = useCallback(async () => {
        try {
            await apiGet(AUTH.LOGOUT);
        } catch (error) {
            // Logout should continue even if API call fails
            console.log('Logout API error (continuing anyway):', error);
        } finally {
            clearToken();
            toggleRefresh(false);
        }
    }, [clearToken]);

    /**
     * Toggle token refresh interval
     * Keeps the token fresh by calling refresh endpoint
     */
    const toggleRefresh = useCallback((status) => {
        if (status) {
            // Refresh token every 10 minutes (600000ms)
            const interval = setInterval(async () => {
                try {
                    const data = await apiGet(AUTH.REFRESH);
                    if (data.access_token) {
                        setToken(data.access_token);
                    }
                } catch (error) {
                    console.log('Token refresh failed:', error);
                    // On refresh failure, user might be logged out
                    // Could trigger logout here if needed
                }
            }, 600000);
            
            setTickInterval(interval);
        } else {
            if (tickInterval) {
                clearInterval(tickInterval);
                setTickInterval(null);
            }
        }
    }, [tickInterval, setToken]);

    /**
     * Initialize auth state on mount
     * Checks for existing valid token
     */
    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await apiGet(AUTH.REFRESH);
                if (data.access_token) {
                    setToken(data.access_token);
                    toggleRefresh(true);
                }
            } catch (error) {
                // User not logged in - this is expected
                console.log('No valid token found');
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Cleanup on unmount
        return () => {
            if (tickInterval) {
                clearInterval(tickInterval);
            }
        };
    }, []); // Empty dependency - only run on mount

    /**
     * Update admin status
     */
    const setUserAdmin = useCallback((status) => {
        setIsAdmin(status);
    }, []);

    /**
     * Update username
     */
    const setUserUsername = useCallback((name) => {
        setMyUsername(name);
    }, []);

    const value = {
        // State
        jwtToken,
        myUsername,
        isAdmin,
        loading,
        
        // Setters
        setJwtToken: setToken,
        setIsAdmin: setUserAdmin,
        setMyUsername: setUserUsername,
        
        // Actions
        login,
        register,
        logOut,
        toggleRefresh,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use auth context
 * @returns {object} Auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;