import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GlobalSearch } from '../GlobalSearch';
import { NotificationDropdown } from '../NotificationDropdown';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-theme-bg-primary border-b border-theme-border-primary shadow-xs">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Search */}
        <div className="flex items-center flex-1 max-w-xl">
          <GlobalSearch className="w-full" />
        </div>

        {/* Right section - User info & notifications */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />

          <div className="flex items-center gap-3 pl-3 border-l border-theme-border-primary">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-theme-text-primary">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-theme-text-secondary capitalize">{user?.role}</p>
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