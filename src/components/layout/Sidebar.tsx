import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Contact,
  TrendingUp,
  Menu,
  X,
  Settings,
  Sliders,
  Layout as LayoutIcon,
  Sparkles,
  Brain,
  Zap,
  Mail,
  Plug,
  Filter,
  Repeat,
  BarChart3,
  FileText,
  Palette,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);
  const [isAutomationCollapsed, setIsAutomationCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Contacts', href: '/contacts', icon: Contact },
    { name: 'Deals', href: '/deals', icon: TrendingUp },
  ];

  const automationNavigation = [
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'Workflows', href: '/workflows', icon: Zap },
    { name: 'Email Campaigns', href: '/email-campaigns', icon: Mail },
    { name: 'Email Templates', href: '/email-templates', icon: FileText },
    { name: 'Drip Campaigns', href: '/drip-campaigns', icon: Repeat },
    { name: 'Segments', href: '/segments', icon: Filter },
    { name: 'Email Analytics', href: '/email-analytics', icon: BarChart3 },
  ];

  const settingsNavigation = [
    { name: 'Theme', href: '/settings/theme', icon: Palette },
    { name: 'Templates', href: '/settings/templates', icon: Sparkles },
    { name: 'Pipeline Stages', href: '/settings/pipeline', icon: Sliders },
    { name: 'Custom Fields', href: '/settings/custom-fields', icon: LayoutIcon },
    { name: 'Email Providers', href: '/email-providers', icon: Mail },
    { name: 'Plugins', href: '/plugins', icon: Plug },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-theme-bg-primary rounded-lg shadow-md border border-theme-border-primary hover:bg-theme-bg-tertiary transition-all duration-150"
        >
          {isMobileOpen ? <X className="h-5 w-5 text-theme-text-primary" /> : <Menu className="h-5 w-5 text-theme-text-primary" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-theme-bg-primary border-r border-theme-border-primary shadow-sm transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-theme-border-primary">
          <h1 className="text-sm text-theme-text-primary" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Mold CRM
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    active
                      ? 'bg-primary-50 text-primary-700 shadow-xs'
                      : 'text-theme-text-primary hover:bg-theme-bg-tertiary'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-theme-text-tertiary'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Automation Section */}
          <div className="space-y-1">
            <button
              onClick={() => setIsAutomationCollapsed(!isAutomationCollapsed)}
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-theme-bg-tertiary rounded-lg transition-colors duration-150 group"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-theme-text-tertiary group-hover:text-theme-text-secondary transition-colors" />
                <span className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wide group-hover:text-theme-text-primary transition-colors">
                  Automation
                </span>
              </div>
              <svg
                className={`h-4 w-4 text-theme-text-tertiary transition-transform duration-200 ${
                  isAutomationCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isAutomationCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
              }`}
            >
              <div className="space-y-1">
                {automationNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                        active
                          ? 'bg-primary-50 text-primary-700 shadow-xs'
                          : 'text-theme-text-primary hover:bg-theme-bg-tertiary'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-theme-text-tertiary'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-1">
            <button
              onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-theme-bg-tertiary rounded-lg transition-colors duration-150 group"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-theme-text-tertiary group-hover:text-theme-text-secondary transition-colors" />
                <span className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wide group-hover:text-theme-text-primary transition-colors">
                  Settings
                </span>
              </div>
              <svg
                className={`h-4 w-4 text-theme-text-tertiary transition-transform duration-200 ${
                  isSettingsCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isSettingsCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
              }`}
            >
              <div className="space-y-1">
                {settingsNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                        active
                          ? 'bg-primary-50 text-primary-700 shadow-xs'
                          : 'text-theme-text-primary hover:bg-theme-bg-tertiary'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-theme-text-tertiary'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-theme-border-primary bg-theme-bg-tertiary">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-primary-100">
              <span className="text-sm font-semibold text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-theme-text-primary truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-theme-text-secondary capitalize truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};