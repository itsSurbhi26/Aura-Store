# 🛍️ Aura — Full-Stack E-Commerce Application

Aura is a **full-stack e-commerce web application** built with a modern React frontend and a Node.js/Express backend. It provides a complete shopping experience for customers along with an admin dashboard for managing products, categories, users, and orders.

The application uses **MongoDB** for data storage and **JWT-based authentication** for secure user access.

---

## ✨ Features

### 👤 Customer Features

* User registration and login
* JWT-based authentication
* Browse products
* Browse products by category
* View product details
* Featured products
* Add products to cart
* Update cart quantities
* Remove products from cart
* Checkout
* Place orders
* View previous orders
* Order success page
* Responsive user interface

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Product management

  * Add products
  * Update products
  * Delete products
  * Upload product images
  * Manage featured products
* Category management

  * Add categories
  * Update categories
  * Delete categories
* User management

  * View users
  * Update users
  * Delete users
* Order management

  * View orders
  * Update order status
  * Delete orders
* Dashboard statistics

  * Total users
  * Total products
  * Total orders
  * Total sales

---

## 🧑‍💻 Tech Stack

### Frontend

| Technology        | Purpose                     |
| ----------------- | --------------------------- |
| React             | UI development              |
| Vite              | Frontend build tool         |
| React Router      | Client-side routing         |
| Axios             | API communication           |
| Tailwind CSS      | Styling                     |
| Lucide React      | Icons                       |
| React Context API | Authentication & cart state |

### Backend

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime environment   |
| Express.js | REST API              |
| MongoDB    | Database              |
| Mongoose   | MongoDB ODM           |
| JWT        | Authentication        |
| bcryptjs   | Password hashing      |
| Multer     | Image uploads         |
| CORS       | Cross-origin requests |
| Morgan     | HTTP request logging  |

---

## 🏗️ Project Architecture

```text
Aura/
│
├── backend/
│   ├── config/
│   │   └── database.config.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   ├── product.js
│   │   ├── category.js
│   │   ├── order.js
│   │   └── order-item.js
│   │
│   ├── routes/
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   └── orders.js
│   │
│   ├── helpers/
│   │   ├── jwt.js
│   │   └── error-handler.js
│   │
│   ├── public/
│   │   └── uploads/
│   │
│   ├── app.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   │   ├── admin/
    │   │   ├── common/
    │   │   └── customer/
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   │
    │   ├── hooks/
    │   │
    │   ├── layouts/
    │   │
    │   ├── pages/
    │   │   ├── admin/
    │   │   └── customer/
    │   │
    │   ├── routes/
    │   ├── services/
    │   └── utils/
    │
    ├── package.json
    └── vite.config.js
```

---

# 🔄 Application Flow

```text
                 ┌─────────────────┐
                 │     React UI    │
                 │   (Frontend)    │
                 └────────┬────────┘
                          │
                          │ Axios / REST API
                          ▼
                 ┌─────────────────┐
                 │ Express Server  │
                 │    (Backend)    │
                 └────────┬────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
        ┌──────────────┐    ┌──────────────┐
        │ JWT / bcrypt │    │   Mongoose   │
        │ Authentication│    │              │
        └──────────────┘    └──────┬───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │   MongoDB    │
                            └──────────────┘
```

---

# 🔐 Authentication

Aura uses **JWT (JSON Web Tokens)** for authentication.

### Registration

When a user registers:

```text
User Password
      │
      ▼
   bcrypt
      │
      ▼
Hashed Password
      │
      ▼
   MongoDB
```

The original password is **not stored directly** in the database.

### Login

```text
Email + Password
       │
       ▼
 Find User
       │
       ▼
bcrypt.compare()
       │
       ▼
Generate JWT
       │
       ▼
Frontend stores token
       │
       ▼
Token sent with API requests
```

The frontend automatically attaches the JWT token to authenticated API requests using an Axios interceptor.

---

# 🗄️ Database Models

Aura uses MongoDB with the following main collections:

### User

Stores:

* Name
* Email
* Password hash
* Phone
* Admin status
* Address information

### Product

Stores:

* Product name
* Description
* Images
* Brand
* Price
* Category
* Stock quantity
* Rating
* Number of reviews
* Featured status

### Category

Stores:

* Category name
* Icon
* Color

### Order

Stores:

* Order items
* Shipping address
* Phone
* Order status
* Total price
* User
* Order date

### Order Item

Stores:

* Product reference
* Quantity

---

# 🔌 REST API

The backend API is available under:

```text
/api/v1
```

## 👤 User API

| Method | Endpoint           | Description     |
| ------ | ------------------ | --------------- |
| POST   | `/users/register`  | Register a user |
| POST   | `/users/login`     | Login           |
| GET    | `/users`           | Get all users   |
| GET    | `/users/:id`       | Get a user      |
| PUT    | `/users/:id`       | Update a user   |
| DELETE | `/users/:id`       | Delete a user   |
| GET    | `/users/get/count` | Get user count  |

---

## 📦 Product API

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/products`                     | Get products          |
| GET    | `/products/:id`                 | Get product           |
| POST   | `/products`                     | Create product        |
| PUT    | `/products/:id`                 | Update product        |
| DELETE | `/products/:id`                 | Delete product        |
| GET    | `/products/get/count`           | Get product count     |
| GET    | `/products/get/featured/:count` | Get featured products |
| PUT    | `/products/gallery-images/:id`  | Upload product images |

Products can also be filtered by category.

Example:

```text
GET /api/v1/products?categories=<categoryId>
```

---

## 🏷️ Category API

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/categories`     | Get categories  |
| GET    | `/categories/:id` | Get category    |
| POST   | `/categories`     | Create category |
| PUT    | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

---

## 🛒 Order API

| Method | Endpoint                          | Description         |
| ------ | --------------------------------- | ------------------- |
| GET    | `/orders`                         | Get all orders      |
| GET    | `/orders/:id`                     | Get order           |
| POST   | `/orders`                         | Create order        |
| PUT    | `/orders/:id`                     | Update order status |
| DELETE | `/orders/:id`                     | Delete order        |
| GET    | `/orders/get/count`               | Get order count     |
| GET    | `/orders/get/totalsales`          | Get total sales     |
| GET    | `/orders/get/usersorders/:userid` | Get user's orders   |

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd Aura
```

---

## 2. Install Backend Dependencies

From the project root:

```bash
npm install
```

---

## 3. Configure MongoDB

Create/configure your MongoDB connection.

Your backend uses:

```text
config/database.config.js
```

Configure your MongoDB connection and required environment variables.

Example environment configuration:

```env
API_URL=/api/v1
secret=your_jwt_secret
```

> ⚠️ Never commit your real MongoDB credentials, JWT secret, API keys, or `.env` files to GitHub.

---

# 🚀 Run the Backend

Start the backend server:

```bash
node app.js
```

Or, if you use nodemon:

```bash
nodemon app.js
```

The backend runs on:

```text
http://localhost:3000
```

The API base URL is:

```text
http://localhost:3000/api/v1
```

---

# 🎨 Run the Frontend

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at the URL shown by Vite, typically:

```text
http://localhost:5173
```

---

# 🔗 Frontend ↔ Backend Connection

The frontend communicates with the backend through Axios.

The API base URL can be configured using:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

The frontend API client automatically attaches the JWT token:

```text
Frontend
   │
   │ Axios Request
   ▼
API Client
   │
   │ Authorization: Bearer <JWT>
   ▼
Express Backend
   │
   ▼
MongoDB
```

---

# 📱 Application Pages

## Customer

```text
Home
├── Products
├── Product Details
├── Login
├── Register
├── Cart
├── Checkout
├── Order Success
└── My Orders
```

## Admin

```text
Admin Dashboard
├── Dashboard
├── Products
├── Categories
├── Users
└── Orders
```

---

# 📊 Admin Dashboard

The admin dashboard provides an overview of the store and allows administrators to manage the application's core data.

Administrators can manage:

* 👥 Users
* 📦 Products
* 🏷️ Categories
* 🛒 Orders
* 💰 Sales

---

# 📂 Important Frontend Structure

### Context

`AuthContext`

Responsible for authentication state.

`CartContext`

Responsible for shopping cart state.

### Services

```text
authService.js
categoryService.js
productService.js
orderService.js
userService.js
```

These services handle communication between the React application and the backend API.

### Routing

Aura uses React Router with separate routing logic for:

* Public/customer routes
* Protected routes
* Admin routes

---

# 🛡️ Security

The project implements several security-related mechanisms:

* Password hashing with bcrypt
* JWT authentication
* Protected routes
* Admin authorization
* Password hashes excluded from user responses
* CORS configuration
* Environment variables for secrets

> For production deployment, additional security hardening should be added, including stronger validation, rate limiting, secure cookies/token storage, production CORS configuration, and proper secret management.

---

# 🧪 API Testing

The backend REST API can be tested using tools such as **Postman**.

Typical workflow:

```text
Register User
     ↓
Login
     ↓
Receive JWT
     ↓
Send JWT with protected requests
     ↓
Create / Read / Update / Delete
Products, Categories, Users & Orders
```

---

# 🎯 Future Improvements

Some potential improvements for future versions:

* 💳 Payment gateway integration
* 🔎 Product search
* 📄 Pagination
* ⭐ Product reviews
* ❤️ Wishlist
* 📧 Email notifications
* 📦 Advanced inventory management
* 📈 Advanced admin analytics
* 🖼️ Cloud image storage
* 🔒 Refresh-token authentication
* 🚀 Production deployment
* 🧪 Automated backend/frontend tests

---

# 👨‍💻 Author

**Shashwat**

Built as a full-stack e-commerce project using the MERN-style stack.

---

# 📄 License

This project is intended for educational and portfolio purposes.

---

## ⭐ If you like the project

Give the repository a ⭐ and feel free to explore, improve, and extend the application!

```text
Built with ❤️ using React + Node.js + Express + MongoDB
```
