# Blood Bank Management System

A full-stack web application for managing blood donations, donors, hospitals, and organizations. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features
- User authentication (register/login)
- Role-based dashboards (Admin, Donor, Hospital, Organization)
- Blood donation and inventory management
- Certificate generation for donors (with QR code)
- Analytics and reporting
- Responsive UI with modern design

## Tech Stack
- **Frontend:** React, Redux, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (MongoDB Atlas)
- **Other:** JWT Auth, REST API, Vercel/Render deployment

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB Atlas account (or local MongoDB)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Divyanshjaiswal2311/Blood-Bank-Management-System.git
   cd Blood-Bank-Management-System
   ```
2. **Install backend dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root with:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     DEV_MODE=development
     ```
4. **Start the backend server:**
   ```bash
   npm start
   ```
5. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```
6. **Start the frontend app:**
   ```bash
   npm start
   ```

## Deployment
- **Frontend:** Vercel or Netlify
- **Backend:** Render, Railway, or Cyclic
- **Database:** MongoDB Atlas


## Developer
**Divyanshu Jaiswal**

---
Feel free to contribute or raise issues!
