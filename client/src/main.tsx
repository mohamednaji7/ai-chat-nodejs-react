import './index.css'
import React  from 'react'
import ReactDom from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './routes/home/Home'
import Chat from './routes/chat/Chat'
import Agent from './routes/agent/Agent'
import NewChat from './routes/newChat/NewChat'

import RootLayout from './layouts/rootLayout/RootLayout'
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'



import ErrorPage from './routes/errorPage/ErrorPage'


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
          ,
          {
            path: 'agent/:name',
            element: <Agent />
          }
        ]
      }
    ]
  }

])

ReactDom.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)