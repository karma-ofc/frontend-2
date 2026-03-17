import axios from 'axios';

// Базовый HTTP-клиент
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
});

// Interceptor запроса: автоматически добавляет access-токен в заголовок
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor ответа: автоматически обновляет токены при 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!accessToken || !refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/api/auth/refresh', {}, {
          headers: { 'x-refresh-token': refreshToken },
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  // ==================== AUTH ====================

  // Регистрация
  async register(data) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Вход
  async login(data) {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Обновление токенов
  async refresh(refreshToken) {
    const response = await axios.post('/api/auth/refresh', {}, {
      headers: { 'x-refresh-token': refreshToken },
    });
    return response.data;
  },

  // Получить текущего пользователя
  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // ==================== PRODUCTS ====================

  // Получить все товары
  async getProducts() {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Получить товар по ID
  async getProduct(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Создать новый товар
  async createProduct(product) {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  // Обновить товар
  async updateProduct(id, product) {
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  },

  // Удалить товар
  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // ==================== USERS (Admin) ====================

  async getUsers() {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async getUser(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await apiClient.put(`/users/${id}`, { role });
    return response.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // ==================== CATEGORIES ====================

  // Получить категории
  async getCategories() {
    const response = await apiClient.get('/categories');
    return response.data;
  },
};

export default api;
