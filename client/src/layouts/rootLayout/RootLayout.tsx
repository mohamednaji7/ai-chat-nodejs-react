import {  Outlet } from 'react-router-dom'
import './rootLayout.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file')
} 
const queryClient = new QueryClient()

const RootLayout = () => {

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className='rootLayout'>
            <main>    
                <Outlet />
            </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>

  )
}

export default RootLayout