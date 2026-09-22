import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { CertificationProgramsPage } from '@/features/admin/certification-programs/CertificationProgramsPage';
import { PublicVerifyPage } from '@/features/verify/PublicVerifyPage';
import { useAuthStore } from '@/store/useAuthStore';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    path: '/verify/:uuid',
    element: <PublicVerifyPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Admin Routes
      {
        path: 'admin/programs',
        element: <CertificationProgramsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
