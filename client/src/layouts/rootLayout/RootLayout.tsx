// src/layouts/rootLayout/RootLayout.tsx

import './rootLayout.css'
import { useEffect } from 'react'
import {  Outlet  } from 'react-router-dom'
import { keepAliveService } from '../../utils/api'


const RootLayout = () => {
  useEffect(() => {
    // Only start keep-alive if environment variable is set to true
    if (import.meta.env.VITE_KEEP_ALIVE === 'true') {
      keepAliveService.start();
      
      // Stop keep-alive when browser closes/navigates away
      const handleBeforeUnload = () => {
        keepAliveService.stop();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  return (
        <div className='rootLayout'>
            <main>    
                <Outlet />
            </main>
        </div>

  )
}

export default RootLayout