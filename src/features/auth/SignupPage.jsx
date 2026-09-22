import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/services/apiClient';
import { AuthLayout } from './components/AuthLayout';
import { AuthInput } from './components/AuthInput';
import { PasswordInput } from './components/PasswordInput';
import { AuthButton } from './components/AuthButton';
import { AuthAlert } from './components/AuthAlert';
import { Mail, User, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const isLengthValid = password.length >= 8;
  const isMatchValid = password.length > 0 && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const passwordCriteria = [
    { label: 'At least 8 characters', met: isLengthValid },
    { label: 'Passwords match', met: isMatchValid },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/signup', {
        full_name: fullName,
        email,
        organization_name: orgName,
        password,
      });
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        'Unable to create organization account. Please check your details and try again.';
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
      transition: { staggerChildren: 0.05 },
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
      className="space-y-3.5 sm:space-y-4"
    >
      {/* Title and Subtitle */}
      <motion.div variants={fieldVariants} className="space-y-1">
        <h2 className="font-display text-2xl sm:text-[26px] font-bold tracking-tight text-[#33409E]">
          Create your Organization
        </h2>
        <p className="text-xs text-[#64748B] font-sans">
          Set up your organization account and begin issuing trusted digital credentials
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <AuthAlert
          title="Registration Error"
          message={error}
          variant="error"
          onClose={() => setError(null)}
        />
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <motion.div variants={fieldVariants}>
          <AuthInput
            id="fullName"
            label="Full Name"
            type="text"
            required
            autoComplete="name"
            icon={User}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Dr. Jane Doe"
          />
        </motion.div>

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
            placeholder="jane@university.edu"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <AuthInput
            id="orgName"
            label="Organization Name"
            type="text"
            required
            autoComplete="organization"
            icon={Building2}
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="e.g. Acme Institute of Technology"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <PasswordInput
            id="password"
            label="Password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            showCriteria={password.length > 0}
            criteria={passwordCriteria}
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            error={isMismatch ? 'Passwords do not match' : undefined}
            badge={
              isMatchValid ? (
                <span className="flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Matched</span>
                </span>
              ) : undefined
            }
          />
        </motion.div>

        <motion.div variants={fieldVariants} className="pt-2">
          <AuthButton
            type="submit"
            loading={loading}
            loadingText="Creating organization..."
            disabled={isMismatch || !isLengthValid}
          >
            Create Organization Account
          </AuthButton>
        </motion.div>
      </form>

      {/* Bottom Switcher */}
      <motion.div variants={fieldVariants} className="pt-3 border-t border-slate-100 text-center">
        <p className="text-xs text-[#64748B] font-sans">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#33409E] font-bold hover:text-[#7B8AE0] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};
