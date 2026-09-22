import { create } from 'zustand';
import { MOCK_CERTIFICATION_PROGRAMS } from '@/mock/certificationPrograms';

export const useCertificationProgramStore = create(
  (set, get) => ({
    programs: MOCK_CERTIFICATION_PROGRAMS,
    searchTerm: '',
    filterTier: 'ALL',
    filterStatus: 'ALL',
    filterPlatform: 'ALL',
    filterValidity: 'ALL',
    sortBy: 'updatedAt',

    setSearchTerm: (term) => set({ searchTerm: term }),
    setFilterTier: (tier) => set({ filterTier: tier }),
    setFilterStatus: (status) => set({ filterStatus: status }),
    setFilterPlatform: (platform) => set({ filterPlatform: platform }),
    setFilterValidity: (validity) => set({ filterValidity: validity }),
    clearFilters: () =>
      set({
        searchTerm: '',
        filterTier: 'ALL',
        filterStatus: 'ALL',
        filterPlatform: 'ALL',
        filterValidity: 'ALL',
      }),
    setSortBy: (sort) => set({ sortBy: sort }),

    createProgram: (data) => {
      const newProgram = {
        ...data,
        id: `prog-${Date.now()}`,
        issuedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        programs: [newProgram, ...state.programs],
      }));
      return newProgram;
    },

    updateProgram: (id, updates) => {
      set((state) => ({
        programs: state.programs.map((prog) =>
          prog.id === id
            ? { ...prog, ...updates, updatedAt: new Date().toISOString() }
            : prog
        ),
      }));
    },

    duplicateProgram: (id) => {
      const source = get().programs.find((p) => p.id === id);
      if (!source) return null;

      const copy = {
        ...source,
        id: `prog-${Date.now()}`,
        name: `Copy of ${source.name}`,
        code: `${source.code}-COPY`,
        status: 'DRAFT',
        issuedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        programs: [copy, ...state.programs],
      }));
      return copy;
    },

    archiveProgram: (id) => {
      set((state) => ({
        programs: state.programs.map((prog) =>
          prog.id === id
            ? { ...prog, status: 'ARCHIVED', updatedAt: new Date().toISOString() }
            : prog
        ),
      }));
    },

    publishProgram: (id) => {
      set((state) => ({
        programs: state.programs.map((prog) =>
          prog.id === id
            ? { ...prog, status: 'PUBLISHED', updatedAt: new Date().toISOString() }
            : prog
        ),
      }));
    },

    getProgramById: (id) => {
      return get().programs.find((p) => p.id === id);
    },
  })
);
