import React, { useState } from 'react';

interface SidebarProps {
  onNavClick: (url: string) => void;
  apps: { [key: string]: string };
}

interface NavLinkProps {
  label: string;
  url: string;
  isActive: boolean;
  onClick: (url: string) => void;
  // FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
}

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const NavLink: React.FC<NavLinkProps> = ({ label, url, isActive, onClick, icon }) => {
  const activeClasses = 'bg-shell-accent text-white';
  const inactiveClasses = 'text-shell-text-secondary hover:bg-shell-content hover:text-shell-text-primary';
  
  return (
    <li>
      <a
        href="#"
        data-app-url={url}
        onClick={(e) => {
          e.preventDefault();
          onClick(url);
        }}
        className={`flex items-center px-4 py-3 rounded-md font-medium transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      >
        {icon}
        {label}
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onNavClick, apps }) => {
  const [activeUrl, setActiveUrl] = useState(apps.DASHBOARD);

  const handleNav = (url: string) => {
    setActiveUrl(url);
    onNavClick(url);
  };
  
  return (
    <nav className="w-64 bg-shell-sidebar p-4 shrink-0 flex flex-col">
      <ul className="space-y-2">
        <NavLink 
            label="Dashboard" 
            url={apps.DASHBOARD}
            isActive={activeUrl === apps.DASHBOARD}
            onClick={handleNav}
            icon={<DashboardIcon />}
        />
        <NavLink 
            label="Produtos" 
            url={apps.PRODUCTS}
            isActive={activeUrl === apps.PRODUCTS}
            onClick={handleNav}
            icon={<ProductsIcon />}
        />
        <NavLink 
            label="Admin" 
            url={apps.ADMIN}
            isActive={activeUrl === apps.ADMIN}
            onClick={handleNav}
            icon={<AdminIcon />}
        />
      </ul>
      <footer className="mt-auto text-center text-xs text-shell-text-secondary pt-4">
        <p>&copy; {new Date().getFullYear()} App Shell Inc.</p>
        <p>All rights reserved.</p>
      </footer>
    </nav>
  );
};

export default Sidebar;