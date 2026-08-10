import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { useBuzzStore } from '../../store/useBuzzStore';

export const AdminLayout: React.FC = () => {
  const isAdminAuthenticated = useBuzzStore((state) => state.isAdminAuthenticated);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected route check
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex font-sans antialiased">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminHeader onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 p-4 md:p-8 bg-zinc-950 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
