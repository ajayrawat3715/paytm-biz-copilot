import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BusinessMemoryDialog } from "@/components/BusinessMemoryDialog";
import { EveningReconciliationModal } from "@/components/EveningReconciliationModal";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PaytmLoyaltyModal } from "@/components/PaytmLoyaltyModal";
import { VoiceToLedgerModal } from "@/components/VoiceToLedgerModal";
import { shop } from "@/lib/khata";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  Brain,
  Home,
  Mic,
  Moon,
  Package,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function HeaderNav() {
  const { language } = useLanguage();
  const t = translations[language];
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [dukanBandiModalOpen, setDukanBandiModalOpen] = useState(false);
  const [loyaltyModalOpen, setLoyaltyModalOpen] = useState(false);

  // Get current pathname
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    {
      to: "/",
      label: t.navToday || "Today",
      icon: Home,
      exact: true,
    },
    {
      to: "/analytics",
      label: t.navPulse || "Paytm Pulse",
      icon: TrendingUp,
    },
    {
      to: "/inventory",
      label: t.navInventory || "Inventory",
      icon: Package,
    },
    {
      to: "/customers",
      label: t.navKhata || "Khata & CRM",
      icon: BookOpen,
    },
    {
      to: "/campaigns",
      label: t.navCampaigns || "Campaigns",
      icon: Sparkles,
    },
  ];

  return (
    <>
      <header className="border-b border-line bg-paper/90 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        {/* Top Product Bar */}
        <div className="mx-auto max-w-[1440px] px-4 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Store Info */}
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <span className="grid size-9 place-items-center rounded-xl bg-rust font-sans text-base font-bold leading-none text-white shadow-2xs">
              {shop.initial}
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <p className="font-sans text-[15px] font-bold text-ink">
                  {t.shopName}
                </p>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-sand px-2 py-0.5 text-[10px] font-semibold text-inksoft ring-1 ring-line">
                  {shop.area}
                </span>
              </div>
              <p className="text-[11px] text-inksoft">
                {language === "hi" ? "किराना कोपायलट प्लेटफॉर्म" : "Kirana Copilot Platform"}
              </p>
            </div>
          </Link>

          {/* Quick Action Triggers & System Status */}
          <div className="flex items-center gap-2">
            {/* Copilot Active Status Badge */}
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-light/60 px-2.5 py-1 text-xs font-semibold text-emerald ring-1 ring-emerald/25">
              <span className="size-1.5 animate-tick rounded-full bg-emerald" />
              <span>{language === "hi" ? "कोपायलट सक्रिय · पेटीएम एआई" : "Copilot Active · Paytm AI"}</span>
            </span>

            {/* Voice-to-Ledger Quick Button */}
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rust/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-rust ring-1 ring-rust/30 hover:bg-rust/20 active:scale-95 transition-all"
            >
              <Mic className="size-3.5 text-rust animate-pulse" />
              <span>{t.voiceLedgerBtn}</span>
            </button>

            {/* Evening Dukan Bandi (Day Close) Button */}
            <button
              type="button"
              onClick={() => setDukanBandiModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-paper px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink ring-1 ring-line hover:bg-sand/40 active:scale-95 transition-all"
            >
              <Moon className="size-3.5 text-warning" />
              <span>{t.dukanBandiBtn}</span>
            </button>

            {/* Paytm Loyalty Club Button */}
            <button
              type="button"
              onClick={() => setLoyaltyModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-emerald-light px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald ring-1 ring-emerald/30 hover:bg-emerald-light/80 active:scale-95 transition-all"
            >
              <Award className="size-3.5 text-emerald" />
              <span>{t.loyaltyBtn}</span>
            </button>

            {/* Business Memory Button */}
            <button
              type="button"
              onClick={() => setMemoryDialogOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-sand/60 px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink ring-1 ring-line hover:bg-paper transition-colors"
            >
              <Brain className="size-3.5 text-rust" />
              <span>{t.memoryBadge}</span>
            </button>

            {/* Language Switcher */}
            <LanguageToggle />

            {/* Day / Night Theme Toggle */}
            <ThemeToggle />

            {/* Shop Owner Avatar */}
            <span className="grid size-8 place-items-center rounded-full bg-sand text-xs font-bold text-ink ring-1 ring-line">
              {shop.owner[0]}
            </span>
          </div>
        </div>

        {/* Clean Horizontal Fintech Navigation Bar (Desktop) */}
        <div className="border-t border-line/70 bg-paper">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-7">
            <nav className="hidden md:flex items-center gap-6 overflow-x-auto py-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? currentPath === item.to
                  : currentPath.startsWith(item.to);
                const isPulse = item.to === "/analytics";

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "group flex items-center gap-2 py-3 text-sm transition-all border-b-2 font-medium tracking-tight",
                      isActive
                        ? isPulse
                          ? "border-paytm text-paytm font-bold"
                          : "border-rust text-rust font-bold"
                        : "border-transparent text-inksoft hover:text-ink hover:border-line"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 transition-colors",
                        isActive
                          ? isPulse
                            ? "text-paytm"
                            : "text-rust"
                          : "text-inksoft group-hover:text-ink"
                      )}
                    />
                    <span>{item.label}</span>
                    {isPulse && (
                      <span className="ml-0.5 rounded-full bg-[#00BAF2]/15 px-1.5 py-0.2 text-[10px] font-bold text-[#00BAF2]">
                        Paytm
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-paper/95 px-1 py-1.5 backdrop-blur-md md:hidden shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? currentPath === item.to
            : currentPath.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 text-[10px] font-semibold transition-all",
                isActive ? "text-rust font-bold" : "text-inksoft hover:text-ink"
              )}
            >
              <div
                className={cn(
                  "grid size-7 place-items-center rounded-lg transition-colors",
                  isActive ? "bg-rust/10 text-rust" : "text-inksoft"
                )}
              >
                <Icon className="size-4" />
              </div>
              <span className="truncate max-w-[62px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Persistent Business Memory Dialog */}
      <BusinessMemoryDialog
        open={memoryDialogOpen}
        onOpenChange={setMemoryDialogOpen}
      />

      {/* Voice-to-Ledger Modal */}
      <VoiceToLedgerModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
      />

      {/* Evening Dukan Bandi Reconciliation Modal */}
      <EveningReconciliationModal
        open={dukanBandiModalOpen}
        onOpenChange={setDukanBandiModalOpen}
      />

      {/* Paytm Soundbox Smart Loyalty Club Modal */}
      <PaytmLoyaltyModal
        open={loyaltyModalOpen}
        onOpenChange={setLoyaltyModalOpen}
      />
    </>
  );
}
