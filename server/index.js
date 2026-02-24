const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ========================
// Swagger Configuration
// ========================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Интернет-магазина',
      version: '1.0.0',
      description: 'API для управления товарами и категориями интернет-магазина',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Локальный сервер разработки'
      }
    ],
    components: {
      schemas: {
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
         *           description: Уникальный идентификатор товара
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
         *         name: "Куртка зимняя мужская"
         *         category: "Верхняя одежда"
         *         description: "Утепленная, водонепроницаемая, размеры M-XXL"
         *         price: 12990
         *         stock: 15
         *         rating: 4.5
         *         image: "https://images.unsplash.com/photo-1539533018447-63fc3835535d?w=200&h=200&fit=crop"
         */
        Product: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            rating: { type: 'number' },
            image: { type: 'string' }
          }
        },
        /**
         * @swagger
         * components:
         *   schemas:
         *     ProductInput:
         *       type: object
         *       required:
         *         - name
         *         - category
         *       properties:
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
         *         name: "Новый товар"
         *         category: "Одежда"
         *         description: "Описание нового товара"
         *         price: 9990
         *         stock: 10
         *         rating: 4.0
         *         image: "https://example.com/image.jpg"
         */
        ProductInput: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            name: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            rating: { type: 'number' },
            image: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        }
      }
    }
  },
  apis: ['./server/index.js']
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Бд
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

// Категории
const categories = [
  "Одежда",
  "Обувь",
  "Верхняя одежда",
  "Спортивная одежда",
  "Сумки",
  "Аксессуары"
];

// API маршруты

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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     description: Возвращает список всех товаров из каталога
 *     tags:
 *       - Товары
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     description: Возвращает товар по его уникальному идентификатору
 *     tags:
 *       - Товары
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     description: Добавляет новый товар в каталог
 *     tags:
 *       - Товары
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/products', (req, res) => {
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
 *   put:
 *     summary: Обновить товар
 *     description: Обновляет данные существующего товара по ID
 *     tags:
 *       - Товары
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Товар успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/api/products/:id', (req, res) => {
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
 *     summary: Удалить товар
 *     description: Удаляет товар по ID
 *     tags:
 *       - Товары
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Товар успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить все категории
 *     description: Возвращает список всех доступных категорий товаров
 *     tags:
 *       - Категории
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example:
 *               - "Одежда"
 *               - "Обувь"
 *               - "Верхняя одежда"
 *               - "Спортивная одежда"
 *               - "Сумки"
 *               - "Аксессуары"
 */
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

const buildPath = path.join(__dirname, '../build');
const fs = require('fs');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Swagger UI доступен по адресу http://localhost:${PORT}/api-docs`);
});
