import React from 'react';
import { Menu, Moon, Sun, PlayCircle, StopCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDemoStore } from '../../stores/demoStore';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode, toggleDemoMode } = useDemoStore();
  
  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-sm dark:bg-secondary-800/70 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700 focus:outline-none transition-colors lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleDemoMode}
              className={`p-2 rounded-lg focus:outline-none transition-colors ${
                isDemoMode 
                  ? 'text-red-500 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50'
                  : 'text-green-500 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/50'
              }`}
            >
              {isDemoMode ? (
                <StopCircle className="h-5 w-5" />
              ) : (
                <PlayCircle className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700 focus:outline-none transition-colors"
              aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;