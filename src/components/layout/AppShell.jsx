import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Award,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  LogOut,
  GraduationCap,
  FileCheck,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Send,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import clsx from 'clsx';

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, memberships, activeOrgId, logout } = useAuthStore();
  
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Desktop collapsed sidebar state with persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('clario_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDesktopSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('clario_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const activeOrg = memberships.find((m) => m.organization_id === activeOrgId) || memberships[0];
  const rawRole = (activeOrg?.role || 'USER').toUpperCase();
  const isAdmin = rawRole === 'ADMIN' || rawRole === 'OWNER';
  const isLearner = !isAdmin;

  const displayRole = isAdmin ? 'ADMIN' : 'LEARNER';

  let navItems = [];

  if (isAdmin) {
    navItems = [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Programs', path: '/admin/programs', icon: ShieldCheck },
    ];
  } else {
    navItems = [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] antialiased overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#0F172A]/30 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out',
          // Mobile open / close
          isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0',
          // Desktop width (collapsed vs expanded)
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div className={clsx(
            "h-16 border-b border-[#E2E8F0] flex items-center shrink-0 transition-all duration-300",
            isCollapsed ? "justify-center px-2" : "justify-between px-4 sm:px-5"
          )}>
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#33409E] flex items-center justify-center text-white shadow-xs shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="font-display font-bold text-lg text-[#0F172A] tracking-tight truncate">Clario</h1>
                </div>
              )}
            </div>

            {/* Close button on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Org & Role Switcher */}
          <div className={clsx("transition-all duration-300", isCollapsed ? "p-2" : "p-3 sm:p-4")}>
            <div className={clsx(
              "bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center shadow-subtle transition-all duration-300",
              isCollapsed ? "justify-center p-2.5" : "justify-between p-3"
            )}>
              <div 
                className="flex items-center space-x-2.5 overflow-hidden" 
                title={activeOrg ? `${activeOrg.organization_name} (${displayRole})` : 'Default Organization'}
              >
                <Building2 className="w-4 h-4 text-[#33409E] shrink-0" />
                {!isCollapsed && (
                  <span className="text-xs font-semibold text-[#0F172A] truncate">
                    {activeOrg ? activeOrg.organization_name : 'Default Organization'}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span
                  className={clsx(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0',
                    displayRole === 'ADMIN' && 'bg-[#33409E]/10 text-[#33409E] border-[#33409E]/20',
                    displayRole === 'LEARNER' && 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                  )}
                >
                  {displayRole}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className={clsx("space-y-1 flex-1 transition-all duration-300", isCollapsed ? "px-2" : "px-3")}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={clsx(
                    'flex items-center rounded-xl text-xs font-semibold transition-all duration-150',
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2.5',
                    isActive
                      ? 'bg-[#33409E] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  )}
                >
                  <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-[#64748B]')} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className={clsx("border-t border-[#E2E8F0] bg-white transition-all duration-300", isCollapsed ? "p-2" : "p-3 sm:p-4")}>
          <div className={clsx("flex items-center", isCollapsed ? "flex-col space-y-2 justify-center" : "justify-between")}>
            <div className={clsx("flex items-center overflow-hidden", isCollapsed ? "justify-center" : "space-x-3")}>
              <div 
                className="w-8 h-8 rounded-full bg-[#33409E]/10 flex items-center justify-center text-xs font-bold text-[#33409E] uppercase shrink-0 border border-[#33409E]/20"
                title={user?.full_name || 'User Profile'}
              >
                {user?.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#0F172A] truncate">{user?.full_name || 'User'}</p>
                  <p className="text-[10px] text-[#64748B] truncate font-mono">{user?.email}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-1.5 text-[#64748B] hover:text-[#FB7185] hover:bg-[#FB7185]/10 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 shadow-subtle">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Toggle Button (Expand/Collapse) */}
            <button
              onClick={toggleDesktopSidebar}
              className="hidden lg:flex items-center justify-center p-2 text-[#64748B] hover:text-[#33409E] hover:bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-xs transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Sidebar (Open)" : "Collapse Sidebar (Close)"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Global Search Bar */}
            <div className="hidden sm:flex items-center text-[#64748B] bg-[#F8FAFC] px-3 py-1.5 rounded-full border border-[#E2E8F0]">
              <Search className="w-4 h-4 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-xs w-48 text-[#0F172A] placeholder:text-[#64748B]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-4">
            <button className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FB7185] border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-[#E2E8F0] hidden sm:block" />
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-[#0F172A]">{user?.full_name}</p>
                <p className="text-[10px] text-[#64748B] uppercase tracking-wider">{displayRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
