import { Navigate } from 'react-router-dom'
import './home.css'
import { useAuth } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
const Home = () => {
  // Initial state based on current URL hash

  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Navigate to="/start-chat" replace />
  }


  
  // Force re-render with a key when authMode changes
  return (
    <div className="home">
      <div className="left">
        <h1>Beyond AI chats</h1>
        <h3>AI Client</h3>
        <h2>is your go-to helpful assistant</h2>
        <div className="signLinks">
            <Link to='/sign-up'>Get Started</Link>
            <Link to='/sign-in'>Log in</Link>
        </div>
      </div>

    </div>
  )
}

export default Home