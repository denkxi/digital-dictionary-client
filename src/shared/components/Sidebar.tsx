import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/vocabulary', label: 'Vocabulary', icon: '📚' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
    { path: '/statistics', label: 'Statistics', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`bg-blue-50 min-h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex justify-between items-center p-4 border-b border-blue-100">
        {!collapsed && <h2 className="text-blue-800 font-bold text-lg select-none">Dictionary</h2>}
        <button 
          onClick={toggleSidebar} 
          className="text-blue-500 hover:text-blue-700 hover:scale-110 text-2xl font-bold cursor-pointer"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link 
                to={item.path} 
                className={`flex items-center p-3 ${
                  location.pathname === item.path 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:bg-blue-100'
                } ${collapsed ? 'justify-center' : 'pl-4'}`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
