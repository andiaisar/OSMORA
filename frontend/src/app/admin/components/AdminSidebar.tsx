'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Folder, 
  Camera, 
  Gift, 
  LogOut,
  X
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  isAction?: boolean;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { name: "Projects", icon: Folder, path: "/admin/booths" },
    { name: "Frames", icon: Camera, path: "/admin/frames" },
    { name: "Voucher", icon: Gift, path: "/admin/voucher" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActiveLink = (itemPath: string): boolean => {
    // Special case for Dashboard - only active if exact match
    if (itemPath === '/admin') {
      return pathname === '/admin';
    }
    
    // For other paths, active if pathname starts with the item path
    return pathname.startsWith(itemPath);
  };

  const getLinkClasses = (itemPath: string): string => {
    const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group";
    
    if (isActiveLink(itemPath)) {
      return `${baseClasses} bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]`;
    }
    
    return `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md`;
  };

  const getIconClasses = (itemPath: string): string => {
    const baseClasses = "h-5 w-5 mr-3 transition-colors duration-200";
    
    if (isActiveLink(itemPath)) {
      return `${baseClasses} text-white`;
    }
    
    return `${baseClasses} text-gray-400 group-hover:text-gray-600`;
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <img
              src="/image/logohor.png"
              alt="OSMORA"
              className="h-14 w-auto"
            />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={getLinkClasses(item.path)}
                onClick={() => onClose()}
              >
                <Icon className={getIconClasses(item.path)} />
                <span className="font-medium">{item.name}</span>
                {isActiveLink(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-6 border-t border-gray-200 bg-gray-50">
          {/* User Info */}
          <div className="mb-4 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 mr-3 group-hover:transform group-hover:scale-110 transition-transform duration-200" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}