const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let products = [
    { id: 1, name: 'Ноутбук ASUS', price: 150000 },
    { id: 2, name: 'iPhone 15', price: 90000 },
    { id: 3, name: 'Наушники Sony', price: 30000 }
];

// 1. Главная страница
app.get('/', (req, res) => {
    res.json({ message: 'API для товаров работает!' });
});

// 2. Все товары
app.get('/products', (req, res) => {
    res.json(products);
});

// 3. Товар по ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

// 4. Добавить товар
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Укажите name и price' });
    }
    
    const newProduct = {
        id: products.length + 1,
        name,
        price
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 5. Обновить товар
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    if (name) product.name = name;
    if (price) product.price = price;
    
    res.json(product);
});

// 6. Удалить товар
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== id);
    
    if (products.length < initialLength) {
        res.json({ message: 'Товар удален' });
    } else {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
    console.log('Доступные эндпоинты:');
    console.log('  GET  /            - Информация');
    console.log('  GET  /products    - Все товары');
    console.log('  GET  /products/:id - Товар по ID');
    console.log('  POST /products    - Добавить товар');
    console.log('  PUT  /products/:id - Обновить товар');
    console.log('  DELETE /products/:id - Удалить товар');
});