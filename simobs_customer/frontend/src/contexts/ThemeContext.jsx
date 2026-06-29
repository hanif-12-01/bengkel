import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme-night');

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      let currentTheme = 'theme-morning';

      if (hour >= 5 && hour < 11) {
        currentTheme = 'theme-morning';
      } else if (hour >= 11 && hour < 17) {
        currentTheme = 'theme-afternoon';
      } else if (hour >= 17 && hour < 21) {
        currentTheme = 'theme-evening';
      } else {
        currentTheme = 'theme-night';
      }

      setTheme(currentTheme);
      
      // Apply theme class to html element so CSS variables cascade to all children
      document.documentElement.className = currentTheme;
    };

    updateTheme();
    
    // Check every minute if the theme needs to change
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
