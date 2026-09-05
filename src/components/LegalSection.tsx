import React from 'react';
import { ShieldCheck, Scale, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export const LegalSection: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-3">
          <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
          Hüquqi Şəffaflıq & Təhlükəsizlik
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Lisenziya, Hüquqi Şəffaflıq və <span className="gold-gradient-text font-serif">Maliyyə Qaydaları</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Hər bir maliyyə əməliyyatı Azərbaycan Respublikasının qüvvədə olan Mülki Məcəlləsinə uyğundur.
        </p>
      </div>

      <div className="space-y-6">
        {/* Transparency Block */}
        <div className="p-6 rounded-3xl glass-card border border-[#D4AF37]/30 space-y-3">
          <div className="flex items-center gap-2.5 text-base font-bold text-white">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <h3>Rəsmi Qeydiyyat və Lisenziyalaşdırma</h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            «Veyra Invest» QSC Azərbaycan Respublikasının Dövlət Vergi Xidmətində 1504938211 VÖEN nömrəsi ilə qeydiyyata alınmışdır. Şirkətimiz AR-INV/2024-883 nömrəli maliyyə və investisiya fəaliyyəti lisenziyasına malikdir. Bütün daxili maliyyə qeydləri elektron Ledger jurnalı ilə sənədləşdirilir və kənar müdaxilələrdən qorunur.
          </p>
        </div>

        {/* Risk Warning Notice */}
        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-600/30 space-y-3">
          <div className="flex items-center gap-2.5 text-base font-bold text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <h3>Şəffaf Risk Bəyanatı və Xəbərdarlıq</h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            Bütün investisiyalar müəyyən bazar riskləri daşıyır. Platformada təqdim olunan gündəlik və aylıq faiz göstəriciləri daşınmaz əmlak icarəsi və tikinti dövriyyəsinin cari maliyyə modelinə əsaslanır. Şirkətimiz istifadəçilərə aldadıcı “100% risksiz və ya zəmanətli” kimi qanunsuz vədlər vermir; fəaliyyət tamamilə real aktivlərin idarə edilməsi əsasında həyata keçirilir.
          </p>
        </div>

        {/* Terms Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">İstifadəçi Müqaviləsi</h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                İnvestor kabinetində qeydiyyatdan keçən hər kəs üçün hüquqi müqavilə qüvvəyə minir.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Fərdi Məlumatların Qorunması</h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                FİN kod, şəxsiyyət vəsiqəsi və bank kartı məlumatları 256-bit SSL şifrələmə ilə saxlanılır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
