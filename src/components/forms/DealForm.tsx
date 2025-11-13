import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { dealsAPI, customFieldsAPI, pipelineStagesAPI } from '../../services/api';
import { Deal, Contact, CustomField, PipelineStage } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface DealFormProps {
  deal?: Deal | null;
  contacts: Contact[];
  onClose: () => void;
  onSuccess: () => void;
}

export const DealForm: React.FC<DealFormProps> = ({
  deal,
  contacts,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    amount: '',
    pipeline_stage: '',
    expected_close_date: '',
    probability: 50,
    notes: '',
  });
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, any>>({});

  const queryClient = useQueryClient();

  // Fetch custom fields
  const { data: customFields } = useQuery({
    queryKey: ['custom-fields', 'deals'],
    queryFn: () => customFieldsAPI.getAll(),
  });

  // Fetch pipeline stages
  const { data: pipelineStages } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: () => pipelineStagesAPI.getAll(),
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name,
        contact: deal.contact.toString(),
        amount: deal.amount || '',
        pipeline_stage: deal.pipeline_stage?.toString() || '',
        expected_close_date: deal.expected_close_date || '',
        probability: deal.probability,
        notes: deal.notes || '',
      });
      // Load custom fields data
      if (deal.custom_data) {
        setCustomFieldsData(deal.custom_data);
      }
    }
  }, [deal]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      deal
        ? dealsAPI.update(deal.id, data)
        : dealsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals', 'analytics'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      contact: parseInt(formData.contact),
      amount: formData.amount ? parseFloat(formData.amount) : null,
      pipeline_stage: formData.pipeline_stage ? parseInt(formData.pipeline_stage) : null,
      probability: parseInt(formData.probability.toString()),
      custom_data: customFieldsData,
    };

    mutation.mutate(submitData);
  };

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setCustomFieldsData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const renderCustomField = (field: CustomField) => {
    const value = customFieldsData[field.name] || field.default_value || '';

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.field_type}
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="input-field"
            placeholder={`Enter ${field.display_name.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            rows={3}
            className="textarea-field"
            placeholder={`Enter ${field.display_name.toLowerCase()}`}
          />
        );

      case 'number':
      case 'currency':
        return (
          <input
            type="number"
            step={field.field_type === 'currency' ? '0.01' : '1'}
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="input-field"
            placeholder={`Enter ${field.display_name.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="input-field"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-600">Yes</label>
          </div>
        );

      case 'select':
        return (
          <select
            required={field.required}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="select-field"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Use dynamic stages
  const stageOptions = pipelineStages && pipelineStages.length > 0
    ? pipelineStages.map(stage => ({
        value: stage.id.toString(),
        label: stage.display_name,
      }))
    : [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900">
            {deal ? 'Edit Deal' : 'Add New Deal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="name" className="form-label">
              Deal Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter deal name"
            />
          </div>

          <div>
            <label htmlFor="contact" className="form-label">
              Contact *
            </label>
            <select
              id="contact"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="select-field"
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.first_name} {contact.last_name} {contact.company ? `- ${contact.company}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="pipeline_stage" className="form-label">
                Stage *
              </label>
              <select
                id="pipeline_stage"
                name="pipeline_stage"
                required
                value={formData.pipeline_stage}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select a stage</option>
                {stageOptions.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expected_close_date" className="form-label">
                Expected Close Date
              </label>
              <input
                id="expected_close_date"
                name="expected_close_date"
                type="date"
                value={formData.expected_close_date}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="probability" className="form-label">
                Win Probability (%)
              </label>
              <input
                id="probability"
                name="probability"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.probability}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>0%</span>
                <span className="font-medium text-gray-900">{formData.probability}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="textarea-field"
              placeholder="Add any notes about this deal..."
            />
          </div>

          {/* Custom Fields Section */}
          {customFields && customFields.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="section-header">Custom Fields</h3>
              <div className="space-y-5">
                {customFields.map((field) => (
                  <div key={field.id}>
                    <label className="form-label">
                      {field.display_name} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderCustomField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={mutation.isPending}
            >
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};