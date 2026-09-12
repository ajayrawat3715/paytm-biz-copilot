import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DynamicUpiQr } from "@/components/DynamicUpiQr";
import { HeaderNav } from "@/components/HeaderNav";
import { useLanguage } from "@/lib/language-context";
import { customerDirectory } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  HeartHandshake,
  MessageSquare,
  QrCode,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Khata & Customer CRM — Bharat Kirana Copilot" },
      {
        name: "description",
        content:
          "Digital Kirana Bahi-Khata ledger, AI customer credit risk segmentation, dynamic scannable UPI QR codes, and polite WhatsApp payment reminders.",
      },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<"all" | "overdue" | "regular" | "inactive">("overdue");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQrId, setActiveQrId] = useState<string | null>(null);
  const [remindedMap, setRemindedMap] = useState<Record<string, boolean>>({});

  const filteredCustomers = customerDirectory.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.items.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "overdue") return matchesSearch && cust.status === "overdue";
    if (activeTab === "regular") return matchesSearch && cust.status === "regular";
    if (activeTab === "inactive") return matchesSearch && cust.status === "inactive";
    return matchesSearch;
  });

  const handleSendReminder = (id: string) => {
    setRemindedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-cream text-ink pb-28 md:pb-16">
      <HeaderNav />

      <main className="mx-auto max-w-[1180px] px-4 sm:px-7 pt-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rust/15 px-2.5 py-0.5 text-xs font-bold text-rust">
                {isHindi ? "डिजिटल बही-खाता व ग्राहक संबंध" : "Digital Ledger & CRM"}
              </span>
              <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-xs font-semibold text-emerald">
                {isHindi ? "84% समय पर वसूली दर" : "84% On-Time Recovery Rate"}
              </span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl font-bold text-ink sm:text-3xl">
              {t.khataPageTitle}
            </h1>
            <p className="mt-1 text-sm text-inksoft">
              {t.khataPageSub}
            </p>
          </div>

          <div className="rounded-xl bg-paper px-3.5 py-2 ring-1 ring-line text-xs font-semibold text-ink flex items-center gap-2">
            <HeartHandshake className="size-4 text-rust" />
            <span>{isHindi ? "विनम्र भाषा: संबंध सुरक्षा" : "Polite Tone: Relationship First"}</span>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "कुल बकाया उधार" : "Total Credit Outstanding"}</span>
              <Wallet className="size-4 text-inksoft" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">₹12,840</p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi ? "16 सक्रिय बही-खाता खाते" : "Across 16 open khatas"}
            </p>
          </div>

          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "अतिदेय (Overdue) राशि" : "Overdue Bucket"}</span>
              <ShieldAlert className="size-4 text-red-500" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-red-600">₹2,800</p>
            <p className="mt-1 text-[11px] text-red-600 font-semibold">
              {isHindi ? "5 ग्राहकों पर अति ध्यान आवश्यक" : "5 customers overdue > 7 days"}
            </p>
          </div>

          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "नियमित ग्राहक" : "Active Regulars"}</span>
              <Users className="size-4 text-emerald" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">45 {isHindi ? "ग्राहक" : "Merchants"}</p>
            <p className="mt-1 text-[11px] text-emerald font-semibold">
              {isHindi ? "साप्ताहिक 3.8 बार खरीदारी" : "3.8 visits/week average"}
            </p>
          </div>

          <div className="rounded-[18px] bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "सुप्त (Inactive) ग्राहक" : "Inactive Cohort"}</span>
              <Clock className="size-4 text-amber-500" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">240 {isHindi ? "ग्राहक" : "Accounts"}</p>
            <p className="mt-1 text-[11px] text-rust font-semibold">
              {isHindi ? "10% ऑफर से ₹6,100 अवसर" : "Target 10% offer for ₹6.1k sales"}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-inksoft" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHindi ? "ग्राहक का नाम, मोबाइल नंबर या खरीदा गया सामान खोजें…" : "Search customer, phone, or items taken…"}
              className="w-full rounded-full bg-paper pl-10 pr-4 py-2 text-xs text-ink placeholder:text-inksoft ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-rust"
            />
          </div>

          <div className="flex items-center gap-1 rounded-full bg-sand/60 p-1 ring-1 ring-line">
            <button
              type="button"
              onClick={() => setActiveTab("overdue")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                activeTab === "overdue" ? "bg-red-500 text-white shadow-sm" : "text-inksoft hover:text-ink"
              )}
            >
              {isHindi ? "⚠️ अतिदेय उधार (5)" : "⚠️ Overdue (5)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("regular")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                activeTab === "regular" ? "bg-emerald text-white shadow-sm" : "text-inksoft hover:text-ink"
              )}
            >
              {isHindi ? "🟢 नियमित (45)" : "🟢 Regulars (45)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("inactive")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                activeTab === "inactive" ? "bg-rust text-cream shadow-sm" : "text-inksoft hover:text-ink"
              )}
            >
              {isHindi ? "💤 सुप्त ग्राहक (240)" : "💤 Inactive (240)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                activeTab === "all" ? "bg-paper text-ink shadow-sm" : "text-inksoft hover:text-ink"
              )}
            >
              {isHindi ? "सभी खाते" : "All (285)"}
            </button>
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredCustomers.map((cust) => {
            const isOverdue = cust.status === "overdue";
            const isInactive = cust.status === "inactive";
            const isQrOpen = activeQrId === cust.id;
            const isReminded = remindedMap[cust.id];

            return (
              <div
                key={cust.id}
                className={cn(
                  "rounded-[20px] bg-paper p-5 ring-1 transition-all shadow-sm",
                  isOverdue ? "ring-red-300 bg-red-50/10" : "ring-line"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold text-ink">{cust.name}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider",
                          cust.riskLevel === "high"
                            ? "bg-red-100 text-red-700"
                            : cust.riskLevel === "moderate"
                            ? "bg-amber-100 text-amber-800"
                            : cust.riskLevel === "opportunity"
                            ? "bg-rust/15 text-rust"
                            : "bg-emerald/15 text-emerald"
                        )}
                      >
                        {cust.riskLevel === "high"
                          ? (isHindi ? "अति ध्यान" : "High Attention")
                          : cust.riskLevel === "moderate"
                          ? (isHindi ? "मध्यम" : "Moderate")
                          : cust.riskLevel === "opportunity"
                          ? (isHindi ? "संभावित अवसर" : "Growth Opportunity")
                          : (isHindi ? "सुरक्षित" : "Low Risk")}
                      </span>
                    </div>
                    <p className="text-xs text-inksoft font-mono mt-0.5">{cust.phone}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-ink">
                      {isInactive ? "₹6,100 Exp" : `₹${cust.balance.toLocaleString("en-IN")}`}
                    </p>
                    <p className="text-[10px] text-inksoft">
                      {isOverdue ? `${cust.daysOverdue} ${isHindi ? "दिन लेट" : "days overdue"}` : cust.lastPurchase}
                    </p>
                  </div>
                </div>

                {/* Ledger Items Note */}
                <div className="mt-3 rounded-xl bg-sand/40 p-3 text-xs text-ink ring-1 ring-line/60">
                  <p className="text-[11px] text-inksoft font-semibold">
                    {isHindi ? "खाते में दर्ज सामान:" : "Items Taken on Khata:"}
                  </p>
                  <p className="mt-0.5 text-xs text-ink font-medium">{cust.items}</p>
                </div>

                {/* Interactive Action Row */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
                  <div className="flex items-center gap-2">
                    {/* QR Code Toggle */}
                    {cust.balance > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveQrId(isQrOpen ? null : cust.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-line hover:bg-paper transition-all"
                      >
                        <QrCode className="size-3.5 text-rust" />
                        <span>{isQrOpen ? (isHindi ? "क्यूआर छिपाएं" : "Hide QR") : (isHindi ? "पेटीएम क्यूआर" : "Paytm QR")}</span>
                      </button>
                    )}
                  </div>

                  {/* Send Reminder Action */}
                  <div>
                    {isReminded ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald">
                        <CheckCircle2 className="size-3.5" />
                        <span>{isHindi ? "रिमाइंडर भेजा गया" : "Reminder Sent"}</span>
                      </span>
                    ) : isOverdue ? (
                      <button
                        type="button"
                        onClick={() => handleSendReminder(cust.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#20bd5a] active:scale-95 transition-all"
                      >
                        <MessageSquare className="size-3.5" />
                        <span>{isHindi ? "विनम्र व्हाट्सएप भेजें" : "Polite WhatsApp"}</span>
                      </button>
                    ) : isInactive ? (
                      <button
                        type="button"
                        onClick={() => handleSendReminder(cust.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-rust px-3.5 py-1.5 text-xs font-bold text-cream shadow-sm hover:bg-rust/90 active:scale-95 transition-all"
                      >
                        <Sparkles className="size-3.5" />
                        <span>{isHindi ? "10% ऑफर भेजें" : "Send 10% Offer"}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald font-semibold">
                        ✓ {isHindi ? "खाता अद्यतन है" : "Account Up to Date"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Scannable Dynamic UPI QR Popup */}
                {isQrOpen && cust.balance > 0 && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <DynamicUpiQr
                      amount={cust.balance}
                      customerName={cust.name}
                      onClose={() => setActiveQrId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Khata Relationship Philosophy */}
        <section className="mt-8 rounded-[20px] bg-sand/40 p-5 ring-1 ring-line">
          <div className="flex items-center gap-2">
            <HeartHandshake className="size-5 text-rust" />
            <h3 className="font-display text-base font-bold text-ink">
              {isHindi ? "भारत की बही-खाता नीति: 'संबंध पहले, उधारी वसूली साथ-साथ'" : "Bharat Kirana Credit Philosophy: Relationships First"}
            </h3>
          </div>
          <p className="mt-2 text-xs text-inksoft leading-relaxed">
            {isHindi
              ? "भारतीय किराना व्यापार भरोसे पर चलता है। भारत कभी भी कठोर या धमकी भरे तगादे नहीं भेजता। हमारे सभी व्हाट्सएप संदेश अत्यंत आदरपूर्ण, विनम्र और सीधे पेटीएम यूपीआई भुगतान लिंक के साथ होते हैं, जिससे 84% ग्राहक बिना किसी मनमुटाव के तुरंत भुगतान कर देते हैं।"
              : "Indian Kirana credit relies on deep local trust. Bharat rejects harsh collection notices. Every WhatsApp template is crafted with cultural respect and a 1-click Paytm UPI payment link, resulting in an 84% recovery rate while preserving neighborly goodwill."}
          </p>
        </section>
      </main>
    </div>
  );
}
