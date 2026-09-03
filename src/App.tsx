/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VeyraHomeVisualizer } from './components/VeyraHomeVisualizer';
import { ProfitCalculator } from './components/ProfitCalculator';
import { VeyraProducts } from './components/VeyraProducts';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutSection } from './components/AboutSection';
import { LegalSection } from './components/LegalSection';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawalModal } from './components/WithdrawalModal';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-[#070B11] text-white font-sans flex flex-col selection:bg-[#D4AF37] selection:text-neutral-950 relative overflow-x-hidden">
      {/* Immersive UI Ambient Glowing Backdrops */}
      <div className="fixed top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[550px] h-[550px] bg-[#0E1624]/60 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Global Responsive Navigation Bar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main Animated View Container */}
      <main className="flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          {activeView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <HeroSection />
            </motion.div>
          )}

          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-2 sm:py-6"
            >
              <Dashboard />
            </motion.div>
          )}

          {activeView === 'visualizer' && (
            <motion.div
              key="visualizer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              <div className="mb-6 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#D4AF37]/15 text-[#F6E09E] border border-[#D4AF37]/30 inline-block mb-2">
                  İnteraktiv 3D Memarlıq
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Veyra Home <span className="gold-gradient-text font-serif">Tikinti Mərhələləri</span>
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Torpaq sahəsindən lüks villanın təhvilinə qədər olan 4 mərhələni canlı izləyin.
                </p>
              </div>
              <VeyraHomeVisualizer interactivePreview={true} />
            </motion.div>
          )}

          {activeView === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-6 sm:py-10"
            >
              <VeyraProducts />
            </motion.div>
          )}

          {activeView === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-6 sm:py-10"
            >
              <ProfitCalculator />
            </motion.div>
          )}

          {activeView === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-2 sm:py-6"
            >
              <Dashboard />
            </motion.div>
          )}

          {activeView === 'howItWorks' && (
            <motion.div
              key="howItWorks"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-6 sm:py-10"
            >
              <HowItWorksSection />
            </motion.div>
          )}

          {activeView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-6 sm:py-10"
            >
              <AboutSection />
            </motion.div>
          )}

          {activeView === 'legal' && (
            <motion.div
              key="legal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-6 sm:py-10"
            >
              <LegalSection />
            </motion.div>
          )}

          {activeView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full py-4 sm:py-8"
            >
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <AuthModal />
      <DepositModal />
      <WithdrawalModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
