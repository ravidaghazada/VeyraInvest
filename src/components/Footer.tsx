import React from 'react';
import { useApp } from '../context/AppContext';
import { VeyraLogo } from './VeyraLogo';
import { ShieldCheck, Mail, MapPin, Phone, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="w-full bg-[#070B11] border-t border-white/5 pt-16 pb-12 text-white/50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F6E09E] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] flex-shrink-0">
                <span className="text-[#070B11] font-black text-xl font-serif">V</span>
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-[#F6E09E] font-serif">
                  VEYRA INVEST
                </h3>
                <p className="text-[9px] text-[#D4AF37] tracking-[0.2em] uppercase opacity-80">
                  Vəsaitinizi ağıllı şəkildə idarə edin
                </p>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed max-w-sm mt-3">
              Veyra Invest — Müasir daşınmaz əmlak və maliyyə aktivlərinin innovativ idarəetmə platforması. Biz hər kəs üçün əlçatan, şəffaf və etibarlı investisiya mühiti yaradırıq.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>Dövlət Vergi Xidmətində qeydiyyatdan keçmiş rəsmi qurum</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Bölmələr
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('landing')}
                  className="hover:text-[#F6E09E] transition-colors"
                >
                  Ana Səhifə
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('products')}
                  className="hover:text-[#F6E09E] transition-colors"
                >
                  Veyra Home Məhsulları
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('calculator')}
                  className="hover:text-[#F6E09E] transition-colors"
                >
                  Qazanc Kalkulyatoru
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('howItWorks')}
                  className="hover:text-[#F6E09E] transition-colors"
                >
                  Necə işləyir?
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Şirkət & Hüquq
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-[#F6E09E] transition-colors"
                >
                  Haqqımızda
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('legal')}
                  className="hover:text-[#F6E09E] transition-colors"
                >
                  Hüquqi Şəffaflıq & Lisenziya
                </button>
              </li>
              <li>
                <span className="text-white/30">Məxfilik Siyasəti</span>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Mərkəzi Admin Girişi
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Əlaqə & Məlumat
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Bakı ş., Nizami küç. 142, Biznes Mərkəzi</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>destek@veyrainvest.az</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>+994 (12) 490 00 00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar matching Immersive UI */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest text-center sm:text-left">
          <div>© {new Date().getFullYear()} VEYRA INVEST QSC. BÜTÜN HÜQUQLAR QORUNUR.</div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <button onClick={() => setActiveView('legal')} className="hover:text-white transition-colors">
              Təhlükəsizlik
            </button>
            <button onClick={() => setActiveView('legal')} className="hover:text-white transition-colors">
              Şərtlər & Qaydalar
            </button>
            <span className="text-white/30">VÖEN: 1504938211</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
