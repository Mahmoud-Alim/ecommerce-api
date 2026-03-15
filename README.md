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
├── models/            # Mongoose models (schemas)
├── routes/            # API route definitions
├── services/          # Business logic
├── middlewares/       # Express middleware (auth, validation, upload, etc.)
├── validations/       # Zod validation schemas
├── helpers/           # Utility functions (JWT)
├── utils/             # App utilities (logger, API response, errors)
├── public/uploads/    # Uploaded product images
├── logs/              # Application logs
├── app.js             # Application entry point
└── server.js          # Server startup and database connection
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
5. Start the server:
   - `npm run dev` - Development mode with auto-reload
   - `npm start` - Production mode
   - `npm run dev:all` - Run both server and client (if available)

## API Endpoints

### System
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/health` | Health check | Authenticated |
| GET | `/api/v1/home` | Home status | Public |

### Users & Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/users/register` | Register new user | Public |
| POST | `/api/v1/users/login` | Login user | Public |
| GET | `/api/v1/users/:id` | Get user by ID | Authenticated |
| PUT | `/api/v1/users/:id` | Update user | Authenticated |
| GET | `/api/v1/users/` | Get all users | Admin |
| POST | `/api/v1/users/` | Create user | Admin |
| GET | `/api/v1/users/count` | Get user count | Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/products` | Get all products | Public |
| GET | `/api/v1/products/:id` | Get product by ID | Public |
| GET | `/api/v1/products/count` | Get product count | Public |
| GET | `/api/v1/products/featured/:count?` | Get featured products | Public |
| POST | `/api/v1/products` | Create product (with images) | Admin |
| PUT | `/api/v1/products/:id` | Update product | Admin |
| DELETE | `/api/v1/products/:id` | Delete product | Admin |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/categories` | Get all categories | Public |
| GET | `/api/v1/categories/:id` | Get category by ID | Public |
| POST | `/api/v1/categories` | Create category | Admin |
| PUT | `/api/v1/categories/:id` | Update category | Admin |
| DELETE | `/api/v1/categories/:id` | Delete category | Admin |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/orders` | Get all orders | Admin |
| GET | `/api/v1/orders/:id` | Get order by ID | Authenticated |
| GET | `/api/v1/orders/user-orders/:userId` | Get user's orders | Authenticated |
| GET | `/api/v1/orders/count` | Get order count | Admin |
| GET | `/api/v1/orders/total-sales` | Get total sales | Admin |
| POST | `/api/v1/orders` | Create order | Authenticated |
| PUT | `/api/v1/orders/:id` | Update order status | Admin |
| DELETE | `/api/v1/orders/:id` | Delete order | Admin |

### Order Items
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/orderitems` | Get all order items | Admin |
| POST | `/api/v1/orderitems` | Create order item | Admin |

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
- **Testing**: Vitest, Supertest, MongoDB Memory Server

## Testing

Run the test suite:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

## License

ISC
