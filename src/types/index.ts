export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'rep';
  phone: string;
  department: string;
  account: number;
}

export interface Account {
  id: number;
  name: string;
  industry: string;
  website: string;
  phone: string;
  created_at: string;
}

export interface Lead {
  id: number;
  account: number;
  assigned_to: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  source: string;
  notes: string;  // PRODUCTION: 'notes' NOT 'notes_text'
  created_by: number;
  created_at: string;
  updated_at: string;
  assigned_to_name?: string;
}

export interface Contact {
  id: number;
  account: number;
  lead: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: number;
  account: number;
  name: string;
  contact: number;
  assigned_to: number | null;
  amount: string;
  stage: 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expected_close_date: string | null;
  probability: number;
  notes: string;  // PRODUCTION: 'notes' NOT 'notes_text'
  created_by: number;
  created_at: string;
  updated_at: string;
  contact_name?: string;
  assigned_to_name?: string;
}

export interface DashboardData {
  lead_analytics: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
  };
  deal_analytics: {
    total_amount: string | null;
    won_amount: string | null;
    open_deals: number;
  };
  recent_leads: Lead[];
  recent_deals: Deal[];
}

// NEW TYPES - FOR FUTURE ACTIVITIES & NOTES
export interface Activity {
  id: number;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'other';
  title: string;
  description: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  lead: number | null;
  contact: number | null;
  deal: number | null;
  created_by: number;
  created_by_name: string;
  related_object: {
    type: 'lead' | 'contact' | 'deal';
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  content: string;
  lead: number | null;
  contact: number | null;
  deal: number | null;
  created_by: number;
  created_by_name: string;
  related_object: {
    type: 'lead' | 'contact' | 'deal';
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}