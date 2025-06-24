// src/components/chatsList/ChatsList.tsx

import { Link , useLocation} from 'react-router-dom'
import './chatsList.css'
import {useQuery} from '@tanstack/react-query'
import {  getProjectChats } from '../../utils/api';
import { isMobile } from '../../utils/isMobile';

import { useProjectContext } from '../../contexts/ProjectContext';


interface ChatsListProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const ChatsList: React.FC<ChatsListProps> = ({ setIsSidebarOpen }) => {

  
  const location = useLocation();
  const currentChatId = location.pathname.split('/').pop();
  const { selectedProject, selectedProjectId } = useProjectContext();


  const { error, data, isFetching } = useQuery<{ _id: string, title: string }[]>({
    queryKey: [selectedProjectId, 'userChats'],
    queryFn: async () => {
      if (!selectedProjectId) {
        return [];
      }
      return getProjectChats(selectedProjectId);
    },

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity


  })

  const handleChatClick = () => {
    if (isMobile()) {
      setIsSidebarOpen(false);
    }
  };
  return (
    <div className="chatsList">
      {
        isFetching?
        'Loading...' :
        error?  'An error has occurred: ' + error.message :
          data?.map((chat)=>(
            <Link 
              to={`/chat/${chat._id}?pn=${selectedProject?.number}`} 
              key={chat._id}
              className={currentChatId === chat._id ? 'active' : ''}
              onClick={handleChatClick}

            >
              {chat.title}
            </Link>
          ))
      }
    </div>
  )
}

export default ChatsList