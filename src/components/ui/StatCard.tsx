import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>

          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                trend.isPositive
                  ? 'bg-success-50 text-success-700 border border-success-200'
                  : 'bg-danger-50 text-danger-700 border border-danger-200'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}

          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>

        <div className="flex-shrink-0 p-3 bg-primary-50 rounded-lg border border-primary-100">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </div>
  );
};