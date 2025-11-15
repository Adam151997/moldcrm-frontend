import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GlobalSearch } from '../GlobalSearch';
import { NotificationDropdown } from '../NotificationDropdown';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-xs">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Search */}
        <div className="flex items-center flex-1 max-w-xl">
          <GlobalSearch className="w-full" />
        </div>

        {/* Right section - User info & notifications */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />

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