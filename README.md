# Social Media Application

A full-stack social media application built with React and Node.js, featuring user authentication, posts, likes, comments, and friend connections.

## Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 📝 **Posts** - Create, view, like, and comment on posts
- 👥 **User Profiles** - View and manage user profiles with customizable information
- 🤝 **Friends System** - Add and manage friends
- 🖼️ **Image Uploads** - Upload profile pictures and post images
- 📱 **Responsive Design** - Mobile-friendly interface built with Material-UI
- 🎨 **Dark/Light Mode** - Theme customization support
- 📊 **User Widgets** - View user information, friend lists, and advertisements

## Tech Stack

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library and styling
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Formik & Yup** - Form handling and validation
- **React Dropzone** - File uploads

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Project Structure

```
social-media/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable components
│       ├── scenes/        # Page components
│       │   ├── homePage/  # Home feed page
│       │   ├── loginPage/ # Authentication page
│       │   ├── profilePage/# User profile page
│       │   ├── navbar/    # Navigation bar
│       │   └── widgets/   # Widget components
│       ├── state/         # Redux store configuration
│       └── theme.js       # Material-UI theme settings
│
└── server/                # Node.js backend application
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware (auth)
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    ├── data/             # Seed data
    └── public/assets/    # Uploaded files
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-media
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## Environment Variables

### Root `.env` (recommended for Docker and local dev)

Create a `.env` file in the project root (see `.env.example`):

```env
Mongo_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:3001
```

### Server `.env` (optional for non-Docker local dev)

Create a `.env` file in the `server/` directory with:

```env
PORT=3001
Mongo_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

## Running the Application

### Development Mode

1. **Start the MongoDB server** (if using local MongoDB)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   node index.js
   ```
   The server will run on `http://localhost:3001`

3. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```
   The client will run on `http://localhost:3000`

### Production Build

1. **Build the React application**
   ```bash
   cd client
   npm run build
   ```

2. **Serve the production build** (you may need to configure your server to serve the build folder)

### Docker (one-command local run)

1. **Create `.env` at repo root** (see `.env.example`)
2. **Start containers**
   ```bash
   docker compose up --build
   ```
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`

### Hosted Demo (Vercel + Render)

1. **Deploy backend to Render**
   - Root directory: `server`
   - Build: `npm install`
   - Start: `node index.js`
   - Env vars: `Mongo_URL`, `JWT_SECRET`, `CLIENT_URL`
2. **Deploy frontend to Vercel**
   - Root directory: `client`
   - Build: `npm run build`
   - Output: `build`
   - Env var: `REACT_APP_API_URL=<your-render-backend-url>`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Posts
- `GET /posts` - Get all feed posts (requires authentication)
- `GET /posts/:userId/posts` - Get posts by a specific user (requires authentication)
- `POST /posts` - Create a new post (requires authentication)
- `PATCH /posts/:id/like` - Like/unlike a post (requires authentication)
- `PATCH /posts/:id/comment` - Add a comment to a post (requires authentication)

### Users
- `GET /users/:id` - Get user information
- `GET /users/:id/friends` - Get user's friends
- `PATCH /users/:id/:friendId` - Add/remove friend
- `GET /users/search/first-name?firstName=...` - Search users by first name
- `PATCH /users/:id/profile` - Update profile (self only)

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Home Feed**: View posts from all users on the home page
3. **Create Posts**: Share text and images with the community
4. **Interact**: Like posts and add comments
5. **Connect**: Add friends and view their profiles
6. **Profile**: Customize your profile with location, occupation, and profile picture

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Helmet.js for security headers
- CORS configuration
- Protected routes with authentication middleware

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Smitkumar Saspara

---
