import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MonitorCheck,
  ChefHat,
  FolderTree,
  Package,
  Boxes,
  Receipt,
  Gift,
  Percent,
  ShoppingBag,
  Bike,
  UserCheck,
  BarChart3,
  Award,
  Tag,
  Users,
  Settings,
  Printer,
  FileCheck2,
  CreditCard,
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutAdmin = useBuzzStore((state) => state.logoutAdmin);

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'POS System', path: '/admin/pos', icon: MonitorCheck },
    { label: 'Kitchen Display', path: '/admin/kds', icon: ChefHat },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Expenses', path: '/admin/expenses', icon: Receipt },
    { label: 'Deals', path: '/admin/deals', icon: Gift },
    { label: 'Discounted Items', path: '/admin/discounts', icon: Percent },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Riders', path: '/admin/riders', icon: Bike },
    { label: 'Waiters', path: '/admin/waiters', icon: UserCheck },
    { label: 'Sales Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Loyalty & Rewards', path: '/admin/loyalty', icon: Award },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Staff', path: '/admin/staff', icon: Users },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Printer Settings', path: '/admin/printer', icon: Printer },
    { label: 'FBR Integration', path: '/admin/fbr', icon: FileCheck2 },
    { label: 'PayFast Payments', path: '/admin/payfast', icon: CreditCard }
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 text-zinc-300 w-64 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <NavLink to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-buzz-yellow flex items-center justify-center font-black font-display text-buzz-black text-xs font-extrabold shadow-buzz-glow">
            BUZZ
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold font-display text-xs sm:text-sm tracking-tight text-white leading-none">
              BUZZ BURGER <span className="text-buzz-yellow">POS</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-buzz-yellow font-semibold mt-0.5">
              Management Suite
            </span>
          </div>
        </NavLink>

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          const IconComp = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-buzz-yellow text-buzz-black font-extrabold shadow-buzz-glow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-buzz-black' : 'text-buzz-yellow'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer System Actions */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <NavLink
          to="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-buzz-yellow/40 transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-buzz-yellow" /> View Customer Site
          </span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-30">{sidebarContent}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
