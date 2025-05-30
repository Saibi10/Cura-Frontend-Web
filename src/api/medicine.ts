import api from './config';

export interface Medicine {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    requiresPrescription: boolean;
    images: Array<{
        url: string;
        isPrimary: boolean;
    }>;
    manufacturer: string;
    expiryDate: string;
}

export interface MedicinePreset {
    _id: string;
    name: string;
    medicines: Array<{
        medicine: {
            _id: string;
            name: string;
            price: number;
            images: Array<{
                url: string;
                isPrimary: boolean;
            }>;
        };
        quantity: number;
    }>;
}

export const medicineApi = {
    // Get all medicines
    getAllMedicines: async (): Promise<{ success: boolean; data?: Medicine[]; message?: string }> => {
        try {
            const response = await api.get('/medicines');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch medicines',
            };
        }
    },

    // Get medicine by ID
    getMedicineById: async (id: string): Promise<{ success: boolean; data?: Medicine; message?: string }> => {
        try {
            const response = await api.get(`/medicines/${id}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch medicine',
            };
        }
    },

    // Search medicines
    searchMedicines: async (query: string): Promise<{ success: boolean; medicines?: Medicine[]; message?: string }> => {
        try {
            const response = await api.get(`/medicines/search?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to search medicines',
            };
        }
    },

    // Get medicine presets
    getPresets: async (): Promise<{ success: boolean; presets?: MedicinePreset[]; message?: string }> => {
        try {
            const response = await api.get('/medicines/presets');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch presets',
            };
        }
    },

    // Create medicine preset
    createPreset: async (presetData: Omit<MedicinePreset, '_id'>): Promise<{ success: boolean; preset?: MedicinePreset; message?: string }> => {
        try {
            const response = await api.post('/medicines/presets', presetData);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create preset',
            };
        }
    },

    // Delete medicine preset
    deletePreset: async (presetId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await api.delete(`/medicines/presets/${presetId}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete preset',
            };
        }
    },
}; 