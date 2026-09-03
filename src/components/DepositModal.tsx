import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_BANK_CARD } from '../constants/stages';
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
  } = useApp();

  const [step, setStep] = useState<'select' | 'payment_info' | 'receipt_upload' | 'timer_processing' | 'submitted'>('select');
  const [amount, setAmount] = useState<number>(selectedDepositStageAmount || 50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Receipt form
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptDataUrl, setReceiptDataUrl] = useState<string>('');
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 60-second realistic bank verification timer
  const [timerSeconds, setTimerSeconds] = useState<number>(60);

  useEffect(() => {
    if (selectedDepositStageAmount) {
      setAmount(selectedDepositStageAmount);
      setIsCustom(false);
    }
  }, [selectedDepositStageAmount]);

  // Handle 60-second processing countdown
  useEffect(() => {
    let interval: any = null;
    if (step === 'timer_processing' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setStep('submitted');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

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

  const presetAmounts = [25, 50, 100, 250, 500, 750, 1000, 1200];

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(OFFICIAL_BANK_CARD.cardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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

  const handleProceedToPayment = () => {
    const effectiveAmount = isCustom ? Number(customAmount) : amount;
    if (isNaN(effectiveAmount) || effectiveAmount < 25) {
      setError('Minimum depozit məbləği 25 AZN təşkil edir.');
      return;
    }
    setAmount(effectiveAmount);
    setError(null);
    setStep('payment_info');
  };

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceCode.trim()) {
      setError('Zəhmət olmasa bank əməliyyat kodunu və ya referans nömrəsini daxil edin.');
      return;
    }
    if (!receiptDataUrl) {
      setError('Zəhmət olmasa ödəniş çekini və ya qəbz şəklini yükləyin.');
      return;
    }

    setSubmitting(true);
    try {
      await submitDepositRequest(
        amount,
        referenceCode,
        receiptDataUrl,
        receiptFile ? receiptFile.name : 'qebz.jpg'
      );
      setSubmitting(false);
      // Start 60s real banking verification animation
      setTimerSeconds(60);
      setStep('timer_processing');
    } catch (err) {
      setError('Depozit sorğusu yaradılarkən xəta baş verdi.');
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setStep('select');
    setReceiptFile(null);
    setReceiptDataUrl('');
    setReferenceCode('');
    setError(null);
    setTimerSeconds(60);
    setSelectedDepositStageAmount(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-card border border-[#D4AF37]/40 p-4 min-[400px]:p-6 sm:p-7 shadow-2xl bg-[#0B111B]/95 max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Bağla"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 sm:mb-6 pr-8 pl-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-1.5">
            <CreditCard className="w-3 h-3 text-[#D4AF37]" />
            Təhlükəsiz Depozit Portalı
          </div>
          <h3 className="text-lg min-[380px]:text-xl sm:text-2xl font-extrabold text-white">
            Hesabınıza vəsait əlavə edin
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
            Məbləği seçin və rəsmi bank rekvizitlərinə ödəniş edin
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Məbləğ Seçimi */}
        {step === 'select' && (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Məbləğ Seçimi (AZN):
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
                        ? 'bg-[#D4AF37] text-neutral-950 shadow-md font-black'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    {amt} AZN
                  </button>
                ))}
              </div>
            </div>

            {/* Digər Məbləğ Option */}
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-300">Digər məbləğ daxil et:</span>
                <span className="text-[10px] text-neutral-400">Min. 25 AZN</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="25"
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

            {/* Summary preview */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#0E1624] to-[#142032] border border-[#D4AF37]/25 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Seçilən Məbləğ:</span>
                <span className="text-lg sm:text-xl font-extrabold text-[#F6E09E]">
                  {(isCustom ? Number(customAmount) || 0 : amount).toFixed(2)} AZN
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Komissiya:</span>
                <span className="text-xs font-bold text-emerald-400">0.00 AZN (0%)</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              id="deposit-proceed-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Davam et (Ödəniş Hesabı)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* STEP 2: Təsdiqlənmiş Ödəniş Hesabı Kartı (Birbank Kapital Bank Real Card UI) */}
        {step === 'payment_info' && (
          <div className="space-y-4 sm:space-y-5">
            {/* Physical Luxury Bank Card Representation */}
            <div className="relative w-full rounded-2xl p-4 sm:p-6 bg-gradient-to-tr from-[#1B0507] via-[#350A0E] to-[#120406] border border-red-700/40 shadow-2xl text-white overflow-hidden">
              {/* Gold Chip & Bank Logos */}
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                {/* Real Birbank & Kapital Bank branding */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                    K
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider text-red-100 uppercase block">
                      Kapital Bank
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest block">
                      birbank
                    </span>
                  </div>
                </div>

                {/* Metallic Gold Chip */}
                <div className="w-9 h-7 sm:w-10 sm:h-8 rounded-md bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#AA7C11] border border-[#FFF2B2] p-1 flex flex-col justify-between shadow-inner">
                  <div className="w-full h-0.5 bg-[#7C5A0B]/50" />
                  <div className="w-full h-0.5 bg-[#7C5A0B]/50" />
                  <div className="w-full h-0.5 bg-[#7C5A0B]/50" />
                </div>
              </div>

              {/* 16-Digit Card Number matching User's Provided Number */}
              <div className="my-3 sm:my-4">
                <span className="text-[9px] uppercase tracking-widest text-red-200/70 block mb-1">
                  Kart Nömrəsi (Birbank)
                </span>
                <p className="font-mono text-base min-[380px]:text-lg sm:text-2xl font-extrabold tracking-wider sm:tracking-widest text-amber-100 drop-shadow-md">
                  {OFFICIAL_BANK_CARD.formattedCardNumber}
                </p>
              </div>

              {/* Cardholder & Expiration */}
              <div className="flex justify-between items-end pt-2 border-t border-red-900/40 text-[11px] sm:text-xs">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-red-200/70 block">
                    Alıcı / Şirkət
                  </span>
                  <p className="font-mono text-xs sm:text-sm font-bold text-neutral-100">
                    {OFFICIAL_BANK_CARD.cardHolder}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] uppercase tracking-wider text-red-200/70 block">
                    Bitmə tarixi
                  </span>
                  <p className="font-mono text-xs font-bold text-neutral-200">
                    {OFFICIAL_BANK_CARD.expireDate}
                  </p>
                </div>
              </div>
            </div>

            {/* One-click Copy Button */}
            <button
              type="button"
              onClick={handleCopyCardNumber}
              id="copy-card-btn"
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-[#D4AF37]/50 text-[#F6E09E] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] min-h-[44px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Kart nömrəsi kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#D4AF37]" />
                  <span>[ Məlumatı kopyala ]</span>
                </>
              )}
            </button>

            {/* Instruction Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-600/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-bold mb-0.5">Təlimat:</strong>
                Birbank, M10 və ya istənilən Azərbaycan bank tətbiqindən yuxarıdakı karta tam olaraq{' '}
                <strong className="text-[#F6E09E]">{amount.toFixed(2)} AZN</strong> köçürün və ödəniş çekinin / qəbzinin şəklini saxlayın.
                <p className="mt-1 text-[11px] text-amber-300/70 italic">
                  {OFFICIAL_BANK_CARD.supportNote}
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="w-1/3 py-3 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold hover:bg-neutral-800"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={() => setStep('receipt_upload')}
                id="paid-btn"
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>[ Ödəniş etdim ]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Çek / Ödəniş Sübutu Yükləmə */}
        {step === 'receipt_upload' && (
          <form onSubmit={handleSubmitReceipt} className="space-y-4">
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex justify-between items-center text-xs">
              <span className="text-neutral-400">Ödənilən məbləğ:</span>
              <span className="text-base font-extrabold text-[#F6E09E]">{amount.toFixed(2)} AZN</span>
            </div>

            {/* Reference code / Əməliyyat nömrəsi */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Əməliyyat Kodu / Reference Nömrəsi *
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

            {/* Payment date */}
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

            {/* File Upload (PNG, JPG, PDF) */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Çek / Ödəniş Qəbzi (PNG, JPG, PDF) *
              </label>
              <div className="relative border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37]/70 rounded-2xl p-4 text-center bg-neutral-950/60 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/png, image/jpeg, application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                {receiptFile ? (
                  <div className="flex flex-col items-center">
                    {receiptDataUrl.startsWith('data:image') ? (
                      <img
                        src={receiptDataUrl}
                        alt="Çek preview"
                        className="w-24 h-24 object-cover rounded-xl border border-[#D4AF37]/40 mb-2"
                      />
                    ) : (
                      <FileText className="w-10 h-10 text-[#D4AF37] mb-2" />
                    )}
                    <span className="text-xs font-bold text-neutral-200 truncate max-w-xs">
                      {receiptFile.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 mt-0.5">
                      ✓ Fayl seçildi (Dəyişmək üçün klikləyin)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2">
                    <Upload className="w-8 h-8 text-[#D4AF37] mb-2" />
                    <span className="text-xs font-bold text-neutral-200">
                      Çek şəklini və ya sənədi seçin
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-1">
                      PNG, JPG və PDF formatları qəbul olunur
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notice: Balance not immediately changed! */}
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
              <strong className="text-neutral-200 block mb-0.5">Qeyd:</strong>
              Ödəniş edildikdən sonra sorğunuz "Gözləmədə" statusunda saxlanılacaq. Admin heyətimiz çeki yoxladıqdan dərhal sonra vəsait balansınıza köçürüləcəkdir.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('payment_info')}
                className="w-1/3 py-3 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold hover:bg-neutral-800"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={submitting}
                id="submit-deposit-request-btn"
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Göndərilir...' : '[ Depozit sorğusu göndər ]'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: 60-Second Real Bank Processing Countdown Animation */}
        {step === 'timer_processing' && (
          <div className="text-center py-6 sm:py-8 space-y-6">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Rotating Circular Progress */}
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
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  saniyə
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-1 animate-pulse">
                Ödənişiniz yoxlanılır…
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Bank əməliyyat məlumatları və yüklənmiş çek təhlükəsizlik protokolu ilə qeydə alınır. Zəhmət olmasa gözləyin...
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 max-w-xs mx-auto">
              Status: <span className="font-bold text-amber-400">🟡 Təsdiq gözləyir</span>
            </div>
          </div>
        )}

        {/* STEP 5: Final Submission Status */}
        {step === 'submitted' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              <Clock className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-extrabold text-white">
              Sorğunuz Qəbul Edildi!
            </h4>

            <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
              <strong className="text-[#F6E09E]">{amount.toFixed(2)} AZN</strong> məbləğində depozit sorğunuz və ödəniş çekiniz uğurla sistemə daxil edildi.
            </p>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left space-y-2 max-w-sm mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Status:</span>
                <span className="font-bold text-amber-400">🟡 Təsdiq gözləyir</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Referans Kodu:</span>
                <span className="font-mono text-neutral-200">{referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Balans Yenilənməsi:</span>
                <span className="text-neutral-300">Admin təsdiqindən sonra dərhal</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Tamamlandı
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
