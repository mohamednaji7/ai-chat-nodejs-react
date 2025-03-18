import { Link } from 'react-router-dom'
import './dashboardSidebar.css'
import ChatsList from '../chatsList/ChatsList';
import UserButton from '../userButton/UserButton';
 
interface DashboardSidebarProps {
  children?: React.ReactNode;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ children,setIsSidebarOpen }) => {
  return (
    <div className='dashboardSidebar'>
      <div className="sidebar-header">
        {children}
        <Link to='/start-chat' 
          className='btn-new-chat'
          onClick={() => setIsSidebarOpen(false)}
          >Create a new chat</Link>
      </div>
      <hr />
      <ChatsList setIsSidebarOpen={setIsSidebarOpen} />
      <hr />
      <UserButton />
    </div>
  )
}

export default DashboardSidebar