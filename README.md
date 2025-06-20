# StudyQuest

A full-stack web application built with React, TypeScript, GraphQL, and MongoDB. This project features a modern client-server architecture with real-time data capabilities and secure authentication.

## 🚀 Features

- **Frontend**: React 18 with TypeScript and modern UI components
- **Backend**: Node.js with Apollo GraphQL Server
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication with bcrypt password hashing
- **UI Framework**: Bootstrap 5 with React Bootstrap components, Semantic UI 
- **Animations**: Framer Motion for smooth, interactive animations
- **Icons**: Bootstrap Icons and React Icons
- **Development**: Hot reloading, TypeScript compilation, and concurrent development

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - Modern UI library
- **TypeScript** 5.8.3 - Type-safe JavaScript
- **Apollo Client** 3.7.14 - GraphQL client with caching
- **React Router DOM** 6.23.1 - Client-side routing
- **Bootstrap** 5.3.6 - Responsive CSS framework
- **React Bootstrap** 2.10.10 - Bootstrap components for React
- **Framer Motion** 6.4.0 - Animation library
- **Semantic UI React** 2.1.5 - Additional UI components
- **JWT Decode** 4.0.0 - JWT token handling
- **Vite** 5.2.0 - Fast build tool and dev server

### Backend
- **Node.js** with ES Modules
- **Apollo Server** 4.10.4 - GraphQL server
- **Express** 4.19.2 - Web application framework
- **GraphQL** 16.9.0 - Query language and runtime
- **Mongoose** 8.4.3 - MongoDB object modeling
- **bcrypt** 6.0.0 - Password hashing
- **jsonwebtoken** 8.5.1 - JWT implementation
- **dotenv** 16.4.5 - Environment variable management

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Nodemon** - Auto-restart development server
- **Concurrently** - Run multiple commands simultaneously
- **Wait-on** - Wait for services to be available

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd project3
```

### 2. Install dependencies
```bash
npm install
```

This will install dependencies for both the client and server applications.

### 3. Environment Setup
Create a `.env` file in the `server` directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/project3
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

### 4. Seed the Database (Optional)
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run start:dev
```

This command will:
- Start the backend server on port 3001
- Wait for the backend to be ready
- Start the frontend development server on port 5173 (Vite default)

## 📝 Available Scripts

### Root Level Scripts
- `npm start` - Build and start production servers
- `npm run start:dev` - Start development servers concurrently
- `npm run build` - Build both client and server for production
- `npm run seed` - Seed the database with initial data
- `npm install` - Install dependencies for both client and server

### Client Scripts
- `npm run client:dev` - Start client development server
- `npm run client:build` - Build client for production

### Server Scripts
- `npm run server` - Start production server
- `npm run server:dev` - Start server in development mode

## 🏗️ Project Structure

```
project3/
├── client/                 # React frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── package.json       # Client dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── vite.config.ts     # Vite configuration
├── server/                # Node.js backend application
│   ├── src/               # Source code
│   ├── dist/              # Compiled JavaScript (auto-generated)
│   ├── package.json       # Server dependencies
│   └── tsconfig.json      # TypeScript configuration
├── package.json           # Root package.json for scripts
└── README.md             # Project documentation
```

## 🔧 Development

### Frontend Development
The client application is built with React and TypeScript, using Vite for fast development and building. Key features include:

- **Apollo Client** for GraphQL queries and mutations
- **React Router** for navigation
- **Bootstrap** for responsive design
- **Framer Motion** for animations
- **TypeScript** for type safety

### Backend Development
The server is built with Node.js and TypeScript, featuring:

- **Apollo GraphQL Server** for API endpoints
- **Express** for HTTP server functionality
- **MongoDB** with Mongoose for data persistence
- **JWT** for authentication
- **bcrypt** for secure password hashing

### Code Quality
- **ESLint** configuration for consistent code style
- **TypeScript** for compile-time error checking
- **Nodemon** for automatic server restarts during development

## 📦 Building for Production

### Build Everything
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

The production build will:
1. Compile TypeScript to JavaScript
2. Build the React app for production
3. Optimize assets for deployment

## 🚀 Deployment

This application is configured for deployment on platforms like:

- **Render** (using `npm run render-build`)
- **Heroku**
- **Vercel** (frontend)
- **Railway**

### Environment Variables for Production
Make sure to set the following environment variables in your deployment platform:

```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=<port-number>
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.



---

**Built with ❤️ using modern web technologies**