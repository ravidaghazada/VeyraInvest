import React from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, CreditCard, Layers, TrendingUp, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { setIsAuthModalOpen, setIsDepositModalOpen, user } = useApp();

  const steps = [
    {
      num: '01',
      icon: UserPlus,
      title: 'Qeydiyyatdan Keçin',
      desc: 'Google və ya Gmail ünvanınızla saniyələr ərzində rəsmi investor profilinizi yaradın.',
    },
    {
      num: '02',
      icon: CreditCard,
      title: 'Hesaba Vəsait Əlavə Edin',
      desc: 'Kapital Bank / Birbank rekvizitlərinə ödəniş edərək çekinizi yükləyin. Admin təsdiqindən sonra vəsait balansınıza oturur.',
    },
    {
      num: '03',
      icon: Layers,
      title: 'Veyra Home Mərhələsini Seçin',
      desc: '25 AZN-dən 1200 AZN-dək uyğun səviyyəni aktivləşdirin və virtual evinizin mərhələ-mərhələ tikintisini izləyin.',
    },
    {
      num: '04',
      icon: TrendingUp,
      title: 'Gündəlik Gəlir və Çıxarış',
      desc: 'Portfelinizdən qazandığınız gəlirləri istənilən vaxt komissiyasız Azərbaycan bank kartınıza çıxarın.',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 mb-3">
          Sadə və Şəffaf Mexanizm
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          Necə <span className="gold-gradient-text font-serif">İşləyir?</span>
        </h1>
        <p className="text-xs sm:text-base text-neutral-400 mt-2.5 sm:mt-3 max-w-xl mx-auto">
          4 sadə addımla maliyyə gələcəyinizi qurun və qazanmağa başlayın.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-3xl glass-card border border-neutral-800 hover:border-[#D4AF37]/40 transition-all duration-300 relative group"
            >
              <div className="flex justify-between items-start mb-5 sm:mb-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-neutral-950 transition-colors">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xl sm:text-2xl font-black text-neutral-700 font-mono group-hover:text-[#D4AF37]/40 transition-colors">
                  {st.num}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-2">{st.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{st.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-12 text-center">
        <button
          onClick={() => {
            if (user) {
              setIsDepositModalOpen(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F6E09E] via-[#D4AF37] to-[#B88E1D] text-neutral-950 font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all min-h-[44px]"
        >
          <span>İndi Başlayın</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
