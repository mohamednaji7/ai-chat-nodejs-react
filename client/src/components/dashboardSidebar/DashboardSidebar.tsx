import { Link } from 'react-router-dom'
import './dashboardSidebar.css'
import ChatsList from '../chatsList/ChatsList';
import UserButton from '../userButton/UserButton';
interface DashboardSidebarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ setIsSidebarOpen }) => {

  return (
    <div className='dashboardSidebar'>
      <div className="sidebar-header">
        <Link to='/start-chat' 
            className='btn-new-chat'
            onClick={() => setIsSidebarOpen(false)}
        >Create a new chat</Link>
        
        { localStorage.getItem('isAdmin') && 
          <a href='/admin-dashboard' className='btn-admin-dashboard'
            >Go to the dashboard</a>
        }

      </div>
      <hr />
      <ChatsList setIsSidebarOpen={setIsSidebarOpen} />
      <hr />
      <UserButton />
    </div>
  )
}

export default DashboardSidebar