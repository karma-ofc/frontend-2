# Практика 11-12

Была реализована система ролей таких как: Гость, пользователь, продавец, администратор.
А также права доступа такие как:

- **Гость** — не аутентифицированный пользователь
- **Пользователь** — пользователь сайта (только просмотр товаров)
- **Продавец** — сотрудник сайта (добавление и редактирование товаров)
- **Администратор** — управленец сайта (права продавца + управление пользователями)

---

### Возможности гостя

- `/api/auth/register` (POST)
- `/api/auth/login` (POST)
- `/api/auth/refresh` (POST)

---

### Возможности пользователя

- `/api/auth/me` (GET)
  <img width="696" height="353" alt="image_2026-03-17_14-01-23" src="https://github.com/user-attachments/assets/02afa2ae-072b-4c01-a249-34153517c51d" />

- `/api/products` (GET)
  <img width="699" height="405" alt="image_2026-03-17_14-01-55" src="https://github.com/user-attachments/assets/c2d524bd-32fa-415c-b2d6-69713bbdd3df" />

- `/api/products/:id` (GET)
  <img width="697" height="354" alt="image_2026-03-17_14-02-34" src="https://github.com/user-attachments/assets/cdc1f079-b351-4f5b-a045-88f2bbb7d733" />

**У пользователя нет доступа к:**

- `/api/users` (GET)
  <img width="698" height="324" alt="image_2026-03-17_13-52-23" src="https://github.com/user-attachments/assets/74871004-ca4f-46dd-a0c7-30e32ba18432" />

- `/api/users/:id` (GET)
  <img width="700" height="320" alt="image_2026-03-17_13-52-58" src="https://github.com/user-attachments/assets/b262b57e-f5ac-48df-9a7f-17d397dee925" />

- `/api/users/:id` (PUT)
  <img width="697" height="340" alt="image_2026-03-17_13-53-30" src="https://github.com/user-attachments/assets/354cd3db-7007-48fa-aea6-28afa3026308" />

- `/api/users/:id` (DELETE)
  <img width="700" height="327" alt="image_2026-03-17_13-53-53" src="https://github.com/user-attachments/assets/deb88625-087f-465e-90b9-efcb87c5ff51" />

- `/api/products/:id` (DELETE)
  <img width="697" height="323" alt="image_2026-03-17_13-59-52" src="https://github.com/user-attachments/assets/33f3ea0a-3a69-49e6-8a4d-4f0dc90560bb" />

- `/api/products/:id` (PUT)
  <img width="698" height="340" alt="image_2026-03-17_13-58-54" src="https://github.com/user-attachments/assets/a3412884-4fdd-4b5b-afec-13d103cefbfe" />

- `/api/products` (POST)
  <img width="695" height="330" alt="image_2026-03-17_13-55-14" src="https://github.com/user-attachments/assets/d33b3ae0-79ac-42de-9d64-e666312177b5" />

---

### Возможности продавца

- `/api/products` (POST)
  <img width="703" height="358" alt="image_2026-03-17_14-05-01" src="https://github.com/user-attachments/assets/4cd97769-80b5-44ea-a726-75c7ad35621d" />

- `/api/products/:id` (PUT)
  <img width="699" height="369" alt="image_2026-03-17_14-06-10" src="https://github.com/user-attachments/assets/55aab182-134c-4fa9-a573-7c59fe333c13" />

- **+ все возможности пользователя**

**У продавца нет доступа к:**

- `/api/users` (GET)
  <img width="698" height="347" alt="image_2026-03-17_14-07-34" src="https://github.com/user-attachments/assets/b07eae1a-62a3-4706-89df-a292d7ea7a25" />

- `/api/users/:id` (GET)
  <img width="697" height="310" alt="image_2026-03-17_14-08-09" src="https://github.com/user-attachments/assets/cc36bbd7-4aea-456e-89b1-9a7cf48a51b9" />

- `/api/users/:id` (PUT)
  <img width="697" height="322" alt="image_2026-03-17_14-08-37" src="https://github.com/user-attachments/assets/9ce490c5-3a2f-4136-8089-bfe32afaa4f7" />

- `/api/users/:id` (DELETE)
  <img width="696" height="316" alt="image_2026-03-17_14-09-08" src="https://github.com/user-attachments/assets/d5433bf7-095d-414c-a22d-b056e6ede41a" />

- `/api/products/:id` (DELETE)
  <img width="696" height="314" alt="image_2026-03-17_14-09-57" src="https://github.com/user-attachments/assets/bd05e2ce-c7ae-4444-a14c-705a0f582920" />

---

### Возможности администратора

**У администратора есть все возможности**

Практика 9-10
Была реализована генерация refresh токенов и добавлен маршрут - Post /api/auth/refresh
Регистрация
<img width="954" height="441" alt="image_2026-03-10_15-17-17" src="https://github.com/user-attachments/assets/6eb1c795-c37a-4944-9663-2d05c460a6e8" />
<img width="954" height="441" alt="image_2026-03-10_15-17-32" src="https://github.com/user-attachments/assets/fbe03aa9-5c23-4a5e-b81e-a9f6dd9dadb4" />

Вход и получение токенов
<img width="954" height="441" alt="image_2026-03-10_15-18-09" src="https://github.com/user-attachments/assets/39989a3b-902d-423e-9286-d9982b750c7b" />
<img width="954" height="441" alt="image_2026-03-10_15-18-23" src="https://github.com/user-attachments/assets/334a1d70-4c1b-4c7e-a83f-b333c062033f" />

Refresh токенов
Токены до обновления
<img width="954" height="441" alt="image_2026-03-10_15-19-08" src="https://github.com/user-attachments/assets/16bd764c-53b6-489c-915d-33b4ec4023c1" />

Токены после обновления
<img width="954" height="441" alt="image_2026-03-10_15-20-25" src="https://github.com/user-attachments/assets/99f50019-c533-428c-a0d7-f59aed5afeb4" />
<img width="954" height="441" alt="image_2026-03-10_15-20-42" src="https://github.com/user-attachments/assets/63fd73c0-dd7b-478a-a107-423703a51bed" />

Также было реализовано хранение токенов в localstorage через встроенную в библиотеку axios утилиту: interceptors
<img width="954" height="441" alt="image_2026-03-10_16-06-21" src="https://github.com/user-attachments/assets/9c226c52-8857-43a5-b4a4-329cac9fda3b" />

Были реализованы страницы входа и регистрации (с валидацией)
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/7bdc470a-dd7a-43d4-b4e3-36d53ad85abc" />
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/081b62d4-e0f9-4135-874a-488ff73b1df6" />

Практика 7-8
Добавлены (реализованы) маршруты: /api/auth/register и /api/auth/login
POST (/api/auth/register)
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/cbf8aa5a-0c70-410d-8f40-cce91c8d2a87" />
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/027bc331-c728-44fd-b1ba-befd63a191b2" />


POST (/api/auth/login)
(с верным паролем)
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/0ad8f7d6-88da-4cb5-85e4-4061103bcefe" />
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/48d6b490-7d74-4303-984b-84cad1ea0075" />

(с неверным паролем)
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/43f5dc19-b33a-488c-8132-03e76f1f4236" />
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/910a63b6-aa36-40e7-a2ca-2453ee70d993" />

Реализована выдача токена при входе в систему, был добавлен защищенный маршрут - GET /api/auth/me, а также были защищены следующие маршруты:
GET /api/products/:id
PUT /api/products/:id
DELETE /api/products/:id

GET /api/auth/me
Без токена
<img width="960" height="504" alt="image_2026-03-03_15-04-01" src="https://github.com/user-attachments/assets/f1025365-cea0-4b29-8f69-071d094ab994" />

С токеном
<img width="960" height="504" alt="image_2026-03-03_15-11-16" src="https://github.com/user-attachments/assets/66817315-e556-41a6-8f00-b6f81b0c07ae" />

GET /api/products/:id
Без токена
<img width="960" height="504" alt="image_2026-03-03_15-21-32" src="https://github.com/user-attachments/assets/c6840e32-a10e-492b-82d4-3500353fad4d" />

С токеном
<img width="960" height="504" alt="image_2026-03-03_15-19-25" src="https://github.com/user-attachments/assets/f87a8ec6-ef61-42e0-b6c9-476e4b0dbe46" />

PUT /api/products/:id
Без токена
<img width="960" height="504" alt="image_2026-03-03_15-22-37" src="https://github.com/user-attachments/assets/0a8c5798-10d7-4416-96a0-1bf5cdd7715e" />

С токеном
<img width="960" height="504" alt="image_2026-03-03_15-23-13" src="https://github.com/user-attachments/assets/6b8dd9e0-3657-4883-8449-fa5621973829" />

DELETE /api/products/:id
Без токена
<img width="960" height="504" alt="image_2026-03-03_15-24-02" src="https://github.com/user-attachments/assets/f8b68efa-3b84-4d99-a9ce-21b67c3edaad" />

С токеном
<img width="960" height="504" alt="image_2026-03-03_15-25-04" src="https://github.com/user-attachments/assets/9580ced8-8796-4fe0-bc40-759226ac3404" />

Были подключены такие библиотеки как swagger-jsdoc и swagger-ui-express
Swagger-документация доступна по адресу /api-docs + работает в интерактивном режими с возможностью отправки тестовых запросов.
С помощью JSDoc-аннотаций была описана схема Product (товар) и ее CRUD-операции, такие как: (GET /api/products, POST /api/products, GET /api/products/{id}, PUT /api/products/{id}, DELETE /api/products/{id}, GET /api/categories)

3 практика находится в этом файле -> [Практическая работа 3](https://github.com/ut0ku/Api-React/blob/main/%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%203.pdf)

<img width="1920" height="1008" alt="image" src="https://github.com/user-attachments/assets/31562574-17da-4916-8a2f-e786ef3f38ef" />

Каждый запрос по отдельности

GET /api/products
<img width="1420" height="644" alt="image" src="https://github.com/user-attachments/assets/be6fbd5c-16fa-4262-8f2a-af82b938dc3c" />

POST /api/products
<img width="1422" height="884" alt="image" src="https://github.com/user-attachments/assets/cb3d8bd8-d369-41ae-bb46-13abfffc976d" />

GET /api/products/{id}
<img width="1418" height="757" alt="image" src="https://github.com/user-attachments/assets/81cac228-878b-49b6-820f-533d4b1b4c75" />

PUT /api/products/{id}
<img width="1068" height="756" alt="image" src="https://github.com/user-attachments/assets/1b14c2f0-8dba-4de5-be88-2cedf5e4c75f" />

DELETE /api/products/{id}
<img width="1420" height="490" alt="image" src="https://github.com/user-attachments/assets/f55c45bc-e508-4311-8fbc-bdcd4b392ec3" />

GET /api/categories
<img width="1423" height="585" alt="image" src="https://github.com/user-attachments/assets/4adbe9db-97cf-49e6-a29f-3d6a6ce2a8e7" />

Проверка возможности отправки тестовых запросов (POST /api/products)
<img width="1423" height="700" alt="image" src="https://github.com/user-attachments/assets/e88e9ace-a6b6-453e-b115-2940b18735af" />
<img width="1417" height="881" alt="image" src="https://github.com/user-attachments/assets/f21cd885-dfcd-40d8-9352-d63fe28e0645" />
<img width="1908" height="882" alt="image" src="https://github.com/user-attachments/assets/3e5c006c-8607-47e2-8c21-b3ee11796651" />
<img width="1916" height="277" alt="image" src="https://github.com/user-attachments/assets/23934bf0-8442-408f-914c-64c98ed15430" />






