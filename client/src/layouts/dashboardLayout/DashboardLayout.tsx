import './dashboardLayout.css'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {  useState} from 'react';
import DashboardSidebar from '../../components/dashboardSidebar/DashboardSidebar';
import SidebarToggleButton from '../../components/sidebarToggleButton/SidebarToggleButton';

import supabase from '../../utils/supabase';


interface Chat {
  _id: string;
  title: string;
  // Add other chat properties as needed
}

const DashboardLayout = () => {

  
  const path = useLocation().pathname;
  const chatId = path.split('/').pop();
  const navigate = useNavigate();

    // Check auth status on component mount
    useEffect(() => {
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/'); // Redirect if already signed in
        }
      };
      checkUser();

    }, [navigate]);
  

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const storedValue = localStorage.getItem('isSidebarOpen');
    return storedValue === 'true';
  });
  
  
  useEffect(() => {
    localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);


  
  // });
  const { data: userChats } = useQuery<Chat[]>({
    queryKey: ['userChats'],
    // This just observes the cache without making a new request
    // It will update whenever the userChats data changes anywhere in your app
    staleTime: Infinity,
    gcTime: Infinity 
  });

  

  
  const chatTitle = userChats?.find((chat) => chat._id === chatId)?.title || 'New Chat';
  // const chatTitle = userChats?.find((chat) => chat._id === chatId)?.title 
  console.log('chatTitle', chatTitle)
  

  return (
    <div className='dashboardLayout'>
      {/* Floating toggle button - always visible */}
      <div className="floating-toggle">
        <SidebarToggleButton 
          isOpen={isSidebarOpen} 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      </div>

      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}
      <div className={`${isSidebarOpen ? 'sidebar' : 'sidebar-closed'}`}>
        <DashboardSidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      
      <div className="contentContiner">
        <div className="heading">
          <div className="chat-title">{chatTitle}</div>
        </div>
        <div className="content"> <Outlet/> </div>
      </div>
    </div>
  )
}

export default DashboardLayout