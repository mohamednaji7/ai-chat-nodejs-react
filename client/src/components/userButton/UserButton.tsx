import { useState, useRef,  useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import './userButton.css'
import supabase from '../../utils/supabase'
const UserButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Guest'
  const userInitial = username.charAt(0).toUpperCase()
  const menuRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null) // Add this ref

  const handleLogout = () => {
    setShowConfirmation(true)
  }


  const confirmLogout =  async () => {

    try {
      // Wait for the sign-out process to complete
      const { error } = await supabase.auth.signOut();

      if (error) {
        // Handle potential errors during sign out
        console.error('Error signing out:', error);
        alert(`Error logging out: ${error.message}`);
        // Optionally clear local storage even on error if desired
        // localStorage.removeItem('username');
      } else {
        // Sign out successful
        console.log('User signed out successfully.');
        // Clear relevant local storage *after* successful sign out
        localStorage.removeItem('username');
        // Navigate to the home page *after* sign out completes
        // The onAuthStateChange listener in Home should handle the session state
        navigate('/');
      }
    } catch (error) {
      // Catch any unexpected errors during the async operation
      console.error('Unexpected error during logout:', error);
      alert(`An unexpected error occurred during logout.`);
      // Clear local storage as a fallback if needed
      localStorage.removeItem('username');
      navigate('/'); // Navigate even if there was an unexpected error
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