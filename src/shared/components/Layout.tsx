import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 p-6 w-full min-h-screen bg-white">
        <Outlet />
      </main>
    </div>
  );
}
