import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DynamicUpiQr } from "@/components/DynamicUpiQr";
import { HeaderNav } from "@/components/HeaderNav";
import { useKiranaData, type CustomerRecord } from "@/lib/kirana-context";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  ExternalLink,
  HeartHandshake,
  MessageSquare,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
  X,
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

  const {
    customers,
    totals,
    recordCustomerRepayment,
    addCustomerUdhar,
    sendCustomerReminder,
    resetToDefault,
  } = useKiranaData();

  const [activeTab, setActiveTab] = useState<"all" | "overdue" | "regular" | "inactive">("overdue");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQrId, setActiveQrId] = useState<string | null>(null);

  // Modals state
  const [repayModalCust, setRepayModalCust] = useState<CustomerRecord | null>(null);
  const [repayAmount, setRepayAmount] = useState<string>("");
  const [repaySuccess, setRepaySuccess] = useState<boolean>(false);

  const [newUdharOpen, setNewUdharOpen] = useState(false);
  const [udharName, setUdharName] = useState("");
  const [udharPhone, setUdharPhone] = useState("");
  const [udharAmount, setUdharAmount] = useState("");
  const [udharItems, setUdharItems] = useState("");
  const [udharSuccess, setUdharSuccess] = useState(false);

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.items.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "overdue") return matchesSearch && cust.status === "overdue" && cust.balance > 0;
    if (activeTab === "regular") return matchesSearch && cust.status === "regular";
    if (activeTab === "inactive") return matchesSearch && cust.status === "inactive";
    return matchesSearch;
  });

  const handleOpenRepayModal = (cust: CustomerRecord) => {
    setRepayModalCust(cust);
    setRepayAmount(cust.balance.toString());
    setRepaySuccess(false);
  };

  const handleConfirmRepayment = () => {
    if (!repayModalCust) return;
    const amt = parseFloat(repayAmount);
    if (isNaN(amt) || amt <= 0) return;

    recordCustomerRepayment(repayModalCust.id, amt);
    setRepaySuccess(true);
    setTimeout(() => {
      setRepayModalCust(null);
      setRepaySuccess(false);
    }, 800);
  };

  const handleCreateUdhar = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(udharAmount);
    if (!udharName || isNaN(amt) || amt <= 0) return;

    addCustomerUdhar(udharName.trim(), udharPhone.trim(), amt, udharItems.trim() || "Daily groceries", 7);
    setUdharSuccess(true);
    setTimeout(() => {
      setNewUdharOpen(false);
      setUdharSuccess(false);
      setUdharName("");
      setUdharPhone("");
      setUdharAmount("");
      setUdharItems("");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-cream text-ink bg-blueprint-grid pb-28 md:pb-16">
      <HeaderNav />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-7 pt-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rust-light px-2.5 py-0.5 text-xs font-semibold text-rust">
                {isHindi ? "डिजिटल बही-खाता व ग्राहक संबंध" : "Digital Ledger & CRM"}
              </span>
              <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald">
                {isHindi ? "84% समय पर वसूली दर" : "84% On-Time Recovery Rate"}
              </span>
            </div>
            <h1 className="mt-2 font-sans text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-ink">
              {t.khataPageTitle}
            </h1>
            <p className="mt-1 text-sm text-inksoft">
              {t.khataPageSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setNewUdharOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rust px-4 py-2 text-xs font-semibold text-cream shadow-2xs hover:bg-rust/95 active:scale-95 transition-all"
            >
              <Plus className="size-4" />
              <span>{isHindi ? "+ नया उधार लिखें" : "+ Add New Udhaar"}</span>
            </button>

            <button
              type="button"
              onClick={resetToDefault}
              title={isHindi ? "डेटा को प्रारंभिक स्थिति में लाएं" : "Reset data to default"}
              className="rounded-xl bg-sand p-2 text-inksoft hover:text-ink hover:bg-sand/80 ring-1 ring-line transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Top Bharat AI Credit Insight Banner */}
        <div className="mt-6 rounded-2xl bg-paper p-5 ring-1 ring-rust/35 border-l-4 border-l-rust shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid size-8 place-items-center rounded-xl bg-rust/10 text-rust shrink-0 mt-0.5">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rust">
                  {isHindi ? "✦ भारत उधार इनसाइट" : "✦ BHARAT CREDIT INTELLIGENCE"}
                </p>
                <p className="mt-1 font-sans text-sm sm:text-base font-semibold text-ink leading-snug">
                  {isHindi
                    ? "5 ग्राहकों में कुल ₹2,800 अतिदेय (overdue) है। भारत पिछले भुगतान व्यवहार को देखते हुए राजेश कुमार और सुनीता देवी को पहले याद दिलाने की अनुशंसा करता है।"
                    : "₹2,800 is overdue across 5 customers. Bharat recommends reminding Rajesh Kumar & Sunita Devi because of their previous payment behavior."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("overdue");
                setSearchTerm("");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rust px-4 py-2 text-xs font-semibold text-cream shadow-2xs hover:bg-rust/95 active:scale-95 transition-all shrink-0"
            >
              <span>{isHindi ? "रिमाइंडर समीक्षा करें →" : "Review reminders →"}</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Cards — Live Synced */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "कुल बकाया उधार" : "Total Credit Outstanding"}</span>
              <Wallet className="size-4 text-inksoft" />
            </div>
            <p className="mt-2 font-sans text-2xl sm:text-[28px] font-bold text-ink tabular-nums tracking-[-0.02em]">
              ₹{totals.outstanding.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {isHindi ? "लाइव बही-खाता से सिंक" : "Synced with live ledger"}
            </p>
          </div>

          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line border-l-[3px] border-l-rust shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "अतिदेय (Overdue) राशि" : "Overdue Bucket"}</span>
              <ShieldAlert className="size-4 text-rust" />
            </div>
            <p className="mt-2 font-sans text-2xl sm:text-[28px] font-bold text-rust tabular-nums tracking-[-0.02em]">
              ₹{totals.overdueAmount.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[11px] text-rust font-semibold">
              {totals.overdueCount} {isHindi ? "ग्राहकों पर अति ध्यान आवश्यक" : "customers overdue"}
            </p>
          </div>

          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "आज की वसूली" : "Collected Today"}</span>
              <Coins className="size-4 text-emerald" />
            </div>
            <p className="mt-2 font-sans text-2xl sm:text-[28px] font-bold text-emerald tabular-nums tracking-[-0.02em]">
              ₹{totals.udharCollectedToday.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[11px] text-emerald font-semibold">
              {isHindi ? "पेटीएम यूपीआई व नकद वसूली" : "UPI & Cash settlements"}
            </p>
          </div>

          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">{isHindi ? "सुप्त (Inactive) ग्राहक" : "Inactive Cohort"}</span>
              <Clock className="size-4 text-warning" />
            </div>
            <p className="mt-2 font-sans text-2xl sm:text-[28px] font-bold text-ink tabular-nums tracking-[-0.02em]">240 {isHindi ? "खाते" : "Accounts"}</p>
            <p className="mt-1 text-[11px] text-rust font-semibold">
              {isHindi ? "10% ऑफर से ₹6,100 अवसर" : "Target 10% offer for ₹6.1k sales"}
            </p>
          </div>
        </div>

        {/* Tab Filters & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center rounded-2xl bg-paper p-1 ring-1 ring-line">
            <button
              type="button"
              onClick={() => setActiveTab("overdue")}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                activeTab === "overdue"
                  ? "bg-rust text-cream shadow-2xs"
                  : "text-inksoft hover:text-ink",
              )}
            >
              {isHindi ? "⚠️ अतिदेय उधार" : "⚠️ Overdue"} ({totals.overdueCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("regular")}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                activeTab === "regular"
                  ? "bg-emerald text-white shadow-xs"
                  : "text-inksoft hover:text-ink",
              )}
            >
              {isHindi ? "🟢 नियमित ग्राहक" : "🟢 Regulars"}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inactive")}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                activeTab === "inactive"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-inksoft hover:text-ink",
              )}
            >
              {isHindi ? "💤 सुप्त ग्राहक" : "💤 Inactive (240)"}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                activeTab === "all"
                  ? "bg-ink text-cream shadow-xs"
                  : "text-inksoft hover:text-ink",
              )}
            >
              {isHindi ? "सभी ग्राहक" : "All Directory"} ({customers.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-inksoft" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHindi ? "ग्राहक, फोन या सामान खोजें..." : "Search name, phone, item..."}
              className="w-full rounded-2xl bg-paper py-2 pl-9 pr-3 text-xs text-ink outline-none ring-1 ring-line focus:ring-rust"
            />
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {filteredCustomers.map((cust) => {
            const isOverdue = cust.status === "overdue" && cust.balance > 0;
            const isInactive = cust.status === "inactive";
            const isQrOpen = activeQrId === cust.id;
            const isReminded = cust.reminded;

            return (
              <div
                key={cust.id}
                className={cn(
                  "rounded-2xl bg-paper p-5 ring-1 transition-all shadow-2xs",
                  isOverdue ? "ring-warning/35 border-l-4 border-l-warning" : "ring-line",
                )}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans text-base font-bold text-ink">{cust.name}</h3>
                      {cust.riskLevel === "high" && (
                        <span className="rounded-full bg-warning-light px-2 py-0.5 text-[10px] font-bold text-warning ring-1 ring-warning/30">
                          {isHindi ? "उच्च ध्यान" : "High Attention"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-inksoft font-mono mt-0.5">{cust.phone}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-sans text-lg font-bold text-ink tabular-nums">
                      {isInactive ? "₹6,100 Exp" : `₹${cust.balance.toLocaleString("en-IN")}`}
                    </p>
                    <p className="text-[10px] text-inksoft">
                      {isOverdue
                        ? `${cust.daysOverdue} ${isHindi ? "दिन लेट" : "days overdue"}`
                        : cust.lastPurchase}
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
                  <div className="flex items-center gap-1.5">
                    {/* Record Repayment Button */}
                    {cust.balance > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenRepayModal(cust)}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald/15 px-3 py-1.5 text-xs font-semibold text-emerald hover:bg-emerald/25 transition-all shadow-2xs"
                      >
                        <Coins className="size-3.5" />
                        <span>{isHindi ? "पेमेंट लें" : "Repay"}</span>
                      </button>
                    )}

                    {/* QR Code Toggle */}
                    {cust.balance > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveQrId(isQrOpen ? null : cust.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-sand px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-line hover:bg-paper transition-all"
                      >
                        <QrCode className="size-3.5 text-rust" />
                        <span>
                          {isQrOpen
                            ? isHindi
                              ? "बंद करें"
                              : "Close"
                            : isHindi
                            ? "पेटीएम क्यूआर"
                            : "Paytm QR"}
                        </span>
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
                        onClick={() => sendCustomerReminder(cust.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#20bd5a] active:scale-95 transition-all"
                      >
                        <MessageSquare className="size-3.5" />
                        <span>{isHindi ? "विनम्र व्हाट्सएप भेजें" : "Polite WhatsApp"}</span>
                      </button>
                    ) : isInactive ? (
                      <button
                        type="button"
                        onClick={() => sendCustomerReminder(cust.id)}
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
              {isHindi
                ? "भारत की बही-खाता नीति: 'संबंध पहले, उधारी वसूली साथ-साथ'"
                : "Bharat Kirana Credit Philosophy: Relationships First"}
            </h3>
          </div>
          <p className="mt-2 text-xs text-inksoft leading-relaxed">
            {isHindi
              ? "भारतीय किराना व्यापार भरोसे पर चलता है। भारत कभी भी कठोर या धमकी भरे तगादे नहीं भेजता। हमारे सभी व्हाट्सएप संदेश अत्यंत आदरपूर्ण, विनम्र और सीधे पेटीएम यूपीआई भुगतान लिंक के साथ होते हैं, जिससे 84% ग्राहक बिना किसी मनमुटाव के तुरंत भुगतान कर देते हैं।"
              : "Indian Kirana credit relies on deep local trust. Bharat rejects harsh collection notices. Every WhatsApp template is crafted with cultural respect and a 1-click Paytm UPI payment link, resulting in an 84% recovery rate while preserving neighborly goodwill."}
          </p>
        </section>
      </main>

      {/* Repayment Modal */}
      {repayModalCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-paper p-5 shadow-2xl ring-1 ring-line text-ink animate-settle">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald/15 text-emerald">
                  <Coins className="size-4" />
                </span>
                <h3 className="font-display text-base font-bold text-ink">
                  {isHindi ? "उधार वसूली दर्ज करें" : "Record Repayment"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRepayModalCust(null)}
                className="rounded-full p-1 text-inksoft hover:bg-sand hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-inksoft">{isHindi ? "ग्राहक" : "Customer"}</p>
              <p className="font-display text-base font-bold text-ink">{repayModalCust.name}</p>
              <p className="text-xs text-inksoft mt-1">
                {isHindi ? "कुल बकाया:" : "Current Outstanding:"}{" "}
                <span className="font-bold text-red-600">₹{repayModalCust.balance}</span>
              </p>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-ink">
                {isHindi ? "प्राप्त राशि (₹):" : "Received Amount (₹):"}
              </label>
              <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-sand/40 px-3 py-2 text-sm font-bold text-ink outline-none focus:border-emerald"
              />
            </div>

            {repaySuccess && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald animate-settle">
                <Check className="size-4" />
                <span>{isHindi ? "पेमेंट दर्ज! खाता अपडेट हो गया।" : "Repayment recorded & balance updated!"}</span>
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRepayModalCust(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-inksoft hover:bg-sand"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmRepayment}
                className="rounded-xl bg-emerald px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald/90"
              >
                {isHindi ? "✓ दर्ज करें" : "✓ Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Udhaar Modal */}
      {newUdharOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleCreateUdhar}
            className="w-full max-w-sm rounded-[24px] bg-paper p-5 shadow-2xl ring-1 ring-line text-ink animate-settle"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-rust/15 text-rust">
                  <UserPlus className="size-4" />
                </span>
                <h3 className="font-display text-base font-bold text-ink">
                  {isHindi ? "नया उधार लिखें" : "Add New Udhaar"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewUdharOpen(false)}
                className="rounded-full p-1 text-inksoft hover:bg-sand hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink">
                  {isHindi ? "ग्राहक का नाम:" : "Customer Name:"}
                </label>
                <input
                  type="text"
                  required
                  value={udharName}
                  onChange={(e) => setUdharName(e.target.value)}
                  placeholder={isHindi ? "उदा. रमेश, सुनीता देवी..." : "e.g. Ramesh, Sunita..."}
                  className="mt-1 w-full rounded-xl border border-line bg-sand/40 px-3 py-1.5 text-xs text-ink outline-none focus:border-rust"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink">
                  {isHindi ? "मोबाइल नंबर (वैकल्पिक):" : "Phone (Optional):"}
                </label>
                <input
                  type="text"
                  value={udharPhone}
                  onChange={(e) => setUdharPhone(e.target.value)}
                  placeholder="+91 98..."
                  className="mt-1 w-full rounded-xl border border-line bg-sand/40 px-3 py-1.5 text-xs text-ink outline-none focus:border-rust"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink">
                  {isHindi ? "उधार राशि (₹):" : "Udhaar Amount (₹):"}
                </label>
                <input
                  type="number"
                  required
                  value={udharAmount}
                  onChange={(e) => setUdharAmount(e.target.value)}
                  placeholder="250"
                  className="mt-1 w-full rounded-xl border border-line bg-sand/40 px-3 py-1.5 text-xs font-bold text-ink outline-none focus:border-rust"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink">
                  {isHindi ? "सामान का विवरण:" : "Items taken:"}
                </label>
                <input
                  type="text"
                  value={udharItems}
                  onChange={(e) => setUdharItems(e.target.value)}
                  placeholder={isHindi ? "उदा. 2 पैकेट दूध, 1 ब्रेड..." : "e.g. 2 milk, 1 bread..."}
                  className="mt-1 w-full rounded-xl border border-line bg-sand/40 px-3 py-1.5 text-xs text-ink outline-none focus:border-rust"
                />
              </div>
            </div>

            {udharSuccess && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald animate-settle">
                <Check className="size-4" />
                <span>{isHindi ? "खाता दर्ज! नया उधार जोड़ा गया।" : "Udhaar added & customer balance updated!"}</span>
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewUdharOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-inksoft hover:bg-sand"
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-rust px-4 py-2 text-xs font-bold text-cream shadow-sm hover:bg-rust/90"
              >
                {isHindi ? "✓ खाते में जोड़ें" : "✓ Add to Khata"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
