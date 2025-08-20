# 📚 Book Management App

A full-stack web application for managing book collections with authentication, CRUD operations, and advanced search/filtering. Built with Node.js, Express, MongoDB, and a modern frontend.

## 🚀 Features

* **User Authentication**
  * Secure user registration and login with JSON Web Tokens (JWT).
  * Authentication-based access control for protected routes.

* **Book Management**
  * Create new book entries.
  * Retrieve lists of all books.
  * Fetch specific book details by ID.
  * Update existing book information.
  * Delete book records.

* **Advanced Search**
  * Query books by **title**, **author**, or **tags**.
  * **Fuzzy search** (basic regex matching).
  * Filter by **year** and **genre**.
  * Sort results by **title**, **publication year**, or **rating**.
  * Built-in **pagination** for large datasets.

* **Media Handling**
  * Upload book cover images.
  * API endpoint: POST /books/:id/upload-cover.
  * Store files in Cloudinary.
  * Save the generated image URL in the database for frontend display.
  * thumbnails for faster UI rendering.

* **Security Layer**
  * Helmet — sets secure HTTP headers.
  * CORS restrictions — only allows requests from your front-end origins.
  * Rate limiting — prevents abuse (200 reqs / 15min per IP by default).
  * Input sanitization — protects against XSS, NoSQL injection, and SQL injection.
  * HPP (HTTP Parameter Pollution) protection with whitelisted fields (e.g., tags).
  * Disables the X-Powered-By header for additional security.

Frontend

Ugly non-responsive UI.

Search bar, dropdown filters, and sort toggle integrated with backend API.

CRUD interface to manage books directly from the app.

Testing & CI

Integration tests covering API endpoints (users, books, routes).

Automated test suite using Jest + Supertest.

GitHub Actions pipeline for linting and running tests on every push.


* **Robust Validation**
  * Utilizes Joi for comprehensive input validation on all API requests.

* **Centralized Error Handling**
  * Consistent and informative error responses for a better developer experience.

* **API Documentation**
  * Interactive API documentation powered by Swagger UI (OpenAPI 3.0).

* **Containerized Deployment**
  * Dockerfile included for easy containerization and deployment.

---

## 🛠️ Technologies Used

Backend: Node.js, Express.js, MongoDB, Mongoose
Auth: JWT, Bcrypt.js
Validation: Joi
Testing: Jest, Supertest
CI/CD: GitHub Actions
Docs: Swagger UI
Frontend: Next.js, Framer motion
Deployment: Docker

---

## 📋 API Documentation

Explore all available endpoints, request bodies, and responses:

**Swagger UI**: [https://back-end-api-34k5.onrender.com/api-docs/](https://back-end-api-34k5.onrender.com/api-docs/)

---

## 🚦 Getting Started

Follow these steps to get a copy of the project up and running locally.

### 📌 Prerequisites

* Node.js (v20 or higher)
* npm
* MongoDB (Local or MongoDB Atlas)
* Git

### 🔧 Installation

```bash
git clone https://github.com/Gojer16/Book-Management-API.git
cd Book-Management-API
npm install
```

⚙️ Environment Setup

Create a .env file and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
PORT=4000

Generate a strong JWT_SECRET with:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

▶️ Running the API

npm start

Visit the API at: http://localhost:4000 Swagger Docs: http://localhost:4000/api-docs

🐳 Docker Setup (Optional)

Build Docker Image

docker build -t book-management-api .

Run Docker Container

docker run -p 4000:4000 -d --name book-api-container book-management-api

Make sure .env variables (especially MONGO_URI) are accessible in the container.

🚀 Deployment

This API is deployed on Render:

Live Endpoint: https://back-end-api-34k5.onrender.com/

Swagger Docs: https://back-end-api-34k5.onrender.com/api-docs

🤝 Contributing

Pull requests are welcome! If you find bugs or have suggestions, please open an issue.

📝 License

Licensed under the MIT License. See LICENSE file for details.

📞 Contact

Orlando Ascanio
📧 operation927@gmail.com
🔗 LinkedIn(https://www.linkedin.com/in/orlando-ascanio-dev)
🔗 Project Link (https://github.com/Gojer16/Book-Management-API)


