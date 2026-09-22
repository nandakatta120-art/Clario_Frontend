import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Users, 
  GraduationCap, 
  FileCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';

export const DashboardPage = () => {
  const { user, memberships, activeOrgId } = useAuthStore();
  const activeOrg = memberships.find((m) => m.organization_id === activeOrgId) || memberships[0];
  const rawRole = (activeOrg?.role || 'USER').toUpperCase();
  const isAdmin = rawRole === 'ADMIN' || rawRole === 'OWNER';
  const isManager = rawRole === 'MANAGER' || rawRole === 'ISSUER';
  const isLearner = !isAdmin && !isManager;

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isManager) {
    return <ManagerDashboard department={activeOrg?.department} />;
  }

  return <LearnerDashboard userName={user?.full_name} />;
};

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-[#0F172A]">Platform Overview</h1>
      <p className="text-sm text-[#64748B] mt-1">Monitor organization-wide learning and verification metrics.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard title="Total Learners" value="1,248" icon={GraduationCap} trend={{ value: 12, isPositive: true }} />
      <KPICard title="Active Managers" value="45" icon={Users} trend={{ value: 4, isPositive: true }} />
      <KPICard title="Pending Verifications" value="89" icon={Clock} />
      <KPICard title="Credentials Issued" value="4,821" icon={Award} trend={{ value: 28, isPositive: true }} />
    </div>

    {/* Placeholder for Activity Table */}
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-6">
      <h2 className="text-lg font-bold text-[#0F172A] mb-4">Recent Verification Activity (Org-Wide)</h2>
      <div className="text-center py-12 text-[#64748B]">
        <FileCheck className="w-8 h-8 mx-auto mb-3 text-[#E2E8F0]" />
        <p>Activity timeline will appear here.</p>
      </div>
    </div>
  </div>
);

const ManagerDashboard = ({ department }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-[#0F172A]">{department ? `${department} Overview` : 'Department Overview'}</h1>
      <p className="text-sm text-[#64748B] mt-1">Review learning progress and pending verifications for your team.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard title="Team Members" value="24" icon={Users} />
      <KPICard title="Action Required" value="12" icon={Clock} />
      <KPICard title="Verified Completions" value="156" icon={CheckCircle2} trend={{ value: 8, isPositive: true }} />
    </div>

    {/* Placeholder for Verification Queue */}
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-6">
      <h2 className="text-lg font-bold text-[#0F172A] mb-4">Pending Verifications Queue</h2>
      <div className="text-center py-12 text-[#64748B]">
        <Clock className="w-8 h-8 mx-auto mb-3 text-[#E2E8F0]" />
        <p>Learner submissions waiting for your approval will appear here.</p>
      </div>
    </div>
  </div>
);

const LearnerDashboard = ({ userName }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-[#0F172A]">Welcome back, {userName?.split(' ')[0] || 'Learner'}</h1>
      <p className="text-sm text-[#64748B] mt-1">Track your learning progress and manage your credentials.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard title="Completed Courses" value="14" icon={CheckCircle2} />
      <KPICard title="Pending Verification" value="2" icon={Clock} />
      <KPICard title="Earned Credentials" value="5" icon={Award} />
    </div>

    {/* Placeholder for My Learning */}
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-6">
      <h2 className="text-lg font-bold text-[#0F172A] mb-4">Recent Submissions</h2>
      <div className="text-center py-12 text-[#64748B]">
        <GraduationCap className="w-8 h-8 mx-auto mb-3 text-[#E2E8F0]" />
        <p>Your learning history will appear here.</p>
      </div>
    </div>
  </div>
);
