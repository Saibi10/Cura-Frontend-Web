import api from './config';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
    requiresOTP?: boolean;
}

export interface RegisterResponse {
    success: boolean;
    User?: User;
    message?: string;
}

export const userApi = {
    // Login user
    login: async (email: string, password: string, otp?: string): Promise<LoginResponse> => {
        try {
            const response = await api.post('/users/me', { email, password, otp });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
                requiresOTP: error.response?.data?.requiresOTP,
            };
        }
    },

    // Register new user
    register: async (userData: any): Promise<RegisterResponse> => {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    },

    // Verify OTP
    verifyOTP: async (userId: string, otp: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await api.post('/users/verify-email-otp', { userId, otp });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'OTP verification failed',
            };
        }
    },

    // Get current user profile
    getProfile: async (): Promise<{ success: boolean; user?: User; message?: string }> => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch profile',
            };
        }
    },

    // Update user profile
    updateProfile: async (userData: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> => {
        try {
            const response = await api.put('/users/profile', userData);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update profile',
            };
        }
    },
}; 