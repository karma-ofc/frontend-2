Скрины на 3-ю и 4 практику в [этом pdf](https://github.com/karma-ofc/frontend-2/blob/main/3-4%20практика%20фронтенд.pdf)
В 5-6 практиках 
Установлены npm-пакеты: swagger-jsdoc, swagger-ui-express
Настроена Swagger документация в server/index.js: подключены модули, настроена конфигурация OpenAPI 3.0.0, добавлена схема Product с полями: id, name, category, description, price, stock, rating, image
Документированы все CRUD-операции: GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id, GET /api/categories

<img width="1918" height="545" alt="{A778BB52-8B0D-4734-B8B7-D268A814D91D}" src="https://github.com/user-attachments/assets/f99da176-975c-4892-90f7-b55006eea736" />

<img width="1557" height="775" alt="{CEEB4E29-A233-4785-ACFC-C4C1EA5DC9CE}" src="https://github.com/user-attachments/assets/e77b62e8-49e8-4edd-8601-c14147592131" />

<img width="1425" height="897" alt="{812C1F4A-A1CC-42E0-B9BF-D798BEC44588}" src="https://github.com/user-attachments/assets/9258605e-1d29-4ed2-9655-9d0435fbe5ac" />

## Практическая работа: Swagger API Documentation

### Цель работы
Подключить к существующему веб-приложению интерактивную документацию API с использованием swagger-jsdoc и swagger-ui-express.

### Выполненные задачи

1. **Установлены npm-пакеты:**
   - swagger-jsdoc
   - swagger-ui-express

2. **Настроена Swagger документация в server/index.js:**
   - Подключены модули swagger-jsdoc и swagger-ui-express
   - Настроена конфигурация OpenAPI 3.0.0
   - Добавлена схема Product с полями: id, name, category, description, price, stock, rating, image

3. **Документированы все CRUD-операции:**
   - GET /api/products - получение всех товаров
   - GET /api/products/:id - получение товара по ID
   - POST /api/products - создание нового товара
   - PUT /api/products/:id - обновление товара
   - DELETE /api/products/:id - удаление товара
   - GET /api/categories - получение списка категорий

### Запуск приложения

1. Установить зависимости: `npm install`
2. Запустить сервер: `node server/index.js`
3. Открыть Swagger UI: http://localhost:3001/api-docs
4. Тестировать запросы можно прямо в браузере через интерфейс Swagger

### Тестирование
Документация доступна по адресу /api-docs. Все запросы можно протестировать в интерактивном режиме, нажав кнопку "Try it out" на любом эндпоинте.
