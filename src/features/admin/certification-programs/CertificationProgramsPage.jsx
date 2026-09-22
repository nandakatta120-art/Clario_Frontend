import React, { useState, useMemo } from 'react';
import { useCertificationProgramStore } from '@/services/certificationProgramService';
import { CertificationProgramCard } from './components/CertificationProgramCard';
import { CertificationProgramDetail } from './components/CertificationProgramDetail';
import { EligibilitySimulatorModal } from './components/EligibilitySimulatorModal';
import { ProgramPreviewModal } from './components/ProgramPreviewModal';
import { ProgramWizard } from './wizard/ProgramWizard';
import { KPICard } from '@/components/ui/KPICard';
import { useToast } from '@/components/ui/ToastNotification';
import {
  Award,
  Search,
  Plus,
  Filter,
  SlidersHorizontal,
  X,
  Layers,
  Sparkles,
  Zap,
  CheckCircle,
  Clock,
  Archive,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import clsx from 'clsx';

export const CertificationProgramsPage = () => {
  const { showToast } = useToast();
  const {
    programs,
    searchTerm,
    filterTier,
    filterStatus,
    filterPlatform,
    filterValidity,
    sortBy,
    setSearchTerm,
    setFilterTier,
    setFilterStatus,
    setFilterPlatform,
    setFilterValidity,
    clearFilters,
    setSortBy,
    createProgram,
    updateProgram,
    duplicateProgram,
    archiveProgram,
  } = useCertificationProgramStore();

  // State for active views and modals
  const [selectedProgramForDetail, setSelectedProgramForDetail] =
    useState(null);
  const [selectedProgramForSim, setSelectedProgramForSim] =
    useState(null);
  const [selectedProgramForPreview, setSelectedProgramForPreview] =
    useState(null);
  const [programToEdit, setProgramToEdit] =
    useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [programToArchive, setProgramToArchive] =
    useState(null);

  // Compute Summary KPI metrics
  const activeProgramsCount = programs.filter((p) => p.status === 'PUBLISHED').length;
  const draftProgramsCount = programs.filter((p) => p.status === 'DRAFT').length;
  const totalIssuedCredentials = programs.reduce((acc, p) => acc + p.issuedCount, 0);
  const multiLmsProgramsCount = programs.filter((p) => {
    const platforms = new Set(p.milestones.map((m) => m.platform));
    return platforms.size >= 2;
  }).length;

  // Filter & Sort Logic
  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => {
        // Search Filter
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.skills.some((s) => s.toLowerCase().includes(term)) ||
          p.milestones.some((m) => m.platform.toLowerCase().includes(term));

        // Tier Filter
        const matchesTier = filterTier === 'ALL' || p.tier === filterTier;

        // Status Filter
        const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;

        // Platform Filter
        const matchesPlatform =
          filterPlatform === 'ALL' ||
          p.milestones.some((m) => m.platform === filterPlatform);

        // Validity Filter
        const matchesValidity =
          filterValidity === 'ALL' || p.validityMonths === filterValidity;

        return (
          matchesSearch &&
          matchesTier &&
          matchesStatus &&
          matchesPlatform &&
          matchesValidity
        );
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'issuedCount') return b.issuedCount - a.issuedCount;
        if (sortBy === 'createdAt')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [
    programs,
    searchTerm,
    filterTier,
    filterStatus,
    filterPlatform,
    filterValidity,
    sortBy,
  ]);

  const hasActiveFilters =
    searchTerm ||
    filterTier !== 'ALL' ||
    filterStatus !== 'ALL' ||
    filterPlatform !== 'ALL' ||
    filterValidity !== 'ALL';

  // Modal Action Handlers
  const handleOpenNewWizard = () => {
    setProgramToEdit(null);
    setIsWizardOpen(true);
  };

  const handleOpenEditWizard = (program) => {
    setProgramToEdit(program);
    setIsWizardOpen(true);
  };

  const handleDuplicate = (program) => {
    const copy = duplicateProgram(program.id);
    if (copy) {
      showToast(`Duplicated "${program.name}" as draft.`, { type: 'success' });
    }
  };

  const handleConfirmArchive = () => {
    if (programToArchive) {
      archiveProgram(programToArchive.id);
      showToast(`Archived "${programToArchive.name}".`, { type: 'info' });
      setProgramToArchive(null);
      if (selectedProgramForDetail?.id === programToArchive.id) {
        setSelectedProgramForDetail(null);
      }
    }
  };

  const handleSaveWizard = (
    data,
    isDraft
  ) => {
    if (programToEdit) {
      updateProgram(programToEdit.id, data);
    } else {
      createProgram(data);
    }
  };

  // If a program is selected for detailed inspection, render the Detail View
  if (selectedProgramForDetail) {
    return (
      <CertificationProgramDetail
        program={selectedProgramForDetail}
        onBack={() => setSelectedProgramForDetail(null)}
        onEdit={(p) => handleOpenEditWizard(p)}
        onDuplicate={(p) => handleDuplicate(p)}
        onArchive={(p) => setProgramToArchive(p)}
        onSimulate={(p) => setSelectedProgramForSim(p)}
        onPreview={(p) => setSelectedProgramForPreview(p)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center space-x-2.5 font-display">
            <Award className="w-7 h-7 text-[#33409E]" />
            <span>Certification Programs</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Configure multi-LMS eligibility rules, skills mapping, and credential requirements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenNewWizard}
            className="px-4 py-2.5 rounded-xl bg-[#33409E] text-white text-sm font-bold hover:bg-[#2C3688] flex items-center space-x-2 shadow-sm transition-all shadow-subtle hover:shadow-light-float"
          >
            <Plus className="w-4 h-4" />
            <span>New Program</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Active Programs"
          value={activeProgramsCount.toString()}
          icon={Award}
          trend={{ value: 10, isPositive: true }}
        />
        <KPICard
          title="Draft Programs"
          value={draftProgramsCount.toString()}
          icon={Clock}
        />
        <KPICard
          title="Credentials Issued"
          value={totalIssuedCredentials.toString()}
          icon={CheckCircle}
          trend={{ value: 18, isPositive: true }}
        />
        <KPICard
          title="Multi-LMS Rules"
          value={multiLmsProgramsCount.toString()}
          icon={Layers}
        />
      </div>

      {/* Search, Filter Bar & Sort Controls */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-subtle space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search programs by title, code, skills, or LMS platform..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#33409E] focus:bg-white transition-colors"
            />
          </div>

          {/* Filters & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tier Filter */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#33409E] cursor-pointer"
            >
              <option value="ALL">All Tiers</option>
              <option value="FOUNDATION">Foundation</option>
              <option value="STANDARD">Standard</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#33409E] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {/* Platform Filter */}
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#33409E] cursor-pointer"
            >
              <option value="ALL">All LMS Platforms</option>
              <option value="CSOD">CSOD</option>
              <option value="COURSERA">Coursera</option>
              <option value="EDX">edX</option>
              <option value="UDEMY">Udemy</option>
              <option value="DOCEBO">Docebo</option>
              <option value="UKG">UKG</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1 border-l border-[#E2E8F0] pl-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E2E8F0] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#33409E] cursor-pointer"
              >
                <option value="updatedAt">Recently Updated</option>
                <option value="name">Program Name</option>
                <option value="issuedCount">Issued Count</option>
                <option value="createdAt">Creation Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E2E8F0]">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mr-1">
              Active Filters:
            </span>

            {searchTerm && (
              <span className="inline-flex items-center space-x-1 bg-[#33409E]/10 text-[#33409E] text-xs font-semibold px-2 py-0.5 rounded-lg">
                <span>Search: "{searchTerm}"</span>
                <button onClick={() => setSearchTerm('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filterTier !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 bg-[#33409E]/10 text-[#33409E] text-xs font-semibold px-2 py-0.5 rounded-lg">
                <span>Tier: {filterTier}</span>
                <button onClick={() => setFilterTier('ALL')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filterStatus !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 bg-[#33409E]/10 text-[#33409E] text-xs font-semibold px-2 py-0.5 rounded-lg">
                <span>Status: {filterStatus}</span>
                <button onClick={() => setFilterStatus('ALL')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filterPlatform !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 bg-[#33409E]/10 text-[#33409E] text-xs font-semibold px-2 py-0.5 rounded-lg">
                <span>Platform: {filterPlatform}</span>
                <button onClick={() => setFilterPlatform('ALL')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-xs font-bold text-[#EF4444] hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Program Cards Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPrograms.map((prog) => (
            <CertificationProgramCard
              key={prog.id}
              program={prog}
              onView={(p) => setSelectedProgramForDetail(p)}
              onEdit={(p) => handleOpenEditWizard(p)}
              onDuplicate={(p) => handleDuplicate(p)}
              onArchive={(p) => setProgramToArchive(p)}
              onSimulate={(p) => setSelectedProgramForSim(p)}
              onPreview={(p) => setSelectedProgramForPreview(p)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-subtle">
          <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto mb-4 text-[#64748B]">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">
            No matching certification programs
          </h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your search criteria or clear your active filters to see available programs.'
              : 'Create your first certification program to define cross-platform eligibility and issue automated credentials.'}
          </p>
          <div className="mt-5 flex items-center justify-center space-x-3">
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={handleOpenNewWizard}
                className="px-4 py-2 rounded-xl bg-[#33409E] text-white text-xs font-bold hover:bg-[#2C3688] flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Program</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Creation / Edit Wizard Modal */}
      <ProgramWizard
        initialProgram={programToEdit}
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setProgramToEdit(null);
        }}
        onSave={handleSaveWizard}
      />

      {/* 100% Explainability Rule Simulator Modal */}
      <EligibilitySimulatorModal
        program={selectedProgramForSim}
        isOpen={!!selectedProgramForSim}
        onClose={() => setSelectedProgramForSim(null)}
      />

      {/* Digital Credential Preview Modal */}
      <ProgramPreviewModal
        program={selectedProgramForPreview}
        isOpen={!!selectedProgramForPreview}
        onClose={() => setSelectedProgramForPreview(null)}
      />

      {/* Archive Confirmation Dialog */}
      {programToArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Archive certification program?
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                "{programToArchive.name}" will no longer accept new candidate completions for
                automated verification. Existing issued credentials remain valid.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setProgramToArchive(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] transition-colors shadow-sm"
              >
                Archive Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
