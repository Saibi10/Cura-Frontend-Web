import api from './config';

export interface OrderItem {
    medicine: {
        _id: string;
        name: string;
        price: number;
    };
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    createdAt: string;
}

export const orderApi = {
    // Get all orders for current user
    getOrders: async (): Promise<{ success: boolean; orders?: Order[]; message?: string }> => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch orders',
            };
        }
    },

    // Get order by ID
    getOrderById: async (orderId: string): Promise<{ success: boolean; order?: Order; message?: string }> => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch order',
            };
        }
    },

    // Create new order
    createOrder: async (orderData: {
        items: Array<{ medicineId: string; quantity: number }>;
        shippingAddress: string;
        paymentMethod: string;
    }): Promise<{ success: boolean; order?: Order; message?: string }> => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create order',
            };
        }
    },

    // Cancel order
    cancelOrder: async (orderId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await api.post(`/orders/${orderId}/cancel`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to cancel order',
            };
        }
    },

    // Update order status (admin only)
    updateOrderStatus: async (
        orderId: string,
        status: Order['status']
    ): Promise<{ success: boolean; order?: Order; message?: string }> => {
        try {
            const response = await api.put(`/orders/${orderId}/status`, { status });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update order status',
            };
        }
    },

    // Update payment status
    updatePaymentStatus: async (
        orderId: string,
        paymentStatus: Order['paymentStatus']
    ): Promise<{ success: boolean; order?: Order; message?: string }> => {
        try {
            const response = await api.put(`/orders/${orderId}/payment`, { paymentStatus });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update payment status',
            };
        }
    },
}; 