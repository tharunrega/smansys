'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  Clock,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Grid3X3,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['admin', 'manager', 'user'] },
  { name: 'Teachers', icon: GraduationCap, href: '/teachers', roles: ['admin', 'manager'] },
  { name: 'Students', icon: Users, href: '/students', roles: ['admin', 'manager'] },
  { 
    name: 'Finance', 
    icon: DollarSign, 
    href: '/finance', 
    roles: ['admin', 'manager'],
    hasSubmenu: true,
    submenu: [
      { name: 'Fees Management', href: '/finance/fees' },
      { name: 'School Expenses', href: '/finance/expenses' },
    ]
  },
  { name: 'Calendar', icon: Calendar, href: '/calendar', roles: ['admin', 'manager', 'user'] },
  { name: 'Time Table', icon: Clock, href: '/timetable', roles: ['admin', 'manager', 'user'] },
  { name: 'Message', icon: MessageSquare, href: '/messages', roles: ['admin', 'manager', 'user'] },
  { name: 'Settings', icon: Settings, href: '/settings', roles: ['admin', 'manager', 'user'] },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push('/login');
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed inset-y-0 left-0 z-50 w-70 bg-smansys-primary lg:relative lg:translate-x-0 lg:shadow-strong`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-white">Smansys</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigationItems.map((item) => {
              if (!item.roles.includes(user.role)) return null;
              
              const Icon = item.icon;
              const isActiveItem = isActive(item.href);
              
              if (item.hasSubmenu) {
                const isExpanded = expandedMenus.includes(item.name);
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full sidebar-item ${isActiveItem ? 'active' : ''}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-8 mt-2 space-y-1 overflow-hidden"
                        >
                          {item.submenu?.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className={`block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors ${
                                pathname === subItem.href ? 'text-white bg-white/10' : ''
                              }`}
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`sidebar-item ${isActiveItem ? 'active' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="sidebar-item w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent w-64"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.firstName} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    user.firstName.charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.firstName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
} 