import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useLogout } from "../hooks/useLogout";
import {
  FiHome,
  FiBookOpen,
  FiFolder,
  FiEdit3,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/", icon: FiHome },
  { name: "Dictionaries", path: "/dictionaries", icon: FiBookOpen },
  { name: "Categories", path: "/word-categories", icon: FiFolder },
  { name: "Quizzes", path: "/quizzes", icon: FiEdit3 },
  { name: "Profile", path: "/profile", icon: FiUser },
];

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const logout = useLogout();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-primary-1 flex items-center justify-between px-4 shadow z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-text text-xl"
        >
          <FiMenu />
        </button>
        <div className="text-title font-semibold text-base select-none">Dictionary App</div>
        <div className="w-6" /> {/* spacer to balance icon */}
      </div>

      {/* Fullscreen mobile sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center md:hidden">
          <div className="bg-primary-1 text-text w-5/6 max-w-xs rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-xl text-text"
            >
              <FiX />
            </button>

            <div className="text-xl font-bold text-title mb-6">
              Dictionary App
            </div>
            <nav className="flex flex-col gap-2">
              {menuItems.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary-2 transition-all ${
                      isActive ? "bg-primary-2 font-semibold" : ""
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  {name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-accent-2 rounded hover:bg-green-200 text-sm font-medium"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60 bg-primary-1 text-text shadow-lg z-10">
        <div className="p-6 text-xl font-bold text-title">Dictionary App</div>
        <nav className="flex flex-col gap-2 px-4">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-primary-2 transition-all ${
                  isActive ? "bg-primary-2 font-semibold" : ""
                }`
              }
            >
              <Icon className="text-lg" />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4 pb-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-accent-2 rounded hover:bg-green-200 text-sm font-medium"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
