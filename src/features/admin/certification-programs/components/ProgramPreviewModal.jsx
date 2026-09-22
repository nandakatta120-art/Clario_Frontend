import React from 'react';
import { LiveBadgeRenderer } from './LiveBadgeRenderer';
import {
  X,
  Award,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Globe,
  Share2,
  Download,
  Building2,
  Sparkles,
  QrCode,
} from 'lucide-react';
import clsx from 'clsx';

export const ProgramPreviewModal = ({
  program,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slide-up z-10">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-[#33409E]" />
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Digital Credential Presentation Preview
              </h2>
              <p className="text-xs text-[#64748B]">
                Live visualization of learner credential badge, metadata, and verification seal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Presentation Display */}
        <div className="p-6 sm:p-8 bg-[#EEF1FA]/60 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {/* Certificate Canvas Frame */}
          <div className="w-full max-w-2xl bg-white rounded-2xl border-4 border-[#33409E]/20 shadow-light-float p-8 sm:p-10 relative overflow-hidden text-center">
            {/* Background Decorative Guilloche pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#33409E_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#33409E]" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#33409E]" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#33409E]" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#33409E]" />

            {/* Issuer Logo & Brand Header with Live Badge */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-4">
              <LiveBadgeRenderer badge={program.badge} size="md" showVerification={true} />
              <h4 className="text-xs font-black uppercase tracking-widest text-[#33409E] mt-1">
                Clario Verified Credential
              </h4>
            </div>

            {/* Certificate Title */}
            <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">
              This is to certify that
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] my-2 font-display tracking-tight">
              Jane Doe
            </h3>
            <p className="text-xs text-[#64748B] max-w-lg mx-auto">
              has successfully fulfilled all multi-platform verification requirements and achieved
              qualification for the professional credential:
            </p>

            {/* Program Name & Badge */}
            <div className="my-6 p-4 rounded-xl bg-gradient-to-b from-[#F8FAFC] to-white border border-[#E2E8F0]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#33409E] bg-[#33409E]/10 px-2 py-0.5 rounded-full">
                {program.tier} Tier Credential
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-2">
                {program.credentialSettings?.title || program.name}
              </h2>
              <p className="font-mono text-xs text-[#64748B] mt-1">
                Program Code: {program.code} • {program.version}
              </p>
            </div>

            {/* Skills Pills */}
            {program.skills && program.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {program.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-[#33409E]/5 text-[#33409E] px-2 py-0.5 rounded-md border border-[#33409E]/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Sign-off & Verification Barcode */}
            <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-left">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#64748B]">Validity</p>
                <p className="text-xs font-bold text-[#0F172A]">{program.validityMonths} Months</p>
                <p className="text-[10px] text-[#64748B]">Expires: 1 Year from Issuance</p>
              </div>

              <div className="text-center sm:border-x sm:border-[#E2E8F0] sm:px-4">
                <div className="w-9 h-9 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-extrabold text-[#10B981] uppercase tracking-wider">
                  Tamper-Proof
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#64748B]">Verification ID</p>
                <p className="text-xs font-mono font-bold text-[#33409E]">
                  CLR-VERIFY-2026-X89B
                </p>
                <p className="text-[10px] text-[#64748B]">Public Verification Enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <p className="text-xs text-[#64748B]">
            Compliant with W3C Verifiable Credentials and Open Badges standards.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
