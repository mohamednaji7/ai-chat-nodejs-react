// src/layouts/dashboardLayout/DashboardLayout.tsx

import './dashboardLayout.css'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardSidebar from '../../components/dashboardSidebar/DashboardSidebar';
import SidebarToggleButton from '../../components/sidebarToggleButton/SidebarToggleButton';
import FileExplorerSidebar from '../../components/FileExplorerSidebar/FileExplorerSidebar';

import supabase from '../../utils/supabase';
import { Files, X } from 'lucide-react'; // Import icons for the buttons

import { useFileExplorerContext } from '../../contexts/FileExplorerContext';
import { useProjectContext } from '../../contexts/ProjectContext';

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

  // Get project context
  const { selectedProjectId } = useProjectContext();
  
  // Replace local state with context
  const { isFileExplorerOpen, setIsFileExplorerOpen } = useFileExplorerContext();
  
  // Remove the useState for isFileExplorerOpen
  // const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);
  
  const { data: userChats } = useQuery<Chat[]>({
    queryKey: [selectedProjectId, 'userChats'],
    // This just observes the cache without making a new request
    // It will update whenever the userChats data changes anywhere in your app
    staleTime: Infinity,
    gcTime: Infinity 
  });

  // Add this effect to handle the coordination
  useEffect(() => {
    // When file explorer opens, close the sidebar if it's open
    if (isFileExplorerOpen && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isFileExplorerOpen, setIsSidebarOpen]);
  
  const chatTitle = userChats?.find((chat) => chat._id === chatId)?.title || 'New Chat';
  console.log('chatTitle', chatTitle)
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className='dashboardLayout'>
      {/* Floating toggle button - always visible */}
      <div className="floating-toggle">
        <SidebarToggleButton 
          isOpen={isSidebarOpen} 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      </div>

      {/* Floating file explorer toggle button - always visible */}
      <div className="floating-toggle-right">
        <button 
          className="file-explorer-toggle-btn"
          onClick={() => {
            setIsFileExplorerOpen(!isFileExplorerOpen);
          }}
          aria-label="Toggle File Explorer"
        >
          {isFileExplorerOpen ? <X size={24} /> : <Files size={24} />}
        </button>
      </div>

      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}
      <div className={`${isSidebarOpen ? 'sidebar' : 'sidebar-closed'}`}>
        <DashboardSidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      
      <div className={`contentContiner ${isFileExplorerOpen ? 'with-file-explorer' : ''} ${isExpanded ? 'expanded' : ''}`}>
        <div className="heading">
          <div className="chat-title">{chatTitle}</div>
        </div>
        <div className="content"> <Outlet/> </div>
      </div>

      {/* File Explorer Sidebar - now part of the main layout */}
      <div className={`file-explorer-container ${isFileExplorerOpen ? 'open' : 'closed'} ${isExpanded ? 'expanded' : ''}`}>
        <FileExplorerSidebar isOpen={isFileExplorerOpen} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </div>
    </div>
  )
}

export default DashboardLayout
