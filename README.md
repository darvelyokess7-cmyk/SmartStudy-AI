# SmartStudy AI
<img width="446" height="444" alt="Screenshot 2026-09-11 224636" src="https://github.com/user-attachments/assets/b9ec6a71-ea15-402f-939a-e18033c7ed4b" />


## 📚 Intelligent PDF Learning Assistant

SmartStudy AI is a web-based learning assistant designed to help students study more efficiently from PDF documents.

The application allows students to upload study materials, interact with their documents, generate learning content, and manage their study activities through a simple and modern interface.



---

## 🎯 Project Objectives

The main objectives of SmartStudy AI are to:

- Help students study from their PDF documents.
- Make learning materials easier to understand.
- Provide an interactive learning experience.
- Organize study materials in one place.
- Improve students' productivity and learning efficiency.

---

## ✨ Main Features

### 👤 User Management
- User registration
- User login
- User authentication
- User profile management
- Logout

### 📄 PDF Management
- Upload PDF documents
- Store uploaded documents
- Manage study materials

### 🤖 AI Learning Assistant
- Generate summaries
- Generate questions and quizzes
- Provide learning assistance based on study materials

### 📊 Study Management
- Track learning activities
- Organize study materials
- Monitor learning progress

### 🎨 User Interface
- Modern and responsive interface
- Dashboard
- Navigation system
- Light/Dark theme support

---

## 🏗️ Project Architecture

The project is divided into two main parts:

```text
SmartStudy/
│
├── Backend/
│   ├── src/
│   ├── prisma/
│   ├── uploads/
│   ├── dist/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── dist/
│   ├── package.json
│   └── index.html
│
└── README.md

## 🛠️ Tech Stack

Frontend: React, Vite, TypeScript, Material UI (MUI)
Backend: Node.js, Express, TypeScript, Prisma ORM
Database: PostgreSQL
AI: OpenRouter API
Auth: JWT
File Handling: Multer

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/darvelyokess7-cmyk/SmartStudy-AI.git
cd SmartStudy-AI


2.Setup the Backend
cd Backend
npm install

Create a .env file with:
DATABASE_URL="your_postgresql_connecting_string"
JWT_SECRET="your_jwt_secret"
OPENROUTER_API_KEY="your_openrouter_key"

npx prisma migrate dev
npm run dev


3.Setup the Frontend
cd frontend
npm install
npm run dev

👤 Author
Davalon Dagvel Yokessa--Software Engineering Student, European University OF Lefke






