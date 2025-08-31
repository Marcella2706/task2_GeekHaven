const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {


    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async register(userData: {
    fullName: string;
    email: string;
    password: string;
    role?: 'buyer' | 'seller';
    phone?: string;
    location?: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async googleAuth(token: string, role: 'buyer' | 'seller' = 'buyer'): Promise<ApiResponse> {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token, role })
    });
  }

  async refreshToken(): Promise<ApiResponse> {
    return this.request('/auth/refresh', { method: 'POST' });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request('/users/profile');
  }

  async updateProfile(data: any): Promise<ApiResponse> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse> {
    return this.request('/users/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async removeFromCart(productId: string): Promise<ApiResponse> {
    return this.request(`/users/cart/${productId}`, { method: 'DELETE' });
  }

  async clearCart(): Promise<ApiResponse> {
    return this.request('/users/cart', { method: 'DELETE' });
  }

  async getWishlist(): Promise<ApiResponse> {
    return this.request('/users/wishlist');
  }

  async addToWishlist(productId: string): Promise<ApiResponse> {
    return this.request('/users/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse> {
    return this.request(`/users/wishlist/${productId}`, { method: 'DELETE' });
  }

  async getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProductById(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any): Promise<ApiResponse> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id: string, productData: any): Promise<ApiResponse> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  async toggleProductLike(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}/like`, { method: 'POST' });
  }

  async getCategories(): Promise<ApiResponse> {
    return this.request('/products/categories');
  }

  async createOrder(orderData: {
    items: Array<{ productId: string; quantity?: number }>;
    shippingAddress: any;
    paymentMethod: string;
  }): Promise<ApiResponse> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getUserOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrderById(orderId: string): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}`);
  }

  async cancelOrder(orderId: string, reason: string): Promise<ApiResponse> {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  async getSellers(params: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    minRating?: number;
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/sellers${queryString ? `?${queryString}` : ''}`);
  }

  async getSellerProfile(sellerId: string): Promise<ApiResponse> {
    return this.request(`/sellers/${sellerId}`);
  }

  async getSellerReviews(
    sellerId: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
  
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        (typeof value !== "string" || (value as string).trim() !== "")
      ) {
        queryParams.append(key, value.toString());
      }
    });
    const response = await fetch(`/api/sellers/${sellerId}/reviews?${queryParams}`);
    return this.handleResponse(response);
  }
  

  async updateSellerProfile(data: any): Promise<ApiResponse> {
    return this.request('/sellers/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getSellerDashboard(): Promise<ApiResponse> {
    return this.request('/sellers/dashboard/analytics');
  }

  async sendMessage(data: {
    receiverId: string;
    content: string;
    type?: 'text' | 'image' | 'product';
    productReference?: string;
  }): Promise<ApiResponse> {
    return this.request('/chat/send', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getChatMessages(userId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/chat/${userId}${queryString ? `?${queryString}` : ''}`);
  }

  async getUserChats(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && (typeof value !== 'string' || value !== '')) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/chat/conversations${queryString ? `?${queryString}` : ''}`);
  }

  async markMessagesAsRead(userId: string): Promise<ApiResponse> {
    return this.request(`/chat/${userId}/read`, { method: 'PUT' });
  }

  async getUnreadCount(): Promise<ApiResponse> {
    return this.request('/chat/unread-count');
  }
  
  async addAddress(addressData: any): Promise<ApiResponse> {
    return this.request('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  }

  async updateAddress(addressId: string, addressData: any): Promise<ApiResponse> {
    return this.request(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    });
  }

  async deleteAddress(addressId: string): Promise<ApiResponse> {
    return this.request(`/users/addresses/${addressId}`, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
export default apiService;