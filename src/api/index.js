const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        await api.refreshToken();
        isRefreshing = false;
        processQueue(null);
        // Повторяем запрос с новым токеном
        return fetch(url, {
          ...options,
          headers: {
            ...getHeaders(),
            ...options.headers,
          },
        });
      } catch (error) {
        isRefreshing = false;
        processQueue(error);
        api.logout();
        throw error;
      }
    } else {
      // Ждем обновления токена
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return fetch(url, {
          ...options,
          headers: {
            ...getHeaders(),
            ...options.headers,
          },
        });
      });
    }
  }

  return response;
};

export const api = {
  // Авторизация
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка входа');
    }
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка регистрации');
    }
    return data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to refresh token');
    }
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  },

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {}); // Игнорируем ошибки при logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Получить информацию о текущем пользователе
  async getCurrentUser() {
    const response = await apiRequest(`${API_URL}/auth/me`);
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    return response.json();
  },

  // Получить все товары
  async getProducts() {
    const response = await apiRequest(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  // Получить товар по ID
  async getProduct(id) {
    const response = await apiRequest(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  // Создать новый товар
  async createProduct(product) {
    const response = await apiRequest(`${API_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  },

  // Обновить товар
  async updateProduct(id, product) {
    const response = await apiRequest(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return response.json();
  },

  // Удалить товар
  async deleteProduct(id) {
    const response = await apiRequest(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return response.json();
  },

  // Получить категории
  async getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
};

export default api;
