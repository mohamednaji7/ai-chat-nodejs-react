// src/components/sidebarToggleButton/SidebarToggleButton.tsx

import React from 'react';
import './sidebarToggleButton.css';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button className="sidebar-toggle-button" onClick={onClick}>
      {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>
  );
};

export default SidebarToggleButton;