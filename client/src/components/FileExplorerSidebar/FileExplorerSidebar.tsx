// src/components/FileExplorerSidebar/FileExplorerSidebar.tsx

import React from 'react';
import './FileExplorerSidebar.css';
import { useQuery } from '@tanstack/react-query';
import { getProjectFiles } from '../../utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Add this import
import { Maximize2, Minimize2 } from 'lucide-react';

import { useProjectContext } from '../../contexts/ProjectContext';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';

interface FileExplorerSidebarProps {
  isOpen: boolean;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

interface ProjectFile {
  _id: string;
  name: string;
  content: string;
  content_format: string;
}

const FileExplorerSidebar: React.FC<FileExplorerSidebarProps> = ({ isOpen, isExpanded, setIsExpanded }) => {
  // Use the context
  const { selectedFileId, setSelectedFileId } = useFileExplorerContext();
  const { selectedProjectId, selectedProject, isLoadingProjects} = useProjectContext();

  const { data: files, error: filesError, isFetching: isFetchingFiles } = useQuery<
    ProjectFile[]
  >({
    queryKey: [selectedProjectId, 'projectFiles'],
    queryFn: () => getProjectFiles(selectedProjectId!),
    enabled: !!selectedProjectId && !isLoadingProjects, // Only run when we have a selectedProjectId and projects are loaded
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // Find the currently selected file from the files array
  const currentFile = files?.find(file => file._id === selectedFileId) || null;

  // Handle file selection
  const handleFileClick = (file: ProjectFile) => {
    setSelectedFileId(file._id);
  };

  // Format content based on content_format
  const renderFileContent = (file: ProjectFile) => {
    if (file.content_format === 'json') {
      try {
        const jsonData = JSON.parse(file.content);
        
        // Function to syntax highlight JSON
        const syntaxHighlight = (json: string) => {
          // Replace with syntax highlighting
          return json
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
              (match) => {
                let cls = 'json-number'; // number
                if (/^"/.test(match)) {
                  if (/:$/.test(match)) {
                    cls = 'json-key'; // key
                  } else {
                    cls = 'json-string'; // string
                  }
                } else if (/true|false/.test(match)) {
                  cls = 'json-boolean'; // boolean
                } else if (/null/.test(match)) {
                  cls = 'json-null'; // null
                }
                return `<span class="${cls}">${match}</span>`;
              }
            );
        };

        const prettyJson = JSON.stringify(jsonData, null, 2);
        const highlightedJson = syntaxHighlight(prettyJson);
        
        return (
          <pre 
            className="json-content" 
            dangerouslySetInnerHTML={{ __html: highlightedJson }}
          />
        );
      } catch (error) {
        return (
          <div>
            <p className="error">Error parsing JSON: Invalid format</p>
            <pre>{file.content}</pre>
          </div>
        );
      }
    } else if (file.content_format === 'markdown'){
       // Updated to include remarkGfm plugin
      return (
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{file.content}</ReactMarkdown>
        </div>
      );
    }else {
      // Default to plain text
      return <pre>{file.content}</pre>;
    }
  };

  return (
    <div className={`file-explorer-sidebar ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-header">
        <h3>Files - {selectedProject?.name || 'No Project Selected'}</h3>
        <button 
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Minimize" : "Maximize"}
        >
          {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
      <div className="sidebar-body">
        <div className="file-list">
          {isFetchingFiles ? (
            <p>Loading files...</p>
          ) : filesError ? (
            <p className="error">Error fetching files: {filesError.message}</p>
          ) : !selectedProjectId ? (
            <p>No project selected.</p>
          ) : files && files.length > 0 ? (
            <ul>
              {files.map((file) => (
                <li
                  key={file._id}
                  onClick={() => handleFileClick(file)}
                  className={selectedFileId === file._id ? 'selected' : ''}
                >
                  {file.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No files found.</p>
          )}
        </div>
        <div className="file-mention">
          {currentFile ? (
            <>
              {renderFileContent(currentFile)}
            </>
          ) : (
            <p>Select a file to view its content.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorerSidebar;
