import React from 'react';
import { ShieldCheck, Building2, Award, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brand Story */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30">
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            Şirkət Haqqında Rəsmi Məlumat
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Veyra Invest — <span className="gold-gradient-text font-serif">Gələcəyə Dəyər Qatırıq</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            «Veyra Invest» Azərbaycan Respublikasının qanunvericiliyinə tam uyğun olaraq fəaliyyət göstərən, premium daşınmaz əmlak, kommersiya infrastrukturu və yüksək likvidli maliyyə alətləri sahəsində ixtisaslaşmış investisiya şirkətidir.
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Biz hər bir vətəndaşa kiçik məbləğlərlə (25 AZN-dən başlayaraq) gəlirli və real aktivlərlə təmin olunmuş investisiya portfellərinə şərik olmaq imkanı yaradırıq. Şirkətin maliyyə jurnalı (Ledger) daxili və beynəlxalq audit standartları ilə qorunur.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hüquqi Şəffaflıq</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Dövlət Vergi Xidməti və maliyyə nəzarət orqanları qarşısında tam hesabatlılıq.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-3">
              <Award className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Real Aktiv Təminatı</h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Yatırımlar mücərrəd rəqəmlər deyil, real tikinti və icarə obyektləri ilə təmin olunur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Corporate Stats Card */}
        <div className="lg:col-span-5 p-8 rounded-3xl glass-card border border-[#D4AF37]/30 shadow-2xl relative space-y-6">
          <div className="text-center pb-4 border-b border-neutral-800">
            <h3 className="text-lg font-bold text-white">Veyra Invest Göstəriciləri</h3>
            <p className="text-xs text-neutral-400">Şəffaf və faktiki korporativ profil</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80">
              <span className="text-xs text-neutral-400">VÖEN:</span>
              <span className="font-mono text-xs font-bold text-[#F6E09E]">1504938211</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Lisenziya Nömrəsi:</span>
              <span className="font-mono text-xs font-bold text-white">AR-INV/2024-883</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Baş Qərargah:</span>
              <span className="text-xs font-semibold text-neutral-200">Bakı ş., Nizami küç. 142</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Partnyor Bank:</span>
              <span className="text-xs font-semibold text-white">Kapital Bank / Birbank</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Ödəniş Təminatı:</span>
              <span className="text-xs font-bold text-emerald-400">Azərbaycan Bank Kartları</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
