# E-Commerce API

A production-ready RESTful API for e-commerce applications built with Express.js and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with Argon2 password hashing, role-based access control (admin/user)
- **Product Management**: Full CRUD operations with image upload support (up to 10 images per product)
- **Category Management**: Organize products into categories
- **Order Management**: Create, read, update orders with status tracking
- **Order Items**: Manage individual line items within orders
- **Statistics**: Product count, order count, total sales, featured products
- **Input Validation**: Zod schema validation
- **Security**: Helmet, CORS, rate limiting, XSS sanitization, mongo-sanitize, HPP protection
- **Error Handling**: Centralized error handling middleware
- **Logging**: Morgan + Winston for HTTP and application logging
- **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT

## Project Structure

```
├── controllers/       # Request handlers
├── routes/            # API route definitions
├── services/          # Business logic
├── middlewares/       # Express middleware (auth, validation, upload, etc.)
├── validations/       # Zod validation schemas
├── helpers/           # Utility functions (JWT)
├── utils/             # App utilities (logger, API response, errors)
├── public/uploads/   # Uploaded product images
├── logs/              # Application logs
├── scripts/           # Utility scripts
├── example_data/      # Sample data for testing
└── app.js             # Application entry point
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure:
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT signing
   - `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
   - `PORT` - Server port (default: 5000)
   - `NODE_ENV` - development or production
4. Run MongoDB locally or provide a remote URI
5. Start the server: `npm run dev` (development) or `npm start` (production)

## API Endpoints

### Users & Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/users/register` | Register new user | Public |
| POST | `/api/users/login` | Login user | Public |
| GET | `/api/users/:id` | Get user by ID | Authenticated |
| PUT | `/api/users/:id` | Update user | Authenticated |
| GET | `/api/users/` | Get all users | Admin |
| POST | `/api/users/` | Create user | Admin |
| GET | `/api/users/get/count` | Get user count | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| GET | `/api/products/get/count` | Get product count | Public |
| GET | `/api/products/get/featured/:count?` | Get featured products | Public |
| POST | `/api/products` | Create product (with images) | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get category by ID | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get all orders | Admin |
| GET | `/api/orders/:id` | Get order by ID | Authenticated |
| GET | `/api/orders/get/user-orders/:userId` | Get user's orders | Authenticated |
| GET | `/api/orders/get/count` | Get order count | Admin |
| GET | `/api/orders/get/total-sales` | Get total sales | Admin |
| POST | `/api/orders` | Create order | Authenticated |
| PUT | `/api/orders/:id` | Update order status | Admin |
| DELETE | `/api/orders/:id` | Delete order | Admin |

### Order Items
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orderitems` | Get all order items | Admin |
| POST | `/api/orderitems` | Create order item | Admin |

### System
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Health check | Public |

## Environment Variables

```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your_super_secret_key
ALLOWED_ORIGINS=http://localhost:3000,https://yourfrontend.com
PORT=5000
```

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Argon2 hashing
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit, express-xss-sanitizer, express-mongo-sanitize, HPP
- **Logging**: Morgan, Winston
- **File Upload**: Multer

## License

ISC
