
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-shell-text-secondary group-hover:text-shell-text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LogoutIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-shell-sidebar border-b border-shell-border h-16 shrink-0">
      <h1 className="text-xl font-bold text-shell-text-primary">App Shell</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <div id="user-info" className="flex items-center space-x-2 group">
            <UserIcon/>
            <span className="text-sm text-shell-text-secondary group-hover:text-shell-text-primary transition-colors">{user.email}</span>
          </div>
          <button
            id="logout-button"
            onClick={onLogout}
            className="flex items-center px-3 py-2 text-sm bg-shell-content hover:bg-red-500/20 text-red-400 rounded-md transition-colors duration-200"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
