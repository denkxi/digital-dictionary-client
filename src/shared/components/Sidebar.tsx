import { NavLink } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Dictionaries', path: '/dictionaries' },
  { name: 'Categories', path: '/word-categories' },
  { name: 'Tests', path: '/tests' },
  { name: 'Profile', path: '/profile' }
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-primary-1 text-text shadow-lg">
      <div className="p-6 text-xl font-bold">Dictionary App</div>
      <nav className="flex flex-col gap-2 px-4">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl hover:bg-primary-2 transition-all ${
                isActive ? 'bg-primary-2 font-semibold' : ''
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 w-full px-4">
        <button className="w-full px-4 py-2 bg-accent-2 rounded hover:bg-green-200 text-sm font-medium">
          Login / Logout
        </button>
      </div>
    </aside>
  );
}
