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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">Manage your sales leads and conversions</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" icon={Filter}>
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads?.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {lead.first_name[0]}{lead.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-600">{lead.company || '-'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-600">{lead.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => setEditingLead(lead)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(lead)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!filteredLeads || filteredLeads.length === 0) && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No leads found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-2">Try changing your search terms</p>
                )}
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