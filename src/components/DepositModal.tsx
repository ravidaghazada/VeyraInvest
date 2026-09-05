import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DepositRequest } from '../types';
import { BankCard3D } from './BankCard3D';
import {
  X,
  Copy,
  Check,
  CreditCard,
  Upload,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  Building,
  ArrowRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Trash2,
} from 'lucide-react';

export const DepositModal: React.FC = () => {
  const {
    isDepositModalOpen,
    setIsDepositModalOpen,
    selectedDepositStageAmount,
    setSelectedDepositStageAmount,
    submitDepositRequest,
    user,
    setIsAuthModalOpen,
    paymentSettings,
    depositPlans,
    refreshDeposits,
  } = useApp();

  // Modal Flow Steps:
  // 'plan_amount' -> 'payment_details' -> 'receipt_upload' -> 'verification_waiting' -> 'approved' | 'rejected'
  const [step, setStep] = useState<
    'plan_amount' | 'payment_details' | 'receipt_upload' | 'verification_waiting' | 'approved' | 'rejected'
  >('plan_amount');

  // Amount & Plan
  const presetAmounts = [25, 50, 100, 250, 500, 750, 1000, 1200];
  const [amount, setAmount] = useState<number>(selectedDepositStageAmount || 50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_50');

  // Copied animation
  const [copiedCard, setCopiedCard] = useState<boolean>(false);
  const [copiedIban, setCopiedIban] = useState<boolean>(false);

  // Receipt form
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptDataUrl, setReceiptDataUrl] = useState<string>('');
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Real backend deposit state
  const [activeDeposit, setActiveDeposit] = useState<DepositRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // 60-second visual verification timer
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  // Polling ref to avoid stale closures
  const activeDepositIdRef = useRef<string | null>(null);
  activeDepositIdRef.current = activeDeposit?.id || null;

  useEffect(() => {
    if (selectedDepositStageAmount) {
      setAmount(selectedDepositStageAmount);
      setIsCustom(false);
    }
  }, [selectedDepositStageAmount]);

  useEffect(() => {
    if (depositPlans && depositPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(depositPlans[0].id);
    }
  }, [depositPlans, selectedPlanId]);

  // Visual 60-Second Countdown (Purely Visual - NEVER auto-approves)
  useEffect(() => {
    let timerInterval: any = null;
    if (step === 'verification_waiting' && timerSeconds > 0) {
      timerInterval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [step, timerSeconds]);

  // Real Backend Polling: Checks database status every 2 seconds
  useEffect(() => {
    let pollInterval: any = null;

    if (step === 'verification_waiting' && activeDeposit?.id) {
      const checkStatus = async () => {
        try {
          const currentDep = await api.getDepositById(activeDeposit.id);
          if (!currentDep) return;

          setActiveDeposit(currentDep);

          if (currentDep.status === 'approved' || currentDep.status === 'completed') {
            setStep('approved');
            refreshDeposits();
          } else if (currentDep.status === 'rejected') {
            setRejectionReason(
              currentDep.rejectionReason ||
                'Ödəniş rekvizitləri və ya qəbz məlumatları uyğun gəlmədi.'
            );
            setStep('rejected');
            refreshDeposits();
          }
        } catch {
          // Keep polling silently
        }
      };

      // Check immediately and then every 2.5s
      checkStatus();
      pollInterval = setInterval(checkStatus, 2500);
    }

    return () => clearInterval(pollInterval);
  }, [step, activeDeposit?.id, refreshDeposits]);

  if (!isDepositModalOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md rounded-3xl glass-card border border-[#D4AF37]/40 p-6 text-center">
          <button
            onClick={() => setIsDepositModalOpen(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <CreditCard className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Vəsait əlavə etmək üçün daxil olun</h3>
          <p className="text-xs text-neutral-300 mb-6">
            Depozit sorğusu yaratmaq üçün əvvəlcə investor hesabınıza daxil olmalısınız.
          </p>
          <button
            onClick={() => {
              setIsDepositModalOpen(false);
              setIsAuthModalOpen(true);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm"
          >
            Hesaba Daxil Ol
          </button>
        </div>
      </div>
    );
  }

  // Active payment info from backend or fallback
  const bankName = paymentSettings?.bankName || 'Kapital Bank / Birbank';
  const accountHolder =
    paymentSettings?.accountHolder && !paymentSettings.accountHolder.includes('MMC')
      ? paymentSettings.accountHolder
      : 'Veyra İnvest';
  const maskedCard =
    paymentSettings?.maskedCard &&
    !paymentSettings.maskedCard.includes('8921') &&
    !paymentSettings.maskedCard.includes('4562')
      ? paymentSettings.maskedCard
      : '4169 7388 4952 8363';
  const rawCard =
    paymentSettings?.cardNumber &&
    !paymentSettings.cardNumber.includes('4562') &&
    !paymentSettings.cardNumber.includes('8921')
      ? paymentSettings.cardNumber
      : '4169 7388 4952 8363';
  const iban = paymentSettings?.iban || 'AZ45NABZ01350100000000123456';
  const instructions =
    paymentSettings?.instructions ||
    'Ödənişi göstərilən hesaba/karta köçürün və ödəniş etdikdən sonra qəbzi yükləyin.';

  const handleCopyCard = () => {
    navigator.clipboard.writeText(rawCard.replace(/\s+/g, ''));
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Fayl ölçüsü maksimum 10MB ola bilər.');
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptDataUrl('');
  };

  const handleProceedToPayment = () => {
    const effectiveAmount = isCustom ? Number(customAmount) : amount;
    if (isNaN(effectiveAmount) || effectiveAmount < 10) {
      setError('Minimum depozit məbləği 10 AZN təşkil edir.');
      return;
    }
    setAmount(effectiveAmount);
    setError(null);
    setStep('payment_details');
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceCode.trim()) {
      setError('Zəhmət olmasa bank əməliyyat kodunu və ya referans nömrəsini daxil edin.');
      return;
    }
    if (!receiptDataUrl) {
      setError('Zəhmət olmasa rəsmi bank ödəniş qəbzini yükləyin.');
      return;
    }
    if (!acceptedTerms) {
      setError('Zəhmət olmasa qaydalar və risk bildirişi ilə razılaşın.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create real deposit in backend
      const newDeposit = await submitDepositRequest(
        amount,
        referenceCode.trim(),
        receiptDataUrl,
        receiptFile ? receiptFile.name : 'qebz.jpg',
        selectedPlanId
      );

      setActiveDeposit(newDeposit);
      setTimerSeconds(60);
      setTimerFinished(false);
      setStep('verification_waiting');
    } catch (err: any) {
      setError(err.message || 'Depozit sorğusu yaradılarkən xəta baş verdi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setStep('plan_amount');
    setReceiptFile(null);
    setReceiptDataUrl('');
    setReferenceCode('');
    setAcceptedTerms(false);
    setError(null);
    setTimerSeconds(60);
    setTimerFinished(false);
    setActiveDeposit(null);
    setSelectedDepositStageAmount(undefined);
  };

  const selectedPlan =
    depositPlans?.find((p) => p.id === selectedPlanId) ||
    depositPlans?.[0] || {
      id: 'plan_50',
      name: 'Veyra Prime Plan',
      durationDays: 30,
      profitRate: 0.65,
      riskLevel: 'Aşağı',
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-card border border-[#D4AF37]/40 p-4 min-[400px]:p-6 sm:p-7 shadow-2xl bg-[#0B111B]/95 max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Bağla"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 sm:mb-6 pr-6 pl-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-1.5">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            Mərkəzi Depozit Portalı
          </div>
          <h3 className="text-lg min-[380px]:text-xl sm:text-2xl font-extrabold text-white">
            {step === 'verification_waiting'
              ? 'Yoxlama Davam Edir'
              : step === 'approved'
              ? 'Depozit Təsdiqləndi!'
              : step === 'rejected'
              ? 'Sorğu Təsdiqlənmədi'
              : 'Hesabınıza Depozit Edin'}
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
            {step === 'verification_waiting'
              ? 'Bank çıxarışınız və qəbziniz yoxlanılır'
              : 'Məbləğ və plan seçin, rəsmi hesaba ödəniş edib qəbzi təqdim edin'}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: AMOUNT & PLAN SELECTION */}
        {step === 'plan_amount' && (
          <div className="space-y-4 sm:space-y-5">
            {/* Amount Presets */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Depozit Məbləği:
              </label>
              <div className="grid grid-cols-2 min-[380px]:grid-cols-4 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setIsCustom(false);
                      setError(null);
                    }}
                    className={`py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                      !isCustom && amount === amt
                        ? 'bg-[#D4AF37] text-neutral-950 shadow-md font-black scale-[1.02]'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    {amt} AZN
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Field */}
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-300">Fərdi Məbləğ Daxil Edin:</span>
                <span className="text-[10px] text-neutral-400">Min. 10 AZN</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  placeholder="Məsələn: 350"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setIsCustom(true);
                    setError(null);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl bg-neutral-950 border text-white text-xs sm:text-sm focus:outline-none transition-colors ${
                    isCustom ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-neutral-800'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F6E09E]">
                  AZN
                </span>
              </div>
            </div>

            {/* Plan Selector */}
            {depositPlans && depositPlans.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Depozit Planı:
                </label>
                <div className="space-y-2">
                  {depositPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPlanId === plan.id
                          ? 'bg-[#142032] border-[#D4AF37] ring-1 ring-[#D4AF37]/60'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{plan.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            {plan.minAmount} AZN
                          </span>
                        </div>
                        <span className="text-[10px] text-[#F6E09E] mt-0.5 block font-medium">
                          Gündəlik: {(plan.dailyIncome ?? (plan.minAmount * 0.06)).toFixed(2)} AZN • Aylıq: {(plan.monthlyIncome ?? (plan.minAmount * 0.06 * 30)).toFixed(0)} AZN
                        </span>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-neutral-600 flex items-center justify-center">
                        {selectedPlanId === plan.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary preview */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#0E1624] to-[#142032] border border-[#D4AF37]/25 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Seçilən Məbləğ:</span>
                <span className="text-lg sm:text-xl font-extrabold text-[#F6E09E]">
                  {(isCustom ? Number(customAmount) || 0 : amount).toFixed(2)} AZN
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Bank Komissiyası:</span>
                <span className="text-xs font-bold text-emerald-400">0.00 AZN (0%)</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              id="deposit-proceed-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Ödəniş Rekvizitlərinə Keç</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT DETAILS & INSTRUCTIONS */}
        {step === 'payment_details' && (
          <div className="space-y-4 sm:space-y-5">
            {/* 3D Animated Interactive Black Kapital Bank Card */}
            <div className="relative w-full py-1 flex flex-col items-center justify-center overflow-visible">
              <BankCard3D
                cardNumber={rawCard}
                cardHolder={accountHolder}
                showExpiry={false}
                interactive={true}
                autoRotate={true}
                showLaserGlow={true}
                showParticleSparks={true}
                animationSpeed="normal"
                className="w-full"
                onCopyNumber={handleCopyCard}
              />
            </div>

            {/* Quick Copy Action with Feedback Animation */}
            <button
              type="button"
              onClick={handleCopyCard}
              id="copy-card-number-btn"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-950/90 via-neutral-900 to-red-950/90 hover:from-red-900/90 hover:to-neutral-800 border border-red-600/50 hover:border-red-500/70 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] min-h-[44px] shadow-lg shadow-red-950/40"
            >
              {copiedCard ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">4169 7388 4952 8363 kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-red-400" />
                  <span className="text-neutral-100">Kart nömrəsini kopyala (4169 7388 4952 8363)</span>
                </>
              )}
            </button>

            {/* Payment Summary Bar */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-red-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                  Alıcı Şirkət (Kart Sahibi)
                </span>
                <p className="font-mono text-xs sm:text-sm font-bold text-neutral-100">
                  {accountHolder}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                  Ödəniləcək Məbləğ
                </span>
                <p className="font-mono text-sm sm:text-base font-extrabold text-[#F6E09E]">
                  {amount.toFixed(2)} AZN
                </p>
              </div>
            </div>

            {/* Instructions Display */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-600/30 text-xs text-amber-200/90 leading-relaxed space-y-1">
              <strong className="block text-amber-300 font-bold mb-1">
                Təhlükəsiz Ödəniş Qaydası:
              </strong>
              <p>1. {instructions.split('.')[0] || 'Ödənişi göstərilən hesaba/karta köçürün.'}.</p>
              <p>2. {instructions.split('.')[1] || 'Ödəniş etdikdən sonra qəbzi yükləyin.'}.</p>
              <p className="text-[11px] text-amber-300/70 pt-1">
                Ödənişinizin sürətli təsdiqi üçün qəbzdəki əməliyyat kodunun aydın görünməsinə diqqət yetirin.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('plan_amount')}
                className="w-1/3 py-3 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold hover:bg-neutral-800"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={() => setStep('receipt_upload')}
                id="proceed-to-receipt-btn"
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>[ Ödəniş etdim, Qəbzi Yüklə ]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REAL RECEIPT UPLOAD & TERMS */}
        {step === 'receipt_upload' && (
          <form onSubmit={handleSubmitDeposit} className="space-y-4">
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex justify-between items-center text-xs">
              <span className="text-neutral-400">Təsdiq edilən məbləğ:</span>
              <span className="text-base font-extrabold text-[#F6E09E]">{amount.toFixed(2)} AZN</span>
            </div>

            {/* Reference Code Field */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Bank Əməliyyat Kodu / Referans Nömrəsi *
              </label>
              <input
                type="text"
                placeholder="Məsələn: 092837482 və ya RRN / Auth Code"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                required
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Ödəniş Tarixi
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Real Receipt Upload with Preview & Replace */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Rəsmi Ödəniş Qəbzi (PNG, JPG, PDF) *
              </label>
              <div className="relative border-2 border-dashed border-[#D4AF37]/35 hover:border-[#D4AF37]/75 rounded-2xl p-4 text-center bg-neutral-950/60 transition-colors">
                {receiptDataUrl ? (
                  <div className="flex flex-col items-center">
                    {receiptDataUrl.startsWith('data:image') ? (
                      <div className="relative mb-2">
                        <img
                          src={receiptDataUrl}
                          alt="Qəbz preview"
                          className="w-32 h-32 object-cover rounded-xl border border-[#D4AF37]/40 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveReceipt}
                          className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow"
                          title="Qəbzi sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-2 p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                        <FileText className="w-8 h-8 text-[#D4AF37]" />
                        <span className="text-xs text-white font-bold">{receiptFile?.name}</span>
                        <button
                          type="button"
                          onClick={handleRemoveReceipt}
                          className="p-1 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <span className="text-xs font-bold text-neutral-200 truncate max-w-xs">
                      {receiptFile?.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 mt-0.5">
                      ✓ Fayl yükləndi. Dəyişmək üçün yenisini seçin:
                    </span>
                    <label className="mt-2 text-[11px] text-[#D4AF37] underline cursor-pointer hover:text-[#F6E09E]">
                      Faylı Dəyiş
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center py-4 cursor-pointer">
                    <Upload className="w-9 h-9 text-[#D4AF37] mb-2" />
                    <span className="text-xs font-bold text-neutral-200">
                      Ödəniş qəbzini seçin və ya bura atın
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-1">
                      PNG, JPG, WEBP və ya PDF (Maks. 10 MB)
                    </span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, application/pdf"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Terms and Risk Acceptance (Mandatory) */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-neutral-700 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span className="leading-snug">
                  Mən Veyra İnvestisiya qaydaları, risk bəyannaməsi və bank əməliyyat şərtləri ilə tanış
                  oldum, təqdim etdiyim qəbzin həqiqiliyini təsdiq edirəm.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('payment_details')}
                className="w-1/3 py-3 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold hover:bg-neutral-800"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={submitting}
                id="submit-deposit-request-btn"
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {submitting ? 'Serverə Göndərilir...' : '[ Depozit Sorğusunu Təsdiqlə ]'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: 60-SECOND VISUAL TIMER & REAL BACKEND STATUS POLLING */}
        {step === 'verification_waiting' && (
          <div className="text-center py-5 sm:py-6 space-y-5">
            {/* Visual Circular Progress Animation */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#1E293B"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#D4AF37"
                  strokeWidth="8"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 * (1 - timerSeconds / 60)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-black text-[#F6E09E]">
                  {timerSeconds}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest">
                  saniyə
                </span>
              </div>
            </div>

            {/* Dynamic Status Messaging */}
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-1 animate-pulse">
                {timerFinished
                  ? 'Yoxlama davam edir...'
                  : 'Ödəniş qəbziniz yoxlanılır…'}
              </h4>
              <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                {timerFinished
                  ? 'Maliyyə şöbəmiz bank çıxarışını yoxlayır. Səhifəni bağlaya bilərsiniz, təsdiqləndikdə balansınız avtomatik artacaq.'
                  : 'Depozit sorğunuz mərkəzi verilənlər bazasına daxil edildi. Maliyyə departamenti bank çıxarışı ilə uyğunluğu yoxlayır.'}
              </p>
            </div>

            {/* Real Deposit Metadata Card */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left space-y-2 max-w-sm mx-auto text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Depozit ID:</span>
                <span className="font-mono text-[#F6E09E] font-bold">
                  {activeDeposit?.id || 'Qeydə alınır...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Məbləğ:</span>
                <span className="font-bold text-white">{amount.toFixed(2)} AZN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Referans:</span>
                <span className="font-mono text-neutral-300">{referenceCode}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-neutral-800">
                <span className="text-neutral-400">Həqiqi Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Yoxlanılır (Pending)
                </span>
              </div>
            </div>

            {/* Safe Close / Background Tracker */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-xs sm:text-sm transition-all"
              >
                Pəncərəni bağla (Arxa planda izlə)
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REAL APPROVED STATE (Triggered only when database status === 'approved') */}
        {step === 'approved' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-white">
                ✓ Depozitiniz Təsdiqləndi!
              </h4>
              <p className="text-xs text-neutral-300 max-w-sm mx-auto mt-1 leading-relaxed">
                <strong className="text-emerald-400 font-bold">{amount.toFixed(2)} AZN</strong>{' '}
                məbləğində vəsait maliyyə şöbəsi tərəfindən təsdiqləndi və balansınıza uğurla əlavə
                edildi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-emerald-800/40 text-left space-y-2 max-w-sm mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Depozit ID:</span>
                <span className="font-mono text-neutral-200">{activeDeposit?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Cari Balansınız:</span>
                <span className="font-extrabold text-[#F6E09E]">
                  {(user.balance || 0).toFixed(2)} AZN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Status:</span>
                <span className="text-emerald-400 font-bold">Təsdiqləndi (Completed)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
            >
              Kabinetə Keç
            </button>
          </div>
        )}

        {/* STEP 6: REAL REJECTED STATE (Triggered only when database status === 'rejected') */}
        {step === 'rejected' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-in zoom-in-75 duration-300">
              <XCircle className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-white">
                Depozit Təsdiqlənmədi
              </h4>
              <p className="text-xs text-neutral-300 max-w-sm mx-auto mt-1 leading-relaxed">
                Təqdim etdiyiniz depozit sorğusu maliyyə nəzarəti tərəfindən rədd edilmişdir.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 text-left space-y-2 max-w-sm mx-auto text-xs">
              <div>
                <span className="text-neutral-400 block mb-1">Rədd edilmə səbəbi:</span>
                <p className="text-rose-300 font-semibold bg-rose-950/60 p-2.5 rounded-xl border border-rose-900/60">
                  {rejectionReason || 'Ödəniş qəbzi təsdiqlənmədi.'}
                </p>
              </div>
              <div className="flex justify-between pt-1 text-[11px]">
                <span className="text-neutral-400">Depozit ID:</span>
                <span className="font-mono text-neutral-300">{activeDeposit?.id}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setStep('plan_amount');
                setError(null);
              }}
              className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm transition-all"
            >
              Yenidən Cəhd Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
