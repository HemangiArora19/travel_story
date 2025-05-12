# 📘 Travel Story – Full Stack Project Documentation

## 🧽 Overview

**Travel Story** is a full-stack application where users can register, log in, and manage personal travel stories with images, dates, and locations. Built with a **Node.js/Express** backend and a **React** frontend, the app supports:

* JWT Authentication
* Image Uploads
* Story Filtering & Searching

---

## 🌐 Backend API Documentation

### Base URL

```
http://localhost:8000
```

### 🔐 Authentication

All protected routes require the following header:

```
Authorization: Bearer <access_token>
```

---

### 👤 User Routes

#### `POST /create-account`

Register a new user.

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword"
}
```

#### `POST /login`

Log in and receive an access token.

```json
{
  "email": "john@example.com",
  "password": "securePassword"
}
```

#### `GET /get-user`

Retrieve logged-in user's data. Requires `Authorization` header.

---

### 📖 Travel Story Routes

#### `POST /add-travel-story`

Add a new travel story.

```json
{
  "title": "Trip to Bali",
  "story": "Great adventure!",
  "visitedLocation": "Bali",
  "imageUrl": "http://...",
  "visitedDate": 1715539200000
}
```

#### `GET /get-all-stories`

Retrieve all stories by the logged-in user.

#### `POST /edit-story/:id`

Update an existing story.

```json
{
  "title": "Updated Title",
  "story": "Updated story",
  "visitedLocation": "Updated location",
  "imageUrl": "http://...",
  "visitedDate": 1715539200000
}
```

#### `DELETE /delete-story/:id`

Delete a specific story.

---

### 🖼 Image Routes

#### `POST /image-upload`

Upload an image (form-data field: `image`).

#### `DELETE /delete-image?imageUrl=...`

Delete an image by URL.

---

### ⭐ Story Features

#### `PUT /update-is-favourite/:id`

Toggle the favorite status of a story.

```json
{
  "isFavourite": true
}
```

#### `GET /search?query=...`

Search stories by title, content, or location.

#### `GET /travel-stories/filter?startDate=...&endDate=...`

Filter stories by visited date (timestamp in milliseconds).

---

### 📂 Static File Access

* `/uploads/<filename>` – Access uploaded images
* `/assets/<filename>` – Static assets

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root:

```
PORT=8000
MONGO_URI=<Your MongoDB URI>
ACCESS_TOKEN_SECRET=<Your JWT secret>
```

---

## 🧹 Models

### User Model

```js
{
  fullName: String,
  email: String,
  password: String // hashed
}
```

### Travel Story Model

```js
{
  title: String,
  story: String,
  visitedLocation: String,
  imageUrl: String,
  visitedDate: Date,
  userId: ObjectId,
  isFavourite: Boolean // default: false
}
```

---

## 🖥️ Frontend (React)

### 📁 Folder Structure

```
/src
  /components      // Reusable UI components
  /pages           // Page-level components
  /services        // API calls (Axios)
  /contexts        // Auth or global state
  App.js
  index.js
```

### 🔑 Authentication

* JWT stored in `localStorage` or Context
* Protected routes via `<PrivateRoute>`
* Token auto-attached in Axios headers

### 📦 Example API Service (Axios)

```js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllStories = () => API.get('/get-all-stories');
```

### 📄 Frontend Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:8000
```

Use it like:

```js
axios.get(`${process.env.REACT_APP_API_URL}/get-user`);
```

---

## 📷 Features

* User authentication (JWT)
* Create, edit, delete travel stories
* Upload and delete images
* Mark stories as favorites
* Search and filter by date
* Responsive UI

---

## 🛠️ Setup Instructions

### Backend

1. Clone the repo and navigate to backend directory
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file as described above
4. Run server:

```bash
npm run dev
```

### Frontend

1. Navigate to frontend directory
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file as described above
4. Run app:

```bash
npm start
```

---

Happy Coding! ✨
