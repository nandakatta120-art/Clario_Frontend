import { create } from 'zustand';
import { apiClient } from '@/services/apiClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  memberships: [],
  activeOrgId: localStorage.getItem('clario_active_org_id') || localStorage.getItem('certifypro_active_org_id'),
  token: localStorage.getItem('clario_token') || localStorage.getItem('certifypro_token'),
  isAuthenticated: !!(localStorage.getItem('clario_token') || localStorage.getItem('certifypro_token')),
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem('clario_token', token);
    set({ token, user, isAuthenticated: true });
    get().fetchMe();
  },

  logout: () => {
    localStorage.removeItem('clario_token');
    localStorage.removeItem('clario_active_org_id');
    localStorage.removeItem('certifypro_token');
    localStorage.removeItem('certifypro_active_org_id');
    set({ user: null, memberships: [], activeOrgId: null, token: null, isAuthenticated: false });
  },

  setActiveOrgId: (orgId) => {
    localStorage.setItem('clario_active_org_id', orgId);
    set({ activeOrgId: orgId });
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/auth/me');
      const memberships = response.data.memberships || [];
      const currentActive = get().activeOrgId;

      let validActive = currentActive;
      if (!validActive && memberships.length > 0) {
        validActive = memberships[0].organization_id;
        localStorage.setItem('clario_active_org_id', validActive);
      }

      set({
        user: response.data.user,
        memberships,
        activeOrgId: validActive,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
