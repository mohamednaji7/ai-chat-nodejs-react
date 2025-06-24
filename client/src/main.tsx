// src/main.tsx

import './index.css'
import React  from 'react'
import ReactDom from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './routes/home/Home'
import Chat from './routes/chat/Chat'
import NewChat from './routes/newChat/NewChat'

import RootLayout from './layouts/rootLayout/RootLayout'
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'



import ErrorPage from './routes/errorPage/ErrorPage'

import { ProjectProvider } from './contexts/ProjectContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FileExplorerProvider } from './contexts/FileExplorerContext'
import { ThemeProvider } from './contexts/ThemeContext'


// Create a client
const queryClient = new QueryClient()


const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    errorElement: <ErrorPage />, // This will handle errors for all child routes

    children: [
      {
        path: '/',
        element: ( <Home /> )
      }
      ,
      {
        element: <DashboardLayout/>,
        children: [
          {
            path: '/start-chat',
            element: < NewChat />
    
          }
          ,
          {
            path: '/chat/:id',
            element: <Chat />
          }
        ]
      }
    ]
  }

])

ReactDom.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <FileExplorerProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </FileExplorerProvider>
      </ProjectProvider>
    </QueryClientProvider>
  </React.StrictMode>
)