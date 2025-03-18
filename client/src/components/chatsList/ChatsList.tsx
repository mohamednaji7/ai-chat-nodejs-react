import { Link , useLocation} from 'react-router-dom'
import './chatsList.css'
import {useQuery} from '@tanstack/react-query'
import { API_BASE } from '../../utils/api';
import { isMobile } from '../../utils/isMobile';
import supabase from '../../utils/supabase';

interface ChatsListProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const ChatsList: React.FC<ChatsListProps> = ({ setIsSidebarOpen }) => {


  const location = useLocation();
  const currentChatId = location.pathname.split('/').pop();

  const endpoint = `${API_BASE}/api/v1/chats`
  console.log({endpoint})

  const { error, data, isFetching } = useQuery<{ _id: string, title: string }[]>({
    queryKey: ['userChats'],
    queryFn: async () => {
      // Get the current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      const response = await fetch(
        endpoint,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
            'Content-Type': 'application/json',
          },
        }
      )
      
      console.log(response)
      
      if (!response.ok) {
        throw new Error(`${endpoint}: ${response.status}`);
      }

      return await response.json()

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
              to={`/chat/${chat._id}`} 
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