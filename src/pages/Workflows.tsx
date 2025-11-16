import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowsAPI } from '../services/api';
import { Workflow } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

export const Workflows: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: 'lead_created',
    trigger_config: {},
    actions: [],
    status: 'draft',
  });
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => workflowsAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => workflowsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => workflowsAPI.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => workflowsAPI.pause(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => workflowsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        trigger_type: 'lead_created',
        trigger_config: {},
        actions: [],
        status: 'draft',
      });
    },
  });

  const handleDelete = (workflow: Workflow) => {
    if (window.confirm(`Delete workflow "${workflow.name}"?`)) {
      deleteMutation.mutate(workflow.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-700',
  };

  const triggerTypeLabels: Record<string, string> = {
    deal_created: 'Deal Created',
    deal_updated: 'Deal Updated',
    stage_changed: 'Stage Changed',
    field_updated: 'Field Updated',
    lead_created: 'Lead Created',
    contact_created: 'Contact Created',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-theme-bg-secondary rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-theme-bg-primary rounded-xl border border-theme-border-primary p-6 animate-pulse">
              <div className="h-20 w-full bg-theme-bg-secondary rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-semibold text-theme-text-primary">Automation Workflows</h1>
          </div>
          <p className="text-theme-text-secondary">
            Automate repetitive tasks with triggers and actions
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon={Plus}
          size="lg"
        >
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-theme-text-secondary mb-1">Total Workflows</p>
                <p className="text-2xl font-bold text-theme-text-primary">{workflows?.length || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-theme-text-tertiary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows?.filter((w: Workflow) => w.status === 'active').length || 0}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-theme-text-secondary mb-1">Paused</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {workflows?.filter((w: Workflow) => w.status === 'paused').length || 0}
                </p>
              </div>
              <Pause className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-theme-text-secondary mb-1">Total Executions</p>
                <p className="text-2xl font-bold text-theme-text-primary">
                  {workflows?.reduce((sum: number, w: Workflow) => sum + w.execution_count, 0) || 0}
                </p>
              </div>
              <Zap className="h-8 w-8 text-theme-text-tertiary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows?.map((workflow: Workflow) => (
          <Card key={workflow.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-theme-text-primary">
                      {workflow.name}
                    </h3>
                    <span className={`badge ${statusColors[workflow.status]} text-xs`}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                  </div>

                  {workflow.description && (
                    <p className="text-sm text-theme-text-secondary mb-3">{workflow.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-theme-text-secondary">Trigger:</span>
                      <span className="font-medium">
                        {triggerTypeLabels[workflow.trigger_type] || workflow.trigger_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-theme-text-secondary">Actions:</span>
                      <span className="font-medium">{workflow.actions.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-theme-text-secondary">Executions:</span>
                      <span className="font-medium">{workflow.execution_count}</span>
                    </div>
                    {workflow.last_executed_at && (
                      <div className="flex items-center gap-2">
                        <span className="text-theme-text-secondary">Last Run:</span>
                        <span className="font-medium">
                          {new Date(workflow.last_executed_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {workflow.status === 'active' ? (
                    <button
                      onClick={() => pauseMutation.mutate(workflow.id)}
                      className="table-action-btn hover:text-yellow-600 hover:bg-yellow-50"
                      title="Pause workflow"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => activateMutation.mutate(workflow.id)}
                      className="table-action-btn hover:text-green-600 hover:bg-green-50"
                      title="Activate workflow"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="table-action-btn"
                    title="View details"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(workflow)}
                    className="table-action-btn hover:text-danger-600 hover:bg-danger-50"
                    title="Delete workflow"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!workflows || workflows.length === 0) && (
          <div className="empty-state py-16">
            <div className="p-4 bg-theme-bg-tertiary rounded-full inline-block mb-4">
              <Zap className="h-10 w-10 text-theme-text-tertiary" />
            </div>
            <h3 className="text-base font-medium text-theme-text-primary mb-1">No workflows yet</h3>
            <p className="text-sm text-theme-text-tertiary">
              Create your first automation workflow to save time
            </p>
          </div>
        )}
      </div>

      {/* Workflow Details Modal (simplified - full builder coming soon) */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-theme-bg-primary rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{selectedWorkflow.name}</h2>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-theme-text-tertiary hover:text-theme-text-secondary"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-theme-text-secondary">{selectedWorkflow.description || 'No description'}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Trigger</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">
                    {triggerTypeLabels[selectedWorkflow.trigger_type] || selectedWorkflow.trigger_type}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Actions ({selectedWorkflow.actions.length})</h3>
                <div className="space-y-2">
                  {selectedWorkflow.actions.map((action: any, index: number) => (
                    <div key={index} className="p-4 bg-theme-bg-tertiary rounded-lg">
                      <p className="font-medium">{action.type || 'Action ' + (index + 1)}</p>
                      {action.description && (
                        <p className="text-sm text-theme-text-secondary mt-1">{action.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedWorkflow(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Workflow Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-theme-bg-primary rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-theme-border-primary sticky top-0 bg-theme-bg-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Create New Workflow</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-theme-text-tertiary hover:text-theme-text-secondary"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-theme-text-primary mb-2">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Welcome New Leads"
                />
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-theme-text-primary mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Describe what this workflow does..."
                />
              </div>

              {/* Trigger Type Field */}
              <div>
                <label htmlFor="trigger_type" className="block text-sm font-medium text-theme-text-primary mb-2">
                  Trigger *
                </label>
                <select
                  id="trigger_type"
                  required
                  value={formData.trigger_type}
                  onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                  className="input-field"
                >
                  <option value="lead_created">Lead Created</option>
                  <option value="contact_created">Contact Created</option>
                  <option value="deal_created">Deal Created</option>
                  <option value="deal_updated">Deal Updated</option>
                  <option value="stage_changed">Stage Changed</option>
                  <option value="field_updated">Field Updated</option>
                </select>
                <p className="text-xs text-theme-text-secondary mt-1">
                  When should this workflow be triggered?
                </p>
              </div>

              {/* Status Field */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-theme-text-primary mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="draft">Draft (inactive)</option>
                  <option value="active">Active (running)</option>
                  <option value="paused">Paused</option>
                </select>
                <p className="text-xs text-theme-text-secondary mt-1">
                  Draft workflows won't run until activated
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Actions Configuration
                    </p>
                    <p className="text-xs text-blue-700">
                      After creating this workflow, you can configure specific actions (send email, update fields, create tasks, etc.)
                      by editing the workflow. For now, we'll create it with no actions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {createMutation.isError && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <p className="text-sm text-danger-700">
                    Error: {(createMutation.error as any)?.response?.data?.error ||
                           (createMutation.error as any)?.message ||
                           'Failed to create workflow'}
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !formData.name.trim()}
                  icon={createMutation.isPending ? Loader2 : Plus}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Workflow'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
