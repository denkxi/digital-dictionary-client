import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function Layout() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex">
      {user && <Sidebar />}
      <main
        className={`w-full min-h-screen bg-white p-6 ${
          user ? 'pt-20 md:pt-6 md:ml-60' : 'pt-12'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
