import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const themes = ['light', 'dark', 'blue', 'green', 'purple', 'orange', 'pink', 'cyan', 'teal', 'lime', 'amber', 'deep-orange', 'brown', 'grey', 'blue-grey', 'red', 'deep-purple', 'indigo', 'light-blue', 'light-green', 'yellow', 'black', 'white'];


  useEffect(() => {
    themes.forEach(t => document.documentElement.classList.remove(t));
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const currentIndex = themes.indexOf(prevTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};