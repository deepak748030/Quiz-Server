# Quiz Server

## 🧠 Overview

**Quiz Server** is the backend service for the [Quiz Portal](https://github.com/deepak748030/Quiz-Dashboard) application. It powers the role-based quiz system by handling authentication, quiz creation, submission tracking, scoring, and analytics.

Built with **Node.js**, **Express**, and **TypeScript**, this backend exposes a robust RESTful API to serve students, instructors, and admins with secure, scalable quiz operations.

---

## 🚀 Features

* 🔐 **Role-Based Authentication (JWT)**

  * Students: Take quizzes and view results
  * Instructors: Create/manage quizzes and track results
  * Admins: Full control over users and quizzes

* 📊 **Quiz & Result Management**

  * Create quizzes with multiple-choice questions
  * Schedule quizzes with timers
  * Auto-score submissions
  * Track student performance and quiz analytics

* ⚙️ **RESTful API Endpoints**

  * User authentication & role authorization
  * Quiz CRUD operations
  * Result submission & retrieval
  * Dashboard statistics for all roles

---

## 🛠️ Tech Stack

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Runtime     | Node.js                    |
| Language    | TypeScript                 |
| Framework   | Express.js                 |
| Database    | MongoDB                    |
| Auth        | JSON Web Tokens (JWT)      |
| Environment | dotenv                     |
| Dev Tools   | Nodemon, ts-node, Prettier |

---

## 🧑‍💻 Getting Started

### Prerequisites

* Node.js v18+
* MongoDB (local or Atlas)
* npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/deepak748030/Quiz-Server.git
cd Quiz-Server

# Install dependencies
npm install

# Create a `.env` file based on `.env.example`
cp .env.example .env

# Start the development server
npm run dev
```

---

## 🌐 API Endpoints (Sample)

| Method | Endpoint               | Description                    | Access           |
| ------ | ---------------------- | ------------------------------ | ---------------- |
| POST   | `/api/auth/register`   | Register new user              | Public           |
| POST   | `/api/auth/login`      | User login                     | Public           |
| GET    | `/api/quizzes`         | Get all quizzes                | Authenticated    |
| POST   | `/api/quizzes`         | Create new quiz                | Instructor/Admin |
| POST   | `/api/submit/:quizId`  | Submit quiz answers            | Student          |
| GET    | `/api/results/:userId` | Get quiz results for a student | Student          |

---

## 📁 Project Structure

```
Quiz-Server/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.ts
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file using the `.env.example` template:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 📦 Production

To build for production:

```bash
npm run build
```

To run the compiled JS:

```bash
node dist/index.js
```

---

## 🧩 Related Projects

* 🌐 Frontend: [Quiz Dashboard (React + TS)](https://github.com/deepak748030/Quiz-Dashboard)
* 📦 Backend: [Quiz Server (Express + TS)](https://github.com/deepak748030/Quiz-Server)

---

## 🙋‍♂️ Contributing

Contributions are welcome! Please open issues or pull requests for suggestions and improvements.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

