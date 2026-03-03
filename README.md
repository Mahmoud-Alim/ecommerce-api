# Test API

Express.js API with MongoDB, JWT authentication, and product management.

## Features

- User registration & login (argon2 password hashing)
- JWT authentication
- Product CRUD operations
- Input validation with Zod
- Security: Helmet, CORS, rate limiting, XSS sanitization, mongo-sanitize, HPP
- Error handling middleware

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update variables
4. Run MongoDB locally or provide a remote URI
5. Start the server: `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected, owner or admin)
- `DELETE /api/products/:id` - Delete product (protected, owner or admin)

## Environment Variables

See `.env.example`
