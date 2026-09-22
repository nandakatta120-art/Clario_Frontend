import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Award,
  Trash2,
  Loader2,
  Mail,
  User,
  Lock,
  Search,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { DataTable } from '@/components/ui/DataTable';

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('USER');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('WelcomePass123!');
  const [formError, setFormError] = useState(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['org_members'],
    queryFn: async () => (await apiClient.get('/orgs/current/members')).data,
  });

  const addMemberMutation = useMutation({
    mutationFn: async (payload) => {
      return (await apiClient.post('/orgs/current/members', payload)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org_members'] });
      setIsAddModalOpen(false);
      setEmail('');
      setFullName('');
      setRole('USER');
      setDepartment('');
      setPassword('WelcomePass123!');
      setFormError(null);
    },
    onError: (err) => {
      setFormError(err.response?.data?.error?.message || 'Failed to add member to organization.');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, newRole }) => {
      return (await apiClient.patch(`/orgs/current/members/${memberId}`, { role: newRole })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org_members'] });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to update member role.');
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({ memberId, newDept }) => {
      return (await apiClient.patch(`/orgs/current/members/${memberId}`, { department: newDept })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org_members'] });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to update member department.');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId) => {
      await apiClient.delete(`/orgs/current/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org_members'] });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to remove member.');
    },
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!email) return;
    addMemberMutation.mutate({
      email,
      full_name: fullName,
      role,
      department: department || undefined,
      password,
    });
  };

  const normalizeRole = (r) => {
    const upper = (r || '').toUpperCase();
    if (upper === 'OWNER' || upper === 'ADMIN') return 'ADMIN';
    if (upper === 'ISSUER' || upper === 'MANAGER') return 'MANAGER';
    return 'LEARNER';
  };

  const filteredMembers = members.filter((m) => {
    const norm = normalizeRole(m.role);
    const matchesRole = roleFilter === 'ALL' || norm === roleFilter;
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const stats = {
    total: members.length,
    admins: members.filter((m) => normalizeRole(m.role) === 'ADMIN').length,
    managers: members.filter((m) => normalizeRole(m.role) === 'MANAGER').length,
    learners: members.filter((m) => normalizeRole(m.role) === 'LEARNER').length,
  };

  const getRoleBadge = (rawRole) => {
    const role = normalizeRole(rawRole);
    switch (role) {
      case 'ADMIN':
        return 'bg-[#33409E]/10 text-[#33409E] border-[#33409E]/20';
      case 'MANAGER':
        return 'bg-[#7B8AE0]/10 text-[#7B8AE0] border-[#7B8AE0]/20';
      default:
        return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20';
    }
  };

  const columns = [
    {
      key: 'user',
      header: 'Person / Member',
      render: (m) => {
        const isSelf = user?.email?.toLowerCase() === m.email.toLowerCase();
        return (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#F8FAFC] flex items-center justify-center font-bold text-xs text-[#33409E] uppercase border border-[#E2E8F0] shrink-0">
              {m.full_name ? m.full_name.charAt(0) : 'U'}
            </div>
            <div>
              <p className="font-semibold text-[#0F172A] flex items-center space-x-1.5">
                <span>{m.full_name}</span>
                {isSelf && (
                  <span className="text-[10px] bg-[#33409E]/10 text-[#33409E] px-1.5 py-0.5 rounded font-mono">
                    (You)
                  </span>
                )}
              </p>
              <p className="text-xs text-[#64748B] font-mono">{m.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'role',
      header: 'Role',
      render: (m) => {
        const normRole = normalizeRole(m.role);
        const isSelf = user?.email?.toLowerCase() === m.email.toLowerCase();
        
        if (isSelf) {
          return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getRoleBadge(m.role)}`}>
              {normRole}
            </span>
          );
        }
        
        return (
          <select
            value={normRole}
            onChange={(e) => updateRoleMutation.mutate({ memberId: m.id, newRole: e.target.value })}
            className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-2.5 py-1 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E] cursor-pointer"
          >
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="LEARNER">Learner</option>
          </select>
        );
      }
    },
    {
      key: 'department',
      header: 'Department',
      render: (m) => {
        const isSelf = user?.email?.toLowerCase() === m.email.toLowerCase();
        
        return (
          <input
            type="text"
            defaultValue={m.department || ''}
            onBlur={(e) => {
              if (e.target.value !== (m.department || '')) {
                updateDepartmentMutation.mutate({ memberId: m.id, newDept: e.target.value });
              }
            }}
            placeholder="No Department"
            className="bg-transparent border-none hover:bg-[#F8FAFC] focus:bg-white focus:ring-1 focus:ring-[#33409E] rounded px-2 py-1 text-sm text-[#0F172A] w-32"
          />
        );
      }
    },
    {
      key: 'created_at',
      header: 'Joined Date',
      render: (m) => new Date(m.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (m) => {
        const isSelf = user?.email?.toLowerCase() === m.email.toLowerCase();
        if (isSelf) return null;
        
        return (
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to remove ${m.full_name} from the organization?`)) {
                removeMemberMutation.mutate(m.id);
              }
            }}
            className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors cursor-pointer"
            title="Remove Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2.5">
            <Users className="w-7 h-7 text-[#33409E]" />
            <span>Users & Access</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your organization's admins, managers, and learners.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#33409E] hover:bg-[#2C3688] text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Role Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={stats.total} icon={Users} />
        <KPICard title="Admins" value={stats.admins} icon={ShieldCheck} />
        <KPICard title="Managers" value={stats.managers} icon={Award} />
        <KPICard title="Learners" value={stats.learners} icon={User} />
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
            {['ALL', 'ADMIN', 'MANAGER', 'LEARNER'].map((tab) => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  roleFilter === tab
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tab === 'ALL' ? 'All Roles' : tab === 'MANAGER' ? 'Managers' : tab === 'ADMIN' ? 'Admins' : 'Learners'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email or dept..."
              className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#33409E]"
            />
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="p-12 text-center text-[#64748B] text-xs">Loading organization members...</div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredMembers} 
            keyExtractor={(item) => item.id} 
            emptyTitle={`No ${roleFilter !== 'ALL' ? roleFilter.toLowerCase() + 's' : 'members'} found`}
            className="border-none shadow-none rounded-none"
          />
        )}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 text-[#33409E]">
              <UserPlus className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#0F172A]">Add User to Organization</h3>
            </div>
            
            {formError && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.smith@company.com"
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Department (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Role Assignment
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E] cursor-pointer"
                >
                  <option value="USER">Learner</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Initial Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E] font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMemberMutation.isPending}
                  className="px-4 py-2 bg-[#33409E] hover:bg-[#2C3688] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  {addMemberMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add Person</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
