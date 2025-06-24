// src/contexts/ProjectContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjects, createNewProject } from '../utils/api';

// Define the Project interface
export interface Project {
  _id: string;
  name: string;
  number: string;
}

interface ProjectContextType {
  projects: Project[] | undefined;
  isLoadingProjects: boolean;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: Project | null;
  createProject: (name: string) => Promise<Project>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const queryClient = useQueryClient();
  // State for the selected project ID
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Fetch all projects using React Query
  const { 
    data: projects, 
    isLoading: isLoadingProjects 
  } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  
  // Compute the selected project object based on the selected ID
  const selectedProject = selectedProjectId && projects 
    ? projects.find(p => p._id === selectedProjectId) || null 
    : null;
  
  // Function to create a new project
  const createProject = async (name: string): Promise<Project> => {
    const newProject = await createNewProject(name);
    
    // Update the projects cache
    queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) => {
      return oldData ? [...oldData, newProject] : [newProject];
    });
    
    // Set the newly created project as selected
    setSelectedProjectId(newProject._id);
    
    return newProject;
  };
  

  
  return (
    <ProjectContext.Provider value={{ 
      projects,
      isLoadingProjects,
      selectedProjectId, 
      setSelectedProjectId,
      selectedProject,
      createProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
