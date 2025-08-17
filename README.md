# 📚 Book Management API

A robust and well-documented RESTful API for managing book collections, including user authentication. Built with **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features

* **User Authentication**
  * Secure user registration and login with JSON Web Tokens (JWT).

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

* **Node.js** – JavaScript runtime environment
* **Express.js** – Fast, minimalist web framework
* **MongoDB** – Flexible NoSQL database
* **JWT** – Authentication with JSON Web Tokens
* **Bcrypt.js** – Password hashing
* **Joi** – Input validation
* **Dotenv** – Environment variable management
* **Swagger-jsdoc & Swagger-ui-express** – API documentation
* **Nodemon** – Development tool for auto-restarting server

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


