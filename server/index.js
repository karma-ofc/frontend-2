
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey';         // В реальном проекте хранить в .env
const JWT_REFRESH_SECRET = 'superrefreshkey'; // В реальном проекте хранить в .env

// Хранилище действующих refresh-токенов (в реальном проекте — БД / Redis)
const refreshTokensStore = new Set();

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Магазина одежды',
      version: '1.0.0',
      description: 'API для управления товарами и категориями Магазина Одежды',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Локальный сервер',
      },
    ],
  },
  apis: ['./server/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Бд товаров (товары пользователя - одежда/обувь)
let products = [
  { id: 1, name: "Куртка зимняя мужская", category: "Верхняя одежда", description: "Утепленная, водонепроницаемая, размеры M-XXL", price: 12990, stock: 15, rating: 4.5, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop" },
  { id: 2, name: "Кроссовки Nike Air Max", category: "Обувь", description: "Беговые, размеры 40-45, амортизация Air", price: 14990, stock: 23, rating: 4.7, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { id: 3, name: "Джинсы классические Levi's", category: "Одежда", description: "Прямой крой, синие, размеры 28-36", price: 8990, stock: 30, rating: 4.6, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
  { id: 4, name: "Ботинки кожаные Dr. Martens", category: "Обувь", description: "Стальной носок, черные, размеры 39-44", price: 18990, stock: 12, rating: 4.8, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200&h=200&fit=crop" },
  { id: 5, name: "Свитшот Nike спортивный", category: "Спортивная одежда", description: "Хлопок, капюшон, серый, размеры S-XXL", price: 6990, stock: 25, rating: 4.4, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop" },
  { id: 6, name: "Сумка через плечо Hugo Boss", category: "Сумки", description: "Кожа, черная, вместимость 10л", price: 15990, stock: 8, rating: 4.5, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
  { id: 7, name: "Пальто женское Zara", category: "Верхняя одежда", description: "Шерстяное, бежевое, размеры XS-L", price: 19990, stock: 7, rating: 4.6, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop" },
  { id: 8, name: "Кеды Converse Classic", category: "Обувь", description: "Тканевые, белые, размеры 35-42", price: 5990, stock: 35, rating: 4.7, image: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=200&h=200&fit=crop" },
  { id: 9, name: "Рюкзак Herschel Supply", category: "Сумки", description: "30л, городской, синий", price: 7990, stock: 18, rating: 4.5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
  { id: 10, name: "Футзалки Adidas Predator", category: "Обувь", description: "Для зала, размеры 38-44, мягкая подошва", price: 11990, stock: 14, rating: 4.6, image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200&h=200&fit=crop" },
  { id: 11, name: "Штаны спортивные Nike Tech", category: "Спортивная одежда", description: "Ветрозащитные, черные, размеры S-XXL", price: 8990, stock: 22, rating: 4.4, image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=200&h=200&fit=crop" },
  { id: 12, name: "Шарф вязаный Burberry", category: "Аксессуары", description: "Шерсть, кашемировый, бежевый в клетку", price: 24990, stock: 6, rating: 4.9, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=200&h=200&fit=crop" },
];

let users = [];

// Middleware для проверки токена
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Неверный токен' });
    req.user = user;
    next();
  });
}

// Роли
const ROLES = {
  USER: 'User',
  SELLER: 'Seller',
  ADMIN: 'Admin'
};

// Средство проверки ролей (RBAC)
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }
    next();
  };
}

// Категории
const categories = [
  "Одежда",
  "Обувь",
  "Верхняя одежда",
  "Спортивная одежда",
  "Сумки",
  "Аксессуары"
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг товара
 *         image:
 *           type: string
 *           description: URL изображения товара
 *       example:
 *         id: 1
 *         name: "Ноутбук ASUS VivoBook 15"
 *         category: "Ноутбуки"
 *         description: "15.6 дюймов, Intel Core i5, 8GB RAM, 512GB SSD"
 *         price: 54990
 *         stock: 15
 *         rating: 4.5
 *         image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop"
 *     Category:
 *       type: string
 *       description: Название категории
 *       example: "Ноутбуки"
 *     TokenPair:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access-токен (живёт 15 минут)
 *         refreshToken:
 *           type: string
 *           description: JWT refresh-токен (живёт 7 дней)
 *       example:
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

// API маршруты

app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      swagger: '/api-docs'
    }
  });
});

// ==================== AUTH API ====================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка в теле запроса или пользователь уже существует
 */
app.post('/api/auth/register', async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id), 0) + 1 : 1,
    email,
    first_name,
    last_name,
    password: hashedPassword,
    role: users.length === 0 ? 'Admin' : 'User' // Первый пользователь — Администратор
  };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, email: newUser.email, first_name: newUser.first_name, last_name: newUser.last_name });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход — возвращает пару токенов
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenPair'
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Неверный email или пароль
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  // Генерируем пару токенов
  const accessToken  = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET,         { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  refreshTokensStore.add(refreshToken);

  res.json({ accessToken, refreshToken });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление пары токенов по refresh-токену
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: x-refresh-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Действующий refresh-токен
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenPair'
 *       401:
 *         description: Refresh-токен отсутствует или не найден в хранилище
 *       403:
 *         description: Refresh-токен недействителен или истёк
 */
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.headers['x-refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh-токен отсутствует' });
  }
  if (!refreshTokensStore.has(refreshToken)) {
    return res.status(401).json({ error: 'Refresh-токен не найден или уже был использован' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, payload) => {
    if (err) {
      refreshTokensStore.delete(refreshToken); // удаляем протухший токен
      return res.status(403).json({ error: 'Refresh-токен недействителен или истёк' });
    }

    // Ротация: старый токен удаляем, генерируем новую пару
    refreshTokensStore.delete(refreshToken);

    const newAccessToken  = jwt.sign({ id: payload.id, email: payload.email }, JWT_SECRET,         { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: payload.id, email: payload.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    refreshTokensStore.add(newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
});

// Защищённый маршрут для получения текущего пользователя
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      swagger: '/api-docs'
    }
  });
});

// ==================== USERS API (Admin) ====================
app.get('/api/users', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
  const safeUsers = users.map(u => ({ id: u.id, email: u.email, first_name: u.first_name, last_name: u.last_name, role: u.role }));
  res.json(safeUsers);
});

app.get('/api/users/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role });
});

app.put('/api/users/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Пользователь не найден' });
  const { role } = req.body;
  if (role && [ROLES.USER, ROLES.SELLER, ROLES.ADMIN].includes(role)) {
    users[index].role = role;
  }
  res.json({ id: users[index].id, email: users[index].email, first_name: users[index].first_name, last_name: users[index].last_name, role: users[index].role });
});

app.delete('/api/users/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Пользователь не найден' });
  users = users.filter(u => u.id !== id);
  res.json({ success: true });
});

// ==================== PRODUCTS API ====================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', authMiddleware, roleMiddleware([ROLES.USER, ROLES.SELLER, ROLES.ADMIN]), (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post('/api/products', authMiddleware, roleMiddleware([ROLES.SELLER, ROLES.ADMIN]), (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;
  
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }
  
  const newProduct = {
    id: Math.max(...products.map(p => p.id), 0) + 1,
    name,
    category,
    description: description || '',
    price: price || 0,
    stock: stock || 0,
    rating: rating || 0,
    image: image || ''
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
// Защищённый маршрут
app.get('/api/products/:id', authMiddleware, roleMiddleware([ROLES.USER, ROLES.SELLER, ROLES.ADMIN]), (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.put('/api/products/:id', authMiddleware, roleMiddleware([ROLES.SELLER, ROLES.ADMIN]), (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const { name, category, description, price, stock, rating, image } = req.body;
  products[index] = {
    ...products[index],
    name: name || products[index].name,
    category: category || products[index].category,
    description: description !== undefined ? description : products[index].description,
    price: price !== undefined ? price : products[index].price,
    stock: stock !== undefined ? stock : products[index].stock,
    rating: rating !== undefined ? rating : products[index].rating,
    image: image !== undefined ? image : products[index].image
  };
  res.json(products[index]);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', authMiddleware, roleMiddleware([ROLES.ADMIN]), (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

// ==================== CATEGORIES API ====================

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Возвращает список всех категорий
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

const buildPath = path.join(__dirname, '../build');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок (чтобы сервер не падал)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
