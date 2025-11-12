import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getData(),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <p className="text-sm text-gray-500 mt-2">
            {error instanceof Error ? error.message : 'Please check your connection'}
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '$0';
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={dashboardData?.lead_analytics?.total || 0}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          description="All time leads"
        />
        
        <StatCard
          title="New Leads"
          value={dashboardData?.lead_analytics?.new || 0}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          description="This month"
        />
        
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(dashboardData?.deal_analytics?.total_amount)}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          description="Total open deals"
        />
        
        <StatCard
          title="Open Deals"
          value={dashboardData?.deal_analytics?.open_deals || 0}
          icon={BarChart3}
          trend={{ value: 5, isPositive: true }}
          description="In progress"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recent_leads && dashboardData.recent_leads.length > 0 ? (
                dashboardData.recent_leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                        <p className="text-sm text-gray-500">{lead.company || 'No company'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent leads</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Recent Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recent_deals && dashboardData.recent_deals.length > 0 ? (
                dashboardData.recent_deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{deal.name}</p>
                      <p className="text-sm text-gray-500">{deal.contact_name || 'No contact'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(deal.amount)}</p>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        deal.stage === 'closed_won' ? 'bg-green-100 text-green-800' :
                        deal.stage === 'closed_lost' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {deal.stage}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent deals</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};