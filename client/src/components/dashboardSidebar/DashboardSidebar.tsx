// src/components/dashboardSidebar/DashboardSidebar.tsx

import { useState, useEffect, useRef } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom'
import './dashboardSidebar.css'
import ChatsList from '../chatsList/ChatsList';
import UserButton from '../userButton/UserButton';
import { Plus, ChevronDown } from 'lucide-react'; // Import icons

interface DashboardSidebarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ setIsSidebarOpen }) => {
  const { projects, selectedProjectId, setSelectedProjectId, isLoadingProjects, createProject } = useProjectContext();
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
        // These resets are now handled in the dropdown toggle
        // setIsCreatingProject(false);
        // setNewProjectName('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  // Get the name of the selected project
  const selectedProjectName = projects?.find(p => p._id === selectedProjectId)?.name || 'Select a project';

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    if (projectId === selectedProjectId) {
      setIsProjectDropdownOpen(false);
      return; // 👈 Do nothing if it's already selected
    }
    setSelectedProjectId(projectId);
    setIsProjectDropdownOpen(false);
    // These resets are now handled in the dropdown toggle
    // setIsCreatingProject(false);
    // setNewProjectName('');
    navigate('/start-chat'); // 🔁 Navigate when project changes
  };
  
  // Handle creating a new project
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      await createProject(newProjectName);
      setNewProjectName('');
      setIsCreatingProject(false);
      setIsProjectDropdownOpen(false);
      
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className={`dashboardSidebar ${isProjectDropdownOpen ? 'dim-chatlist' : ''}`}>
      <div className="sidebar-header">
        {/* Project selector */}
        <div className="project-selector-container" ref={dropdownRef}>
          {isLoadingProjects ? (
            <div className="project-loading">Loading...</div>
          ) : (
            <>
              <div 
                className="project-dropdown-header" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProjectDropdownOpen(!isProjectDropdownOpen);
                  // Reset create project form when opening dropdown
                  if (!isProjectDropdownOpen) {
                    setIsCreatingProject(false);
                    setNewProjectName('');
                  }
                }}
              >
                <span className="selected-project-name">{selectedProjectName}</span>
                <ChevronDown size={16} className={`dropdown-icon ${isProjectDropdownOpen ? 'open' : ''}`} />
              </div>
              
              {isProjectDropdownOpen && (
                <div className="project-dropdown-menu">
                  {projects && projects.length > 0 ? (
                    <>
                      {/* Filter out the currently selected project before mapping */}
                      {projects
                        // .filter(project => project._id !== selectedProjectId)
                        .map(project => (
                          <div 
                            key={project._id} 
                            className={`project-option ${project._id === selectedProjectId ? "selected" : ""}`}
                            onClick={() => handleProjectSelect(project._id)}
                          >
                            {project.name}
                          </div>
                        ))}
                      {projects.length > 1 && <div className="dropdown-divider"></div>}
                    </>
                  ) : (
                    <div className="no-projects-message">No projects available</div>
                  )}
                  {isCreatingProject ? (
                    <div className="create-project-form">
                      <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Project name"
                        className="project-name-input"
                        autoFocus
                      />
                      <div className="create-project-actions">
                        <button 
                          className="create-btn"
                          onClick={handleCreateProject}
                          disabled={!newProjectName.trim()}
                        >
                          Create
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => {
                            setIsCreatingProject(false);
                            setNewProjectName('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="create-project-option"
                      onClick={() => setIsCreatingProject(true)}
                    >
                      <Plus size={16} />
                      <span>Create a new workspace</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        <Link to='/start-chat' 
            className='btn-new-chat'
            // onClick={() => setIsSidebarOpen(false)}
        >
          New chat
        </Link>
      </div>
      <hr />
      <ChatsList setIsSidebarOpen={setIsSidebarOpen} />
      <hr />
      <UserButton />
    </div>
  );
};

export default DashboardSidebar;
