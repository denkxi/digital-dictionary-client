import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full min-h-screen bg-white p-6 md:ml-60">
        <Outlet />
      </main>
    </div>
  );
}
