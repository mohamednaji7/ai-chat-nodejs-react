// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'violet' | 'light' | 'dark' | 'grey'| 'earthy';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeOrder: Theme[] = ['violet', 'light', 'dark', 'grey', 'earthy'];
const isValidTheme = (t: any): t is Theme => themeOrder.includes(t);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return isValidTheme(savedTheme) ? savedTheme : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      const idx = themeOrder.indexOf(prevTheme);
      return themeOrder[(idx + 1) % themeOrder.length];
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};