// src/components/userButton/UserButton.tsx

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './userButton.css'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from '../../contexts/ThemeContext'
import { Moon, Sun, MessageSquare, Leaf, MoreHorizontal } from 'lucide-react'

const themeLabels = {
  violet: { icon: <Sun size={16} />, label: 'Violet' },
  light: { icon: <MessageSquare size={16} color="#19c37d" />, label: 'Light' },
  dark: { icon: <Moon size={16} />, label: 'Dark' },
  grey: { icon: <Moon size={16} />, label: 'Grey' },
  earthy: { icon: <Leaf size={16} color="#a89476" />, label: 'Earthy' },
}

const UserButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Guest'
  const userInitial = username.charAt(0).toUpperCase()
  const menuRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const themeSelectorRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { theme, setTheme, toggleTheme } = useTheme()
  
  const handleLogout = () => {
    setShowConfirmation(true)
  }

  const confirmLogout = async () => {
    try {
      queryClient.clear()
      queryClient.resetQueries()
      queryClient.removeQueries()
      localStorage.clear()
      navigate('/')
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  const handleThemeSelect = (selectedTheme: keyof typeof themeLabels) => {
    setTheme(selectedTheme)
    setShowThemeSelector(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      handleCancel()
      setIsOpen(false)
      setShowThemeSelector(false)
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
          <div className="theme-selector-wrapper">
            <button 
              className="theme-selector-button" 
              onClick={() => setShowThemeSelector(!showThemeSelector)}
            >
              {themeLabels[theme]?.icon ?? <span>?</span>}
              <span>{themeLabels[theme]?.label ?? 'Unknown'}</span>
              <MoreHorizontal size={16} className="theme-dots" />
            </button>

            {showThemeSelector && (
              <div className="theme-selector-menu" ref={themeSelectorRef}>
                {Object.entries(themeLabels).map(([themeName, themeData]) => (
                  <button
                    key={themeName}
                    className={`theme-option ${theme === themeName ? 'active' : ''}`}
                    onClick={() => handleThemeSelect(themeName as keyof typeof themeLabels)}
                  >
                    {themeData.icon}
                    <span>{themeData.label}</span>
                    {theme === themeName && <span className="checkmark">✓</span>}
                  </button>
                ))}
              </div>
            )}
            <button className="theme-toggle-button" onClick={toggleTheme}>
            <span>{'Toggle Theme'}</span>
          </button>
          </div>

          <div className="logout-wrapper">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            {showConfirmation && (
              <div className="confirmation-popover" ref={confirmationRef}>
                <p>Are you sure you want to logout?</p>
                <div className="confirmation-buttons">
                  <button onClick={confirmLogout}>Confirm</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  )
}

export default UserButton