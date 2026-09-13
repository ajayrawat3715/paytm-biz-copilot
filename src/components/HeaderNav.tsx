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
      <header className="border-b border-line bg-paper/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Store Info */}
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <span className="grid size-9 place-items-center rounded-xl bg-rust font-sans text-lg font-semibold leading-none text-cream shadow-2xs">
              {shop.initial}
            </span>
            <div className="leading-tight">
              <p className="font-sans text-[15px] font-semibold text-ink">
                {t.shopName}
              </p>
              <p className="text-xs text-inksoft">{t.shopArea}</p>
            </div>
          </Link>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-sand/60 p-1 ring-1 ring-line/80">
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
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-rust text-cream shadow-2xs font-semibold"
                      : "text-inksoft hover:text-ink hover:bg-paper/70"
                  )}
                >
                  <Icon className={cn("size-3.5", isActive ? "text-cream" : "text-inksoft")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Voice-to-Ledger Quick Button */}
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rust/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-rust ring-1 ring-rust/30 hover:bg-rust/20 active:scale-95 transition-all shadow-2xs"
            >
              <Mic className="size-3.5 text-rust animate-pulse" />
              <span>{t.voiceLedgerBtn}</span>
            </button>

            {/* Evening Dukan Bandi (Day Close) Button */}
            <button
              type="button"
              onClick={() => setDukanBandiModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-ink px-3 py-1.5 text-xs sm:text-sm font-medium text-warning-light ring-1 ring-line hover:bg-ink/90 active:scale-95 transition-all shadow-2xs"
            >
              <Moon className="size-3.5 text-warning" />
              <span>{t.dukanBandiBtn}</span>
            </button>

            {/* Paytm Loyalty Club Button */}
            <button
              type="button"
              onClick={() => setLoyaltyModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-emerald-light px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald ring-1 ring-emerald/30 hover:bg-emerald-light/80 active:scale-95 transition-all shadow-2xs"
            >
              <Award className="size-3.5 text-emerald" />
              <span>{t.loyaltyBtn}</span>
            </button>

            {/* Business Memory Button */}
            <button
              type="button"
              onClick={() => setMemoryDialogOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-sand/80 px-3 py-1.5 text-xs sm:text-sm font-medium text-ink ring-1 ring-line hover:bg-paper transition-colors"
            >
              <Brain className="size-3.5 text-rust" />
              <span>{t.memoryBadge}</span>
            </button>

            {/* Language Switcher */}
            <LanguageToggle />

            {/* Day / Night Theme Toggle */}
            <ThemeToggle />

            {/* Copilot Active Status */}
            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-inksoft ring-1 ring-line">
              <span className="size-1.5 animate-tick rounded-full bg-emerald" />
              {t.copilotOn}
            </span>

            {/* Shop Owner Avatar */}
            <span className="grid size-9 place-items-center rounded-full bg-sand text-xs font-semibold text-ink ring-1 ring-line">
              {shop.owner[0]}
            </span>
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
