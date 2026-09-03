import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const WithdrawalModal: React.FC = () => {
  const {
    isWithdrawalModalOpen,
    setIsWithdrawalModalOpen,
    user,
    submitWithdrawalRequest,
  } = useApp();

  const [amount, setAmount] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>(user?.name || '');
  const [bankName, setBankName] = useState<string>('Birbank / Kapital Bank');
  const [finCode, setFinCode] = useState<string>(user?.kyc?.finCode || '');
  const [idSerial, setIdSerial] = useState<string>(user?.kyc?.idSerial || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sync user details safely whenever modal opens or user updates
  React.useEffect(() => {
    if (user) {
      if (!cardHolder && user.name) setCardHolder(user.name);
      if (!finCode && user.kyc?.finCode) setFinCode(user.kyc.finCode);
      if (!idSerial && user.kyc?.idSerial) setIdSerial(user.kyc.idSerial);
    }
  }, [user, isWithdrawalModalOpen]);

  if (!isWithdrawalModalOpen || !user) return null;

  const currentBalance = user.balance;
  const numAmount = Number(amount) || 0;
  const commission = 0; // 0% commission
  const netPayout = Math.max(0, numAmount - commission);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numAmount < 10) {
      setError('Minimum çıxarış məbləği 10 AZN təşkil edir.');
      return;
    }

    if (numAmount > currentBalance) {
      setError('Çıxarış məbləği mövcud sərbəst balansınızdan çox ola bilməz.');
      return;
    }

    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
      setError('Zəhmət olmasa düzgün 16 rəqəmli bank kartı nömrəsi daxil edin.');
      return;
    }

    if (!finCode.trim() || finCode.trim().length !== 7) {
      setError('Zəhmət olmasa düzgün 7 simvollu FİN kod daxil edin (KYC tələbi).');
      return;
    }

    setLoading(true);
    try {
      const res = await submitWithdrawalRequest(
        numAmount,
        cardNumber,
        bankName,
        cardHolder,
        finCode.toUpperCase(),
        idSerial.toUpperCase()
      );

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Çıxarış zamanı xəta baş verdi.');
      }
    } catch (err) {
      setError('Xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsWithdrawalModalOpen(false);
    setAmount('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-card border border-[#D4AF37]/40 p-4 min-[400px]:p-6 sm:p-7 shadow-2xl bg-[#0B111B]/95 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Bağla"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="text-center mb-5 sm:mb-6 pr-7 pl-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-1.5">
            <CreditCard className="w-3 h-3 text-[#D4AF37]" />
            Vəsaitin Çıxarılması
          </div>
          <h3 className="text-lg min-[380px]:text-xl sm:text-2xl font-extrabold text-white">
            Vəsaiti Çıxar
          </h3>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
            Azərbaycan bank kartlarına komissiyasız sürətli çıxarış
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-white">
              Çıxarış Sorğusu Qəbul Edildi!
            </h4>
            <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
              <strong className="text-[#F6E09E]">{numAmount.toFixed(2)} AZN</strong> məbləğində vəsait çıxarışı yoxlanışdadır. Təsdiqdən sonra dərhal kartınıza mədaxil olunacaq.
            </p>
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
              Status: <span className="font-bold text-amber-400">🟡 Gözləmədə (Yoxlanılır)</span>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98]"
            >
              Oldu
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Balans Şəffaflıq Paneli */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Mövcud Sərbəst Balans:</span>
                <span className="font-extrabold text-[#F6E09E] text-sm">{currentBalance.toFixed(2)} AZN</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Çıxarıla Bilən Məbləğ:</span>
                <span className="font-semibold text-neutral-200">{currentBalance.toFixed(2)} AZN</span>
              </div>
            </div>

            {/* Məbləğ Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Çıxarış Məbləği (AZN) *
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(currentBalance.toString())}
                  className="text-[11px] text-[#D4AF37] hover:underline font-semibold"
                >
                  Hamısını çıxar
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max={currentBalance}
                  placeholder="Məsələn: 100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#D4AF37] focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F6E09E]">
                  AZN
                </span>
              </div>
            </div>

            {/* Bank Seçimi & Kart Nömrəsi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Bankınız
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="Birbank / Kapital Bank">Birbank / Kapital Bank</option>
                  <option value="ABB (Azərbaycan Beynəlxalq Bankı)">ABB (Beynəlxalq Bank)</option>
                  <option value="Paşa Bank">Paşa Bank</option>
                  <option value="Leo Bank / Unibank">Leo Bank / Unibank</option>
                  <option value="Bank of Baku">Bank of Baku</option>
                  <option value="Digər Azərbaycan Bankı">Digər Azərbaycan Bankı</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  16 Rəqəmli Kart Nömrəsi *
                </label>
                <input
                  type="text"
                  placeholder="4169 xxxx xxxx xxxx"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Sahibin Adı Soyadı */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Kart Sahibinin Adı və Soyadı *
              </label>
              <input
                type="text"
                placeholder="Şəxsiyyət vəsiqəsindəki kimi"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* KYC Blok: FİN Kod & Şəxsiyyət Seriyası */}
            <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
                <ShieldCheck className="w-4 h-4" />
                <span>KYC Şəxsiyyət Təsdiqi (Təhlükəsizlik)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                    FİN Kod (7 simvol) *
                  </label>
                  <input
                    type="text"
                    maxLength={7}
                    placeholder="Məs: 7ABC123"
                    value={finCode}
                    onChange={(e) => setFinCode(e.target.value.toUpperCase())}
                    required
                    className="w-full py-2 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs uppercase font-mono focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                    Vəsiqə Seriyası *
                  </label>
                  <input
                    type="text"
                    placeholder="AZE12345678"
                    value={idSerial}
                    onChange={(e) => setIdSerial(e.target.value.toUpperCase())}
                    required
                    className="w-full py-2 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs uppercase font-mono focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Yekun Hesabat */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0E1624] to-[#152238] border border-[#D4AF37]/30 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Çıxarış Məbləği:</span>
                <span className="font-bold text-white">{numAmount.toFixed(2)} AZN</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Komissiya haqqı:</span>
                <span className="font-bold text-emerald-400">0.00 AZN (0%)</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#F6E09E] pt-1.5 border-t border-neutral-800">
                <span>Alacağınız Yekun Məbləğ:</span>
                <span>{netPayout.toFixed(2)} AZN</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || currentBalance < 10}
              id="withdrawal-submit-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Sorğu yaradılır...' : 'Çıxarış Sorğusu Göndər'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
