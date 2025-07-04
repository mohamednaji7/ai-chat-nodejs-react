# AI Chat Application 

A full-stack AI chat application built with Node.js, Express, React, and TypeScript, featuring real-time conversations with AI models and project management capabilities .

### DeepWiki mohamednaji7/ai-chat-nodejs-react
https://deepwiki.com/mohamednaji7/ai-chat-nodejs-react  



### Screenshots

<p align="center">
<img src="app-image.png" alt="Screenshot 1" width="45%" />
<img src="app-image-2.png" alt="Screenshot 2" width="45%" />
</p>


## 🚀 Features

- **AI Chat Interface**: Interactive chat with AI models using OpenAI integration
- **Authentication**: JWT-based authentication system
- **Project Management**: Create and manage chat projects 
- **Chat History**: Persistent conversation history 
- **Real-time Streaming**: Stream AI responses in real-time 
- **Security**: Helmet and CORS protection 

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **Supabase** for database and authentication 
- **OpenAI API** for AI chat functionality 
- **JWT** for authentication 
- **Zod** for LLM tool validation 

### Frontend
- **React** with 
- **Vite** for build tooling 
- **ESLint** for code quality

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- at least one of these
  1. Gemini API key
  2. Azure  
     - AI foundry account
     - AZURE OPENAI DEPLOYMENT -  API key, and endpoint link  

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamednaji7/ai-chat-nodejs-react.git
   cd ai-chat-nodejs-react
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

## Environment Setup
   rename `.env-azure-tmp` or `.env-gemini-tmp` file (in `server/src/`) to `.env` and fill it  
   rename `.env-tmp` file (in `client/`) to `.env` and fill it


## 🚀 Development

### Start the development servers

**Backend** (runs on port 3000):
```bash
cd server
npm run dev
```

**Frontend** (runs on port 5173):
```bash
cd client
npm run dev
```

### Available Scripts

#### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run dev-prod` - Start server in production mode
- `npm test` - Run tests with Vitest
- `npm run build` - Build both client and server

#### Client Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🏗️ Project Structure

```
ai-chat-nodejs-react/
├── server/                 # Backend Express.js application
│   ├── src/
│   │   ├── index.js       # Server entry point
│   │   ├── app.js         # Express app configuration
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Custom middleware
│   └── package.json
├── client/                # Frontend React application
│   ├── src/
│   ├── vite.config.ts     # Vite configuration
│   └── package.json
└── LICENSE                # Apache 2.0 License
```

## 🔒 Authentication

The application uses JWT-based authentication with Supabase as the backend service. Authentication tokens are managed via cookies .

## 🧪 Testing

Run the test suite using Vitest :

```bash
cd server
npm test
```

## 📦 Production Build

Build the entire application:

```bash
cd server
npm run build
```

This will install dependencies and build the server and the client application.


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## Support

For support and questions, please open an issue in the GitHub repository.


## Notes

- Make sure to configure your environment variables properly before running the application. 
- The server serves the built React client as static files for production deployment. as static files, enabling single-page application routing. 
- The application uses ES modules throughout the codebase.  
