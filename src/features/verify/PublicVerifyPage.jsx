import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Award,
  Download,
  Building2,
  Calendar,
  Share2,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Printer,
  Check,
  Sparkles,
  QrCode,
  Shield,
  FileBadge,
} from 'lucide-react';

export const PublicVerifyPage = () => {
  const { uuid } = useParams();
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState('certificate');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-verify', uuid],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/public/verify/${uuid}`);
      return res.data;
    },
    enabled: !!uuid,
    retry: 1,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/10">
            <Award className="w-7 h-7 text-brand-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Verifying Credential Authenticity</h3>
            <p className="text-xs text-slate-400 mt-1">Querying cryptographic audit registry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Verification Record Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            No official record exists for identifier <code>{uuid}</code>. This credential may have been altered or was
            never legitimately issued.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              <span>Back to Clario Home</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isValid = data.status === 'VALID';
  const isRevoked = data.status === 'REVOKED';

  // QR Code URL for browser embedding
  const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    window.location.href
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 antialiased relative selection:bg-brand-500 selection:text-white">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-3 border-b border-slate-800/80 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight block">Clario Verifier</span>
            <span className="text-[10px] text-slate-400 font-medium">Public Credential Audit Network</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center space-x-1.5 ${
              isValid
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isValid ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span>{isValid ? 'VERIFIED AUTHENTIC' : 'REVOKED'}</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full space-y-6 relative z-10">
        {/* Action Controls & View Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveView('certificate')}
              className={`flex-1 sm:flex-initial flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'certificate'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileBadge className="w-4 h-4" />
              <span>Official Certificate Canvas</span>
            </button>
            <button
              onClick={() => setActiveView('audit')}
              className={`flex-1 sm:flex-initial flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'audit'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Audit & Metadata Details</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              title="Copy shareable link"
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={shareOnLinkedIn}
              title="Share on LinkedIn"
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Share</span>
            </button>

            {data.pdf_download_url && (
              <a
                href={data.pdf_download_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/25 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            )}
          </div>
        </div>

        {/* VIEW 1: OFFICIAL VISUAL CERTIFICATE CANVAS */}
        {activeView === 'certificate' && (
          <div className="space-y-6">
            {/* The Dynamic WYSIWYG Certificate Container */}
            <div
              className="relative w-full aspect-[1123/794] rounded-2xl shadow-2xl border-4 border-slate-800 overflow-hidden select-none [container-type:inline-size]"
              style={{
                backgroundColor: data.credential.design_schema?.background?.value || '#ffffff',
              }}
            >
              {/* Revocation Stamp Overlay (if revoked) */}
              {isRevoked && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-30">
                  <div className="border-4 border-rose-600 text-rose-600 uppercase font-sans font-black text-3xl sm:text-5xl px-8 py-3 rounded-2xl -rotate-12 tracking-widest shadow-2xl bg-white/90">
                    REVOKED
                  </div>
                </div>
              )}

              {/* Dynamic Objects Rendering */}
              {data.credential.design_schema?.objects && data.credential.design_schema.objects.length > 0 ? (
                data.credential.design_schema.objects.map((obj, idx) => {
                  const rawType = (obj.type || obj.customType || 'i-text').toLowerCase();
                  const leftPercent = ((obj.left || 0) / 1123) * 100;
                  const topPercent = ((obj.top || 0) / 794) * 100;

                  const originX = obj.originX || 'center';
                  const originY = obj.originY || 'center';
                  const tx = originX === 'center' ? '-50%' : originX === 'right' ? '-100%' : '0%';
                  const ty = originY === 'center' ? '-50%' : originY === 'bottom' ? '-100%' : '0%';

                  // 1. TEXT ELEMENTS
                  if (rawType === 'i-text' || rawType === 'text') {
                    let display = obj.text || '';
                    if (obj.isPlaceholder && obj.placeholderKey === 'recipient_name') {
                      display = data.recipient.full_name;
                    } else if (obj.isPlaceholder && obj.placeholderKey === 'issue_date') {
                      display = new Date(data.credential.issued_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                    } else if (obj.isPlaceholder && obj.placeholderKey === 'certificate_number') {
                      display = data.credential.certificate_number || uuid || '';
                    } else {
                      display = display
                        .replace(/\{\{recipient_name\}\}/g, data.recipient.full_name)
                        .replace(
                          /\{\{issue_date\}\}/g,
                          new Date(data.credential.issued_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        )
                        .replace(/\{\{certificate_number\}\}/g, data.credential.certificate_number || uuid || '')
                        .replace(/\{\{course_title\}\}/g, data.credential.title || '')
                        .replace(/\{\{issuer_name\}\}/g, data.issuer.name || '');
                    }

                    return (
                      <div
                        key={obj.id || idx}
                        className="absolute whitespace-nowrap pointer-events-none"
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          transform: `translate(${tx}, ${ty})`,
                          fontFamily: obj.fontFamily || 'Inter',
                          fontSize: `calc(${obj.fontSize || 18}px * (100cqi / 1123))`,
                          fontWeight: obj.fontWeight || 'normal',
                          color: obj.fill || '#0f172a',
                          textAlign: originX === 'center' ? 'center' : originX === 'right' ? 'right' : 'left',
                        }}
                      >
                        {display}
                      </div>
                    );
                  }

                  // 2. BADGE / SEAL
                  if (rawType === 'badge' || rawType === 'seal' || rawType.includes('seal')) {
                    const isGold = (obj.badgeType || 'gold_seal') === 'gold_seal';
                    return (
                      <div
                        key={obj.id || idx}
                        className="absolute pointer-events-none flex items-center justify-center"
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          transform: `translate(${tx}, ${ty})`,
                        }}
                      >
                        {isGold ? (
                          <div
                            className="aspect-square rounded-full flex-shrink-0 flex items-center justify-center select-none shadow-sm"
                            style={{
                              width: `calc(84px * (100cqi / 1123))`,
                              height: `calc(84px * (100cqi / 1123))`,
                              backgroundColor: '#fef3c7',
                              border: `calc(3px * (100cqi / 1123)) solid #d97706`,
                            }}
                          >
                            <div
                              className="aspect-square rounded-full w-[84%] h-[84%] flex flex-col items-center justify-center text-center p-0.5"
                              style={{
                                border: `calc(1.5px * (100cqi / 1123)) dashed #d97706`,
                              }}
                            >
                              <div
                                className="font-sans font-bold text-[#92400e] leading-tight text-center flex flex-col items-center justify-center"
                                style={{
                                  fontFamily: "'Montserrat', sans-serif",
                                  fontSize: `calc(8.5px * (100cqi / 1123))`,
                                  letterSpacing: '0.02em',
                                }}
                              >
                                <span>★ OFFICIAL ★</span>
                                <span
                                  className="font-black"
                                  style={{ fontSize: `calc(10.5px * (100cqi / 1123))` }}
                                >
                                  SEAL
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="rounded-full border-2 border-[#16a34a] bg-[#f0fdf4] text-[#15803d] font-bold font-sans flex items-center justify-center shadow-sm whitespace-nowrap px-3"
                            style={{
                              width: `calc(140px * (100cqi / 1123))`,
                              height: `calc(44px * (100cqi / 1123))`,
                              fontSize: `calc(9px * (100cqi / 1123))`,
                            }}
                          >
                            ✓ VERIFIED CREDENTIAL
                          </div>
                        )}
                      </div>
                    );
                  }

                  // 3. QR CODE BOX
                  if (rawType === 'qr-code-box' || rawType === 'qrcode' || obj.placeholderKey === 'verification_qr') {
                    return (
                      <div
                        key={obj.id || idx}
                        className="absolute p-1 bg-white border border-slate-300 rounded-lg shadow-sm flex items-center justify-center pointer-events-none"
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          transform: `translate(${tx}, ${ty})`,
                          width: `calc(${(obj.width || 80) * 1.1}px * (100cqi / 1123))`,
                          height: `calc(${(obj.height || 80) * 1.1}px * (100cqi / 1123))`,
                        }}
                      >
                        <img src={qrCodeDataUrl} alt="Verify QR" className="w-full h-full object-contain block" />
                      </div>
                    );
                  }

                  // 4. RECTANGLES / BORDERS
                  if (rawType === 'rect' || rawType === 'rectangle') {
                    const isStroke = obj.stroke && obj.stroke !== 'none' && obj.stroke !== 'transparent';
                    const isFill = obj.fill && obj.fill !== 'none' && obj.fill !== 'transparent';
                    return (
                      <div
                        key={obj.id || idx}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          transform: `translate(${tx}, ${ty})`,
                          width: `calc(${obj.width || 100}px * (100cqi / 1123))`,
                          height: `calc(${obj.height || 100}px * (100cqi / 1123))`,
                          backgroundColor: isFill ? obj.fill : 'transparent',
                          border: isStroke
                            ? `calc(${obj.strokeWidth || 1}px * (100cqi / 1123)) ${
                                obj.strokeDashArray ? 'dashed' : 'solid'
                              } ${obj.stroke}`
                            : 'none',
                          borderRadius: `calc(${obj.rx || 0}px * (100cqi / 1123))`,
                        }}
                      />
                    );
                  }

                  // 5. LINES
                  if (rawType === 'line') {
                    return (
                      <div
                        key={obj.id || idx}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          transform: `translate(${tx}, ${ty})`,
                          width: `calc(${obj.width || 200}px * (100cqi / 1123))`,
                          borderTop: `calc(${obj.strokeWidth || 1}px * (100cqi / 1123)) solid ${
                            obj.stroke || '#94a3b8'
                          }`,
                        }}
                      />
                    );
                  }

                  return null;
                })
              ) : (
                /* Fallback layout if no design schema objects */
                <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto py-8">
                  <h1 className="text-3xl font-bold text-[#0f172a] uppercase mt-4">{data.credential.title}</h1>
                  <h2 className="text-4xl font-bold text-[#1e3a8a] italic mt-4">{data.recipient.full_name}</h2>
                  <p className="text-sm text-[#334155] max-w-xl mx-auto">{data.credential.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: CRYPTOGRAPHIC AUDIT & METADATA DETAILS */}
        {activeView === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">Cryptographic Verification Record</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tamper-evident verification ledger powered by Clario Digital Infrastructure
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Verification Identifier</span>
                <p className="font-mono text-brand-400 font-bold break-all">{uuid}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Certificate Registry ID</span>
                <p className="font-mono text-white font-bold">{data.credential.certificate_number || '—'}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Awarded Individual</span>
                <p className="font-bold text-white text-sm">{data.recipient.full_name}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Issuing Authority</span>
                <p className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{data.issuer.name}</span>
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Issuance Timestamp</span>
                <p className="font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(data.credential.issued_at).toLocaleString()}</span>
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Cryptographic Status</span>
                <p
                  className={`font-bold flex items-center space-x-1.5 ${
                    isValid ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isValid ? 'Valid & Unaltered' : `Revoked: ${data.revocation_reason || 'Administrative'}`}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-6 text-xs text-slate-500 border-t border-slate-900 mt-8">
        Public Credential Registry • Cryptographically Sealed & Tamper-Evident • Powered by Clario
      </footer>
    </div>
  );
};
