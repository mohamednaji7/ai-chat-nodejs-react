// src/contexts/FileExplorerContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FileExplorerContextType {
  selectedFileId: string | null;
  setSelectedFileId: (fileId: string | null) => void;
  isFileExplorerOpen: boolean;
  setIsFileExplorerOpen: (isOpen: boolean) => void;
}

const FileExplorerContext = createContext<FileExplorerContextType | undefined>(undefined);

export const FileExplorerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);

  return (
    <FileExplorerContext.Provider value={{ 
      selectedFileId, 
      setSelectedFileId,
      isFileExplorerOpen,
      setIsFileExplorerOpen
    }}>
      {children}
    </FileExplorerContext.Provider>
  );
};

export const useFileExplorerContext = () => {
  const context = useContext(FileExplorerContext);
  if (context === undefined) {
    throw new Error('useFileExplorerContext must be used within a FileExplorerProvider');
  }
  return context;
};
