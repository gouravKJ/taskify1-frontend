# 🚀 Taskify – Real-Time Collaborative Task Manager

Taskify is a full-stack real-time task management web app built with the MERN stack and Socket.IO. It allows multiple users to collaboratively manage tasks across boards, with real-time updates, smart task assignment, and activity logs.

---

## 📸 Live Demo

🔗 **Frontend**: [https://taskify-frontend.vercel.app](https://taskify1-frontend.vercel.app/)  
🔗 **Backend**: [https://taskify-backend.onrender.com](https://taskify-backend-uvmk.onrender.com)  
🎥 **Demo Video**: [Watch on YouTube](https://youtube.com/demo-taskify)

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- React Router
- CSS (responsive & dark mode)
- Socket.IO (Client)

### Backend:
- Node.js
- Express.js
- RestAPI
- MongoDB (Atlas)
- Mongoose
- Socket.IO (Server)
- dotenv

---
### 🚀 Setup & Installation

### 🔧 Backend

1. Clone the repo:
   ```bash
   git clone https://github.com/gouravKJ/taskify-backend.git
   cd backend
   
   Install dependencies:
   npm install
   
   Create a .env file:
   env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=10000
   
   Start the server:
   npm start

   
### 💻 Frontend
2.Clone the frontend repo:
```bash
git clone  https://github.com/gouravKJ/taskify1-frontend.git
cd client

Install dependencies:
npm install

Create .env file:
env
REACT_APP_API=https://taskify-backend.onrender.com

Start the app:
npm start


```
### ✅ Features
👥 User Authentication (Register, Login, Logout)

🧩 Smart Task Assignment

📋 Drag & Drop across Todo, In Progress, Done

🌙 Dark Mode Toggle

💬 Real-time Task Updates using Socket.IO

📝 Activity Log Panel

📱 Mobile Responsive

🔒 Protected Routes with JWT

---
### ⚙️ Smart Assign Logic
Smart Assign button intelligently assigns the task to the user with the least number of open (incomplete) tasks.

```js

const workload = {};
users.forEach(user => {
  workload[user._id] = tasks.filter(t => t.assigneduser?._id === user._id && t.status !== 'Done').length;
});

const leastLoaded = Object.entries(workload).sort((a, b) => a[1] - b[1])[0];
```
---
### 🧱 Conflict Handling
All task operations are synced in real-time using Socket.IO. If multiple users interact simultaneously:

🔄 taskadded, taskupdated, and taskdeleted events update tasks for all connected clients instantly.

💡 UI handles editing/deleting edge cases cleanly using React state.
---

```
taskify/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   └── navbar.css
│       ├── pages/
│       │   ├── dashboard.js
│       │   ├── dashboard.css
│       │   ├── register.js
│       │   ├── register.css
│       │   └── login.js
│       ├── App.js
│       ├── socket.js
│       └── .env
├── server/
│   └── index.js
├── package.json
└── README.md
```

---
### 📚 Commit History

All commits are made regularly and descriptively to track project development:

feat: add smart assign logic

fix: mobile drag drop bug

style: improve dark mode support

---
### 📌 License
This project is open-source and free to use.

---

### 👤 Contributor

**Gourav Kumar Jaiswal**  
- [GitHub](https://github.com/gouravKJ)  
- [LinkedIn](www.linkedin.com/in/gourav-kumar-jaiswal-b8b55a33b)

  






