import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-xs">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Search */}
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search records, contacts, deals..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50
                       hover:bg-white hover:border-gray-400
                       focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-500
                       transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right section - User info & notifications */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-150 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger-500 rounded-full border border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-primary-100">
              <span className="text-sm font-semibold text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};