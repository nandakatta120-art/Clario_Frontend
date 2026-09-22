import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/services/apiClient';
import { AuthLayout } from './components/AuthLayout';
import { AuthInput } from './components/AuthInput';
import { PasswordInput } from './components/PasswordInput';
import { AuthButton } from './components/AuthButton';
import { AuthAlert } from './components/AuthAlert';
import { Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('akash@gmail.com');
  const [password, setPassword] = useState('Akash@123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        'Unable to sign in. Please verify your email and password.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Field cascading animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-5"
    >
      {/* Form Title & Subtitle */}
      <motion.div variants={fieldVariants} className="space-y-1">
        <h2 className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-[#33409E]">
          Sign in to Clario
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] font-sans">
          Enter your credentials to access your organization dashboard
        </p>
      </motion.div>

      {/* Demo Fast-Fill Helper Pill with Royal Cobalt Accent */}
      <motion.div
        variants={fieldVariants}
        className="p-2.5 rounded-full bg-[#EEF1FA] border border-[#7B8AE0]/40 flex items-center justify-between text-xs font-sans shadow-sm"
      >
        <div className="flex items-center space-x-2 text-[#33409E] pl-2">
          <Sparkles className="w-3.5 h-3.5 text-[#33409E] shrink-0 animate-pulse" />
          <span className="text-[11px] font-semibold">Demo Admin Credentials</span>
        </div>
        <button
          type="button"
          onClick={() => handleQuickFill('akash@gmail.com', 'Akash@123')}
          className="text-[11px] font-bold text-white bg-[#33409E] hover:bg-[#2C3688] px-3.5 py-1 rounded-full shadow-sm shadow-[#33409E]/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          Auto Fill
        </button>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <AuthAlert
          title="Unable to sign in"
          message={error}
          variant="error"
          onClose={() => setError(null)}
        />
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <motion.div variants={fieldVariants}>
          <AuthInput
            id="email"
            label="Work Email Address"
            type="email"
            required
            autoComplete="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.com"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <PasswordInput
            id="password"
            label="Password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </motion.div>

        <motion.div variants={fieldVariants} className="pt-2">
          <AuthButton
            type="submit"
            loading={loading}
            loadingText="Signing in..."
          >
            Sign In to Organization
          </AuthButton>
        </motion.div>
      </form>

      {/* Bottom Switcher */}
      <motion.div variants={fieldVariants} className="pt-3 border-t border-slate-100 text-center">
        <p className="text-xs text-[#64748B] font-sans">
          Don't have an organization account?{' '}
          <Link
            to="/signup"
            className="text-[#33409E] font-bold hover:text-[#7B8AE0] transition-colors"
          >
            Create an organization
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};
