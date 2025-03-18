import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { useLocation , useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react'

import './dashboardLayout.css'
import {  useState} from 'react';
import DashboardSidebar from '../../components/dashboardSidebar/DashboardSidebar';
import SidebarToggleButton from '../../components/sidebarToggleButton/SidebarToggleButton';

interface Chat {
  _id: string;
  title: string;
  // Add other chat properties as needed
}

const DashboardLayout = () => {

  const navigate = useNavigate();
  const {userId, isLoaded} = useAuth();
  
  const path = useLocation().pathname;
  const chatId = path.split('/').pop();

  

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const storedValue = localStorage.getItem('isSidebarOpen');
    return storedValue === 'true';
  });
  
  
  useEffect(() => {
    localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);


  
  // const userChats = useQueryClient().getQueryData<Chat[]>(['userChats']);
  // Use useQuery to properly subscribe to changes in the userChats data
  // const { data: userChats } = useQuery<Chat[]>({
  //   queryKey: ['userChats'],
  //   queryFn: () => queryClient.getQueryData(['userChats']) || [],
  //   enabled: !!chatId
  // });
  const { data: userChats } = useQuery<Chat[]>({
    queryKey: ['userChats'],
    // This just observes the cache without making a new request
    // It will update whenever the userChats data changes anywhere in your app
    staleTime: Infinity,
    gcTime: Infinity 
  });


  useEffect(()=>{
    if(isLoaded && !userId){
      navigate('/')
    }
  }, [isLoaded, userId, navigate])
  
  if(!isLoaded){
    return 'Loading...'
  }


  
  const chatTitle = userChats?.find((chat) => chat._id === chatId)?.title || 'New Chat';
  // const chatTitle = userChats?.find((chat) => chat._id === chatId)?.title 
  console.log('chatTitle', chatTitle)
  

  return (
    <div className='dashboardLayout'>
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}
      <div className={`${isSidebarOpen ? 'sidebar' : 'sidebar-closed'}`}>
      <DashboardSidebar setIsSidebarOpen={setIsSidebarOpen}>
          {isSidebarOpen && (
            <div>
              <SidebarToggleButton 
                isOpen={isSidebarOpen} 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              />
            </div>
          )}
        </DashboardSidebar>
      </div>
      
      <div className="contentContiner">
        <div className="heading">
          {!isSidebarOpen && (
            <SidebarToggleButton 
              isOpen={isSidebarOpen} 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          )}       
          <div className="chat-title">{chatTitle}</div>

        </div>
        <div className="content"> <Outlet/> </div>
      </div>
      
    </div>
  )
}

export default DashboardLayout