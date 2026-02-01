# 🚗 Car Brand Kilometer Tracking System

A full-stack web application built with **Node.js, Express, and a frontend framework** that allows **admins** to manage car brands and **users** to track kilometers traveled for those brands.

---

## 📌 Features

### 👑 Admin Role
- Create car brands
- View all registered brands
- Manage system data

### 👤 User Role
- View available car brands created by admin
- Add kilometers traveled for a selected brand
- View total kilometers per brand

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Role-Based Access Control (RBAC)

### Frontend
- React (or any frontend framework)
- Axios for API requests
- Role-based UI rendering

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Two roles:
  - `ADMIN`
  - `USER`
- Protected routes based on roles

---

## 📂 Project Structure

```bash
car-brand-tracker/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
