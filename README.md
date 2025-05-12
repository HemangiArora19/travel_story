📘 Travel Story – Full Stack Project Documentation
Overview
Travel Story is a full-stack application where users can register, log in, and manage personal travel stories with images, dates, and locations. Built with a Node.js/Express backend and a React frontend, the application supports JWT authentication, image uploads, and story filtering/searching.

🌐 Backend API Documentation
Base URL
arduino
Copy
Edit
http://localhost:8000
🔐 Authentication
JWT-based authentication. All protected routes require the following header:

makefile
Copy
Edit
Authorization: Bearer <access_token>
👤 User Routes
POST /create-account
Description: Register a new user
Request Body:

json
Copy
Edit
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword"
}
Response:
201 Created – User registered

POST /login
Description: Log in a user
Request Body:

json
Copy
Edit
{
  "email": "john@example.com",
  "password": "securePassword"
}
Response:
200 OK – Returns access token

GET /get-user
Description: Get current user data
Headers: Requires Authorization
Response:
200 OK – User details

📖 Travel Story Routes
POST /add-travel-story
Description: Add a new travel story
Request Body:

json
Copy
Edit
{
  "title": "Trip to Bali",
  "story": "Great adventure!",
  "visitedLocation": "Bali",
  "imageUrl": "http://...",
  "visitedDate": "timestamp in ms"
}
Response:
201 Created – Story added

GET /get-all-stories
Description: Retrieve all stories by the logged-in user
Response:
200 OK – Array of stories

POST /edit-story/:id
Description: Edit a specific story
Request Body:

json
Copy
Edit
{
  "title": "Updated Title",
  "story": "Updated story",
  "visitedLocation": "Updated location",
  "imageUrl": "http://...",
  "visitedDate": "timestamp in ms"
}
Response:
200 OK – Story updated

DELETE /delete-story/:id
Description: Delete a story
Response:
200 OK – Story deleted

🖼 Image Routes
POST /image-upload
Description: Upload an image (form-data field: image)
Response:
200 OK – Image URL returned

DELETE /delete-image?imageUrl=...
Description: Delete an image
Response:
200 OK – Image deleted

⭐️ Story Features
PUT /update-is-favourite/:id
Description: Toggle favourite flag
Request Body:

json
Copy
Edit
{ "isFavourite": true }
Response:
200 OK – Updated

GET /search?query=...
Description: Search by title, story, or location
Response:
200 OK – Results

GET /travel-stories/filter?startDate=...&endDate=...
Description: Filter by visited date (in milliseconds)
Response:
200 OK – Filtered stories

📂 Static File Access
/uploads/<filename> – Uploaded images

/assets/<filename> – Static assets

⚙️ Environment Variables
ini
Copy
Edit
PORT=8000
MONGO_URI=<MongoDB URI>
ACCESS_TOKEN_SECRET=<JWT Secret>
🧩 Models
User Model
js
Copy
Edit
{
  fullName: String,
  email: String,
  password: String (hashed)
}
Travel Story Model
js
Copy
Edit
{
  title: String,
  story: String,
  visitedLocation: String,
  imageUrl: String,
  visitedDate: Date,
  userId: ObjectId,
  isFavourite: Boolean (default: false)
}
🖥 Frontend (React)
📁 Structure
bash
Copy
Edit
/src
  /components      // Reusable UI components
  /pages           // Page-level components
  /services        // API calls (Axios or Fetch)
  /contexts        // Auth or global state
  App.js
  index.js
🔑 Authentication
Access token stored in localStorage or context

Protected routes use <PrivateRoute> component

Token added in Axios headers for API calls

✨ Features
User Registration/Login

Create/Edit/Delete Travel Stories

Upload/Delete Images

Mark Stories as Favourite

Search and Filter by Date

Responsive Design

📦 API Service Example (Axios)
js
Copy
Edit
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

// Usage
export const getAllStories = () => API.get('/get-all-stories');
📄 Environment Variables (Frontend)
Create .env file:

ini
Copy
Edit
REACT_APP_API_URL=http://localhost:8000
Use:

js
Copy
Edit
axios.get(`${process.env.REACT_APP_API_URL}/get-user`);
Let me know if you'd like this documentation exported as a PDF, Markdown, or README file!


2/2







You said:
README file craete it so that i can copy


ChatGPT said:
Here is your complete README.md file, ready to copy and paste into your project:

markdown
Copy
Edit
# 🌍 Travel Story

Travel Story is a full-stack application that allows users to document and manage their personal travel experiences. Users can register, log in, upload stories with images, mark favorites, and filter or search their travel history.

---

## 🚀 Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Uploads**: Multer

---

## 📦 Backend API

### Base URL

http://localhost:8000

php
Copy
Edit

### 🔐 Authentication

All protected routes require the following header:

Authorization: Bearer <access_token>

yaml
Copy
Edit

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
POST /login
Log in and receive an access token.

json
Copy
Edit
{
  "email": "john@example.com",
  "password": "securePassword"
}
GET /get-user
Retrieve logged-in user's data.

📖 Travel Story Routes
POST /add-travel-story
Add a new travel story.

json
Copy
Edit
{
  "title": "Trip to Bali",
  "story": "Great adventure!",
  "visitedLocation": "Bali",
  "imageUrl": "http://...",
  "visitedDate": "timestamp in ms"
}
GET /get-all-stories
Fetch all stories of the logged-in user.

POST /edit-story/:id
Update an existing story.

json
Copy
Edit
{
  "title": "Updated Title",
  "story": "Updated story",
  "visitedLocation": "Updated location",
  "imageUrl": "http://...",
  "visitedDate": "timestamp in ms"
}
DELETE /delete-story/:id
Delete a specific story.

🖼 Image Routes
POST /image-upload
Upload an image (form-data field: image).

DELETE /delete-image?imageUrl=...
Delete an image by URL.

⭐ Story Features
PUT /update-is-favourite/:id
Toggle the favorite status of a story.

json
Copy
Edit
{
  "isFavourite": true
}
GET /search?query=...
Search stories by title, content, or location.

GET /travel-stories/filter?startDate=...&endDate=...
Filter stories by visited date (timestamp in milliseconds).

📂 Static Files
/uploads/<filename> – Uploaded images

/assets/<filename> – Static assets

🌱 Environment Variables
Create a .env file in the root directory with:

ini
Copy
Edit
PORT=8000
MONGO_URI=<Your MongoDB connection string>
ACCESS_TOKEN_SECRET=<Your JWT secret>
🧩 Models
User Model
js
Copy
Edit
{
  fullName: String,
  email: String,
  password: String (hashed)
}
Travel Story Model
js
Copy
Edit
{
  title: String,
  story: String,
  visitedLocation: String,
  imageUrl: String,
  visitedDate: Date,
  userId: ObjectId,
  isFavourite: Boolean (default: false)
}
🖥 Frontend (React)
📁 Folder Structure
bash
Copy
Edit
/src
  /components
  /pages
  /services
  /contexts
  App.js
  index.js
🔑 Authentication
JWT token stored in localStorage or context.

Protected routes use a PrivateRoute component.

Axios is configured to attach token to each request.

📦 Example API Call with Axios
js
Copy
Edit
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
🌐 Frontend Environment Variables
Create a .env file:

ini
Copy
Edit
REACT_APP_API_URL=http://localhost:8000
📸 Features
User authentication

Create, edit, and delete travel stories

Upload and delete images

Mark stories as favorites

Search and filter stories by date

Responsive UI

🛠 Setup Instructions
Backend
Clone the repo and navigate to the backend folder.

Install dependencies:

bash
Copy
Edit
npm install
Create a .env file as described above.

Run the server:

bash
Copy
Edit
npm run dev
Frontend
Navigate to the frontend folder.

Install dependencies:

bash
Copy
Edit
npm install
Create a .env file as described above.

Run the frontend:

bash
Copy
Edit
npm start
