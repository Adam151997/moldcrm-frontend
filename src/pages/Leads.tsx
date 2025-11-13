import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsAPI } from '../services/api';
import { Lead } from '../types';
import { LeadForm } from '../components/forms/LeadForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { Plus, Search, Filter, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';

export const Leads: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const queryClient = useQueryClient();
  
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => leadsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const handleDelete = (lead: Lead) => {
    if (window.confirm(`Delete lead ${lead.first_name} ${lead.last_name}?`)) {
      deleteMutation.mutate(lead.id);
    }
  };

  const filteredLeads = leads?.filter(lead =>
    lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for the leads page
  const leadStats = {
    total: leads?.length || 0,
    new: leads?.filter(lead => lead.status === 'new').length || 0,
    contacted: leads?.filter(lead => lead.status === 'contacted').length || 0,
    qualified: leads?.filter(lead => lead.status === 'qualified').length || 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-5 w-80 bg-gray-200 rounded-lg animate-pulse mt-3"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Leads</h1>
          <p className="text-gray-600">Manage your sales leads and conversions</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Leads"
          value={leadStats.total}
          icon={Users}
          description="All leads"
        />
        <StatCard
          title="New Leads"
          value={leadStats.new}
          icon={TrendingUp}
          description="Not contacted"
        />
        <StatCard
          title="Contacted"
          value={leadStats.contacted}
          icon={Users}
          description="In discussion"
        />
        <StatCard
          title="Qualified"
          value={leadStats.qualified}
          icon={TrendingUp}
          description="Ready for deal"
        />
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <Button variant="outline" icon={Filter}>
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Leads ({filteredLeads?.length || 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-left py-3 px-6">Name</th>
                  <th className="text-left py-3 px-6">Company</th>
                  <th className="text-left py-3 px-6">Email</th>
                  <th className="text-left py-3 px-6">Status</th>
                  <th className="text-right py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads?.map((lead) => (
                  <tr key={lead.id}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center ring-1 ring-primary-100 flex-shrink-0">
                          <span className="text-primary-700 font-semibold text-sm">
                            {lead.first_name[0]}{lead.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{lead.first_name} {lead.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">{lead.company || '-'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">{lead.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${
                        lead.status === 'new' ? 'badge-primary' :
                        lead.status === 'qualified' ? 'badge-success' :
                        lead.status === 'contacted' ? 'badge-warning' :
                        'badge-gray'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="table-action-btn"
                          title="Edit lead"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                          title="Delete lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!filteredLeads || filteredLeads.length === 0) && (
              <div className="empty-state py-16">
                <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No leads found</h3>
                <p className="text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first lead'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lead Form Modal */}
      {(showForm || editingLead) && (
        <LeadForm
          lead={editingLead}
          onClose={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingLead(null);
            queryClient.invalidateQueries({ queryKey: ['leads'] });
          }}
        />
      )}
    </div>
  );
};