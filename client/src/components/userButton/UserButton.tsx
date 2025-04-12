import { useState, useRef,  useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import './userButton.css'
import supabase from '../../utils/supabase'
import { useQueryClient } from '@tanstack/react-query'

const UserButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Guest'
  const userInitial = username.charAt(0).toUpperCase()
  const menuRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null) // Add this ref
  const queryClient = useQueryClient()
  
  const handleLogout = () => {
    setShowConfirmation(true)
  }


  const confirmLogout =  async () => {

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        // The session will be automatically cleared and the auth state change will trigger
        // your redirect to the home page
        // delete all the data in the react query cache
        queryClient.clear()
        queryClient.resetQueries()
        queryClient.removeQueries()

        localStorage.clear()
        // Redirect to the home page
        navigate('/');


      }
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
    }



  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setIsOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
    if (confirmationRef.current && !confirmationRef.current.contains(event.target as Node)) {
      handleCancel() // Call handleCancel when clicking outside confirmation dialog
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='userButtonContainer' ref={menuRef}>
      <div className='userButton' onClick={() => setIsOpen(!isOpen)}>
        <div className="avatar">
          {userInitial}
        </div>
        <div className="userInfo">
          <span className="username">{username}</span>
          <span className="role">Member</span>
        </div>
      </div>

      {isOpen && (
        <div className="popup-menu">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-backdrop">
          <div className="confirmation-dialog" ref={confirmationRef}> 
            <p>Are you sure you want to logout?</p>
            <div className="confirmation-buttons">
              <button onClick={confirmLogout}>Confirm</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserButton 