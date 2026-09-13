import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AIExplanationDialog } from "@/components/AIExplanationDialog";
import { BahiKhata } from "@/components/BahiKhata";
import { BasketBoosterWidget } from "@/components/BasketBoosterWidget";
import { BharatAutopilotModal } from "@/components/BharatAutopilotModal";
import { BusinessHealth } from "@/components/BusinessHealth";
import { BusinessMemoryDialog } from "@/components/BusinessMemoryDialog";
import { CampaignSimulationModal } from "@/components/CampaignSimulationModal";
import { CopilotChat } from "@/components/CopilotChat";
import { DailyActionPlan } from "@/components/DailyActionPlan";
import { DemoTourBar } from "@/components/DemoTourBar";
import { HeaderNav } from "@/components/HeaderNav";
import { InventoryOrderModal } from "@/components/InventoryOrderModal";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MerchantOffersBanner } from "@/components/MerchantOffersBanner";
import { MorningBrief } from "@/components/MorningBrief";
import { OpportunityRadar } from "@/components/OpportunityRadar";
import { PaytmInsights } from "@/components/PaytmInsights";
import { SoundboxWidget } from "@/components/SoundboxWidget";
import { MerchantRoiCard } from "@/components/MerchantRoiCard";
import { UdhaarAISection } from "@/components/UdhaarAISection";
import { WorthDoingToday } from "@/components/WorthDoingToday";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  balanceOf,
  dailyCash,
  formatDay,
  glance,
  istToday,
  rupees,
  shop,
  statusLabel,
} from "@/lib/khata";
import { LanguageProvider, useLanguage } from "@/lib/language-context";
import type { WorthDoingItem } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { useKhata } from "@/lib/use-khata";
import { Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharat — AI Copilot for Kirana Stores (Paytm Hackathon)" },
      {
        name: "description",
        content:
          "An AI copilot for Indian shopkeepers: daily sales, Paytm/UPI payment behavior, inventory reordering, udhar recovery, and growth simulations.",
      },
      {
        property: "og:title",
        content: "Bharat — AI Copilot for Kirana Stores",
      },
      {
        property: "og:description",
        content:
          "AI business partner for Paytm merchants: sales forecast, campaign simulations, inventory intelligence, and udhaar recovery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const khata = useKhata();
  const { entries, totals } = khata;
  const [done, setDone] = useState<Record<string, string>>({});
  const [chatOpen, setChatOpen] = useState(false);

  // Modals for hackathon interactive workflows
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [udhaarReminderOpen, setUdhaarReminderOpen] = useState(false);
  const [autopilotModalOpen, setAutopilotModalOpen] = useState(false);
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  const [explainContext, setExplainContext] = useState<string | null>(null);

  const shopContext = useMemo(() => {
    const lines = entries
      .map(
        (e) =>
          `- ${e.customer} (${e.phone}): took ${e.items} for ${rupees(e.amount)} on ${formatDay(e.soldOn)}, due ${formatDay(e.dueOn)}, balance ${rupees(balanceOf(e))}, status ${statusLabel(e)}`,
      )
      .join("\n");
    return [
      `Shop: ${shop.name}, ${shop.area}. Owner: ${shop.owner}. Date: ${formatDay(istToday())} (IST).`,
      `Cash sales today: ${rupees(totals.cashSales)} (usual by now ${rupees(dailyCash.usualSales)}).`,
      `Paytm/UPI payments today: ₹12,840 across 126 transactions.`,
      `Total credit outstanding: ${rupees(totals.outstanding)} across ${totals.openCount} open khatas; ${rupees(totals.overdueAmount)} overdue across ${totals.overdueCount} customers.`,
      `Overdue bucket: ₹${totals.overdueAmount} across ${totals.overdueCount} critical customers.`,
      `Stock alert: ${totals.totalStockoutItems > 0 ? "Parle biscuits 0 units (supplier: Sharma Distributors)" : "Inventory healthy"}.`,
      `Inactive customers: 240 lapsed accounts (target 10% offer for ₹6,100 sales).`,
      `Udhar ledger:\n${lines}`,
    ].join("\n");
  }, [entries, totals]);

  const handleTriggerAction = (item: WorthDoingItem) => {
    if (item.actionType === "campaign") {
      setCampaignModalOpen(true);
    } else if (item.actionType === "inventory") {
      setInventoryModalOpen(true);
    } else if (item.actionType === "udhaar") {
      setUdhaarReminderOpen(true);
    }
  };

  const handleStepClick = (stepId: string) => {
    switch (stepId) {
      case "step-forecast":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "step-radar":
        document
          .getElementById("opportunity-radar-section")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "step-whatif":
        setCampaignModalOpen(true);
        break;
      case "step-autopilot":
        setAutopilotModalOpen(true);
        break;
      case "step-memory":
        setMemoryDialogOpen(true);
        break;
      case "step-paytm":
        document
          .getElementById("paytm-insights-section")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "step-udhaar":
        setUdhaarReminderOpen(true);
        break;
      default:
        break;
    }
  };

  const handleChatTrigger = (type: "campaign" | "inventory" | "udhaar") => {
    if (type === "campaign") setCampaignModalOpen(true);
    else if (type === "inventory") setInventoryModalOpen(true);
    else if (type === "udhaar") setUdhaarReminderOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Pitch Navigator Bar for Hackathon Presentation */}
      <DemoTourBar onStepClick={handleStepClick} />

      {/* Unified Multi-Page Header Navigation */}
      <HeaderNav />

      <div className="mx-auto flex min-h-screen max-w-[1180px] flex-col lg:flex-row">
        <main className="flex-1 px-4 pb-32 pt-4 sm:px-7 lg:pb-12">
          {/* Merchant Schemes & Current Offers Carousel Banner */}
          <MerchantOffersBanner />

          {/* 1. Upgraded Morning Brief & Forecast */}
          <MorningBrief
            collectedToday={dailyCash.cashSales + totals.udharCollectedToday}
            onOpenCampaign={() => setCampaignModalOpen(true)}
            onOpenInventory={() => setInventoryModalOpen(true)}
            onOpenUdhaar={() => setUdhaarReminderOpen(true)}
            onReviewAll={() => setAutopilotModalOpen(true)}
          />

          {/* Paytm Soundbox 4.0 Smart Voice Briefing & Chime */}
          <SoundboxWidget />

          {/* FEATURE 1: BHARAT OPPORTUNITY RADAR */}
          <OpportunityRadar
            onOpenCampaign={() => setCampaignModalOpen(true)}
            onOpenInventory={() => setInventoryModalOpen(true)}
            onOpenUdhaar={() => setUdhaarReminderOpen(true)}
            onExplain={(title) => setExplainContext(title)}
          />

          {/* FEATURE 2: TODAY'S ACTION PLAN */}
          <DailyActionPlan
            onOpenCampaign={() => setCampaignModalOpen(true)}
            onOpenInventory={() => setInventoryModalOpen(true)}
            onOpenUdhaar={() => setUdhaarReminderOpen(true)}
            onReviewAllActions={() => setAutopilotModalOpen(true)}
            onExplain={(title) => setExplainContext(title)}
          />

          {/* Existing "Worth Doing Today" Detailed AI Cards */}
          <WorthDoingToday
            done={done}
            onTriggerAction={handleTriggerAction}
            onSetAside={(id) =>
              setDone((d) => ({ ...d, [id]: "Set aside for now." }))
            }
          />

          {/* Merchant ROI Impact Card */}
          <MerchantRoiCard />

          {/* Smart Basket Booster & Counter Upsell Engine */}
          <BasketBoosterWidget />

          {/* 5. Paytm / UPI Business Insights Section */}
          <div id="paytm-insights-section">
            <PaytmInsights
              onTriggerCampaign={() => setCampaignModalOpen(true)}
            />
          </div>

          {/* 6. Udhaar AI Intelligence Section */}
          <UdhaarAISection
            isOpenExternal={udhaarReminderOpen}
            onCloseExternal={() => setUdhaarReminderOpen(false)}
            onSuccessReminder={(msg) =>
              setDone((d) => ({ ...d, "udhaar-card": msg }))
            }
          />

          {/* Existing Bahi-Khata Ledger Component */}
          <BahiKhata khata={khata} />

          {/* 11. Business Health Section */}
          <BusinessHealth />

          {/* Existing At a Glance Strip */}
          <section className="mt-8 animate-settle">
            <h2 className="font-display text-xl font-semibold text-ink">
              {isHindi ? "एक नज़र में" : "At a glance"}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {glance.map((g) => (
                <div
                  key={g.label}
                  className="rounded-[16px] bg-paper p-4 ring-1 ring-line"
                >
                  <p className="text-xs text-inksoft">
                    {isHindi && g.label === "Repeat customers"
                      ? "पुराने ग्राहक"
                      : isHindi && g.label === "Top category"
                      ? "शीर्ष श्रेणी"
                      : isHindi && g.label === "Low stock"
                      ? "कम स्टॉक"
                      : g.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold">
                    {g.value}
                    {g.suffix && (
                      <small className="text-base text-inksoft">{g.suffix}</small>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-inksoft">
                    {isHindi && g.note === "of this week's spend"
                      ? "साप्ताहिक बिक्री का"
                      : isHindi && g.note === "₹4,200 today"
                      ? "आज ₹4,200"
                      : isHindi && g.note === "biscuits, oil, masala"
                      ? "बिस्कुट, तेल, मसाला"
                      : g.note}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 9 & 10. Intelligent Right-Side Bharat Copilot Chat Panel */}
        <aside className="sticky top-0 hidden h-screen w-[360px] shrink-0 flex-col border-l border-line bg-sand/30 lg:flex">
          <CopilotChat
            shopContext={shopContext}
            onTriggerModal={handleChatTrigger}
            className="h-full"
          />
        </aside>
      </div>

      {/* Mobile Floating Bar for Bharat Chat */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-sand/90 px-3 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="mx-auto flex w-full max-w-[1180px] items-center gap-2"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-cream">
            भ
          </span>
          <span className="flex flex-1 items-center gap-2 rounded-full bg-paper px-4 py-2.5 ring-1 ring-line">
            <span className="text-sm text-inksoft/70">
              {t.mobileAskBar}
            </span>
            <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-rust text-sm text-cream">
              →
            </span>
          </span>
        </button>
      </div>

      {/* Mobile Bottom Sheet for Bharat Chat */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] gap-0 border-line bg-sand/40 p-0"
        >
          <SheetTitle className="sr-only">Ask Bharat</SheetTitle>
          <CopilotChat
            shopContext={shopContext}
            onTriggerModal={(type) => {
              setChatOpen(false);
              handleChatTrigger(type);
            }}
            className="h-full"
          />
        </SheetContent>
      </Sheet>

      {/* FEATURE 3: BHARAT AUTOPILOT MODAL */}
      <BharatAutopilotModal
        open={autopilotModalOpen}
        onOpenChange={setAutopilotModalOpen}
        onApprovedSuccess={(summary) =>
          setDone((d) => ({
            ...d,
            "campaign-card": "10% offer scheduled for 240 inactive customers (4 PM – 8 PM).",
            "inventory-card": "Purchase order for 24 units dispatched to Sharma Distributors.",
            "udhaar-card": "5 friendly reminders sent via WhatsApp with UPI payment link.",
          }))
        }
      />

      {/* FEATURE 6: BHARAT BUSINESS MEMORY DIALOG */}
      <BusinessMemoryDialog
        open={memoryDialogOpen}
        onOpenChange={setMemoryDialogOpen}
      />

      {/* FEATURE 4: AI EXPLANATION & TRUST MODAL */}
      <AIExplanationDialog
        open={Boolean(explainContext)}
        onOpenChange={(open) => !open && setExplainContext(null)}
        contextTitle={explainContext ?? undefined}
      />

      {/* 3 & FEATURE 5: AI Campaign Simulation Modal with Enhanced What-If */}
      <CampaignSimulationModal
        open={campaignModalOpen}
        onOpenChange={setCampaignModalOpen}
        onSuccess={(summary) =>
          setDone((d) => ({ ...d, "campaign-card": summary }))
        }
      />

      {/* 7. Inventory Order Modal for Sharma Distributors */}
      <InventoryOrderModal
        open={inventoryModalOpen}
        onOpenChange={setInventoryModalOpen}
        onSuccessOrder={(summary) =>
          setDone((d) => ({ ...d, "inventory-card": summary }))
        }
      />
    </div>
  );
}
