import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Briefcase, GraduationCap, FileCheck, BarChart3, Settings, FileText } from 'lucide-react';

export const PlaceholderPage = ({ title, description, icon }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
      <p className="text-sm text-[#64748B] mt-1">{description}</p>
    </div>
    <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-subtle p-12">
      <EmptyState
        title={`${title} Coming Soon`}
        description="This module is currently under development and will be available in a future update."
        icon={icon}
      />
    </div>
  </div>
);

// Admin Pages
export const AdminManagersPage = () => <PlaceholderPage title="Managers" description="Manage organization issuers and managers." icon={Briefcase} />;
export const AdminLearnersPage = () => <PlaceholderPage title="Learners" description="Overview of all learners across the organization." icon={GraduationCap} />;
export const AdminVerificationPage = () => <PlaceholderPage title="Verification Activity" description="Global verification and audit logs." icon={FileCheck} />;
export const AdminReportsPage = () => <PlaceholderPage title="Reports & Analytics" description="Organization-wide credential and learning reports." icon={BarChart3} />;
export const AdminSettingsPage = () => <PlaceholderPage title="Organization Settings" description="Manage branding, integrations, and preferences." icon={Settings} />;

// Manager Pages
export const ManagerActivityPage = () => <PlaceholderPage title="Learning Activity" description="Activity timeline for your department learners." icon={FileText} />;
export const ManagerReportsPage = () => <PlaceholderPage title="Department Reports" description="Analytics and completion rates for your team." icon={BarChart3} />;
