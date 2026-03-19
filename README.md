# LOOP-IN
## Full-Stack React Article Platform
A MERN-stack application with Firebase Authentication and Cloud Storage integration to manage articles and events.

- MongoDB
- Express
- React
- Node.js

## 🛠 Tech Stack

- Frontend: React (Vite), Axios, React Router
- Backend: Node.js, Express
- Database: MongoDB (Atlas)
- Authentication: Firebase Admin SDK (Auth)
- Storage: Firebase Cloud Storage (via Google Cloud Bucket).
- File Handling: Multer (Memory Storage).

## 📋 Prerequisites
- Node.js: v18.0 or higher.
- MongoDB: A running local instance or a MongoDB Atlas connection string.
- Firebase: A project with Storage and Authentication enabled.
- Credentials: A credentials.json file (Service Account Key) from Firebase Project Settings.

## ⚙️ Configuration
- Backend Environment: Create a .env file in the root directory:
    - Code snippet
    - PORT=8000
    - MONGODB_USERNAME=your_username
    - MONGODB_PASSWORD=your_password
    - Service Account: Place your Firebase credentials.json in the server root.

- Storage Bucket: 
    - Update the storageBucket URL in your server entry file to match your Firebase bucket name.

## 🚀 How to Run
### Installation
Install dependencies for both the frontend and backend:

    // Navigate to root dir

    bash
    npm install

## 1. Development Mode
Run the backend server:

    // Default runs on http://localhost:8000

    bash
    npm run dev 


Run the frontend (Vite):

    // Default runs on http://localhost:5173

    bash
    cd client && npm run dev


## 2. Production Build
To run the app as a single unit (Express serving the static build):

    // Build the frontend

    bash
    cd client && npm run build

### Start the server
cd .. && npm start