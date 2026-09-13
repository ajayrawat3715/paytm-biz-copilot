import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeaderNav } from "@/components/HeaderNav";
import { useKiranaData } from "@/lib/kirana-context";
import { useLanguage } from "@/lib/language-context";
import { type InventoryItem } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Package,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sliders,
  Sparkles,
  Truck,
} from "lucide-react";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Smart Inventory Hub — Bharat Kirana Copilot" },
      {
        name: "description",
        content:
          "Predictive stock-out forecasts, safety stock buffer controls, and 1-click supplier purchase orders to Sharma Distributors.",
      },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const { language, isHindi } = useLanguage();
  const { inventory, orderInventoryStock, totals } = useKiranaData();
  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<InventoryItem | null>(null);
  const [orderSentMap, setOrderSentMap] = useState<Record<string, boolean>>({});
  const [safetyDays, setSafetyDays] = useState<number>(3);

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      (filterCategory === "critical" && item.status !== "healthy") ||
      (filterCategory === "healthy" && item.status === "healthy");
    return matchesSearch && matchesCategory;
  });

  const handleSendOrder = (item: InventoryItem) => {
    orderInventoryStock(item.id, item.reorderLevel);
    setOrderSentMap((prev) => ({ ...prev, [item.id]: true }));
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-cream text-ink bg-blueprint-grid pb-28 md:pb-16">
      <HeaderNav />

      <main className="mx-auto max-w-[1180px] px-4 sm:px-7 pt-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rust-light px-2.5 py-0.5 text-xs font-semibold text-rust">
                {isHindi ? "किराना स्टॉक इंटेलिजेंस" : "Kirana Stock Intelligence"}
              </span>
              <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-semibold text-emerald">
                {isHindi ? "शर्मा डिस्ट्रीब्यूटर्स कनेक्टेड" : "Sharma Distributors Connected"}
              </span>
            </div>
            <h1 className="mt-2 font-sans text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-ink">
              {t.invTitle}
            </h1>
            <p className="mt-1 text-sm text-inksoft">
              {t.invSub}
            </p>
          </div>

          {/* Safety Stock Buffer Quick Pill */}
          <div className="flex items-center gap-2 rounded-2xl bg-paper px-4 py-2 ring-1 ring-line text-xs shadow-2xs">
            <Sliders className="size-4 text-rust" />
            <div>
              <p className="text-[11px] text-inksoft">
                {isHindi ? "भारत सेफ़्टी स्टॉक नियम" : "Bharat Safety Rule"}
              </p>
              <p className="font-semibold text-ink">
                {safetyDays} {isHindi ? "दिन का बफ़र स्टॉक" : "Days Buffer Stock"}
              </p>
            </div>
            <div className="ml-2 flex items-center gap-1 border-l border-line pl-2">
              <button
                type="button"
                onClick={() => setSafetyDays(Math.max(2, safetyDays - 1))}
                className="grid size-6 place-items-center rounded-md bg-sand hover:bg-sand/80 font-bold transition-colors"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setSafetyDays(Math.min(5, safetyDays + 1))}
                className="grid size-6 place-items-center rounded-md bg-sand hover:bg-sand/80 font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 3 Overview Metric Cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line border-l-[3px] border-l-rust shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">
                {isHindi ? "शून्य स्टॉक (तत्काल आर्डर)" : "Out of Stock (Urgent)"}
              </span>
              <AlertTriangle className="size-4 text-rust" />
            </div>
            <p className="mt-2 font-sans text-2xl font-bold text-rust tabular-nums tracking-[-0.02em]">
              {inventory.filter((i) => i.stock === 0).length} SKUs
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              {inventory.filter((i) => i.stock === 0).map((i) => i.name.split(" ")[0]).join(", ") || (isHindi ? "कोई शून्य स्टॉक नहीं है" : "All items in stock")}
            </p>
          </div>

          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line border-l-[3px] border-l-warning shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">
                {isHindi ? "कम स्टॉक (< 1 दिन शेष)" : "Low Stock (< 1 Day Left)"}
              </span>
              <Clock className="size-4 text-warning" />
            </div>
            <p className="mt-2 font-sans text-2xl font-bold text-warning tabular-nums tracking-[-0.02em]">
              {inventory.filter((i) => i.stock > 0 && i.daysRemaining < 1).length} SKUs
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              Fortune Oil, Maggi Noodles, Good Day Butter
            </p>
          </div>

          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line border-l-[3px] border-l-emerald shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-inksoft">
                {isHindi ? "सुरक्षित बफर स्टॉक" : "Healthy Stock Buffer"}
              </span>
              <CheckCircle2 className="size-4 text-emerald" />
            </div>
            <p className="mt-2 font-sans text-2xl font-bold text-emerald tabular-nums tracking-[-0.02em]">
              {inventory.filter((i) => i.status === "healthy" && i.daysRemaining >= 1).length} SKUs
            </p>
            <p className="mt-1 text-[11px] text-inksoft">
              Tata Salt, Aashirvaad Atta, Surf Excel, Tea
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-inksoft" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHindi ? "सामान या सप्लायर का नाम खोजें…" : "Search SKU name or distributor…"}
              className="w-full rounded-full bg-paper pl-10 pr-4 py-2 text-xs text-ink placeholder:text-inksoft ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-rust"
            />
          </div>

          <div className="flex flex-wrap items-center rounded-2xl bg-paper p-1 ring-1 ring-line">
            <button
              type="button"
              onClick={() => setFilterCategory("all")}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                filterCategory === "all" ? "bg-ink text-cream shadow-2xs" : "text-inksoft hover:text-ink"
              )}
            >
              {isHindi ? "सभी सामान (8)" : "All Items (8)"}
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("critical")}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                filterCategory === "critical" ? "bg-warning text-cream shadow-2xs" : "text-inksoft hover:text-ink"
              )}
            >
              {isHindi ? "⚠️ कम स्टॉक (4)" : "⚠️ Needs Restock (4)"}
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("healthy")}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                filterCategory === "healthy" ? "bg-emerald text-white shadow-2xs" : "text-inksoft hover:text-ink"
              )}
            >
              {isHindi ? "सुरक्षित (4)" : "Healthy (4)"}
            </button>
          </div>
        </div>

        {/* Inventory SKU Table */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-paper ring-1 ring-line shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-sand/40 text-inksoft uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3.5 sm:px-6">{isHindi ? "सामान विवरण" : "Product & Category"}</th>
                  <th className="px-4 py-3.5">{isHindi ? "मौजूदा स्टॉक" : "Current Stock"}</th>
                  <th className="px-4 py-3.5">{isHindi ? "दैनिक बिक्री गति" : "Daily Velocity"}</th>
                  <th className="px-4 py-3.5">{isHindi ? "अनुमानित शेष दिन" : "Stock-Out Run"}</th>
                  <th className="px-4 py-3.5">{isHindi ? "प्राथमिक सप्लायर" : "Preferred Supplier"}</th>
                  <th className="px-4 py-3.5 text-right sm:px-6">{isHindi ? "एआई कार्रवाई" : "AI Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredItems.map((item) => {
                  const isSent = orderSentMap[item.id];
                  return (
                    <tr key={item.id} className="hover:bg-sand/20 transition-colors">
                      <td className="px-4 py-4 sm:px-6">
                        <p className="font-sans font-semibold text-sm text-ink">{item.name}</p>
                        <p className="text-[11px] text-inksoft">{item.category}</p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-sans text-sm font-bold tabular-nums",
                              item.status === "out_of_stock"
                                ? "text-warning font-bold"
                                : item.status === "low_stock"
                                ? "text-warning"
                                : "text-ink"
                            )}
                          >
                            {item.stock} {item.unit}
                          </span>
                          {item.status === "out_of_stock" && (
                            <span className="rounded-full bg-warning-light px-2 py-0.5 text-[9px] font-bold text-warning ring-1 ring-warning/30">
                              {isHindi ? "खत्म" : "OUT"}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-inksoft">
                        <span className="font-semibold text-ink">{item.dailyVelocity}</span> {item.unit} / {isHindi ? "दिन" : "day"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                            item.daysRemaining === 0
                              ? "bg-warning-light text-warning ring-1 ring-warning/30"
                              : item.daysRemaining < 1
                              ? "bg-warning-light text-warning"
                              : "bg-emerald-light text-emerald"
                          )}
                        >
                          <Clock className="size-3" />
                          {item.daysRemaining === 0
                            ? (isHindi ? "आज खत्म" : "0 days")
                            : `${item.daysRemaining} ${isHindi ? "दिन शेष" : "days left"}`}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-ink">{item.supplier}</p>
                        <p className="text-[11px] text-inksoft font-mono">{item.supplierPhone}</p>
                      </td>

                      <td className="px-4 py-4 text-right sm:px-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => orderInventoryStock(item.id, 10)}
                            title={isHindi ? "+10 यूनिट स्टॉक जोड़ें" : "+10 Units Stock"}
                            className="rounded-xl bg-sand px-2.5 py-1 text-[11px] font-bold text-ink hover:bg-paper ring-1 ring-line active:scale-95 transition-all"
                          >
                            +10
                          </button>

                          {isSent ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald">
                              <CheckCircle2 className="size-3.5" />
                              {isHindi ? "ऑर्डर भेजा गया" : "PO Dispatched"}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(item)}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm",
                                item.status === "out_of_stock"
                                  ? "bg-rust text-cream hover:bg-rust/90 animate-pulse"
                                  : item.status === "low_stock"
                                  ? "bg-amber-600 text-white hover:bg-amber-700"
                                  : "bg-sand text-ink hover:bg-paper ring-1 ring-line"
                              )}
                            >
                              <MessageSquare className="size-3" />
                              <span>
                                {item.status === "out_of_stock"
                                  ? (isHindi ? "तुरंत मंगाएं (24)" : "Order 24 Now")
                                  : (isHindi ? "व्हाट्सएप ऑर्डर" : "Reorder")}
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2 Bottom Support Cards: Supplier Contacts & Bharat Buffer Rationale */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Supplier Directory Card */}
          <div className="rounded-[20px] bg-paper p-5 ring-1 ring-line">
            <h2 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Truck className="size-4 text-rust" />
              <span>{isHindi ? "सत्यापित थोक सप्लायर डायरेक्टरी" : "Verified Wholesale Distributors"}</span>
            </h2>
            <p className="text-xs text-inksoft">
              {isHindi ? "पटना क्षेत्र के मुख्य एफएमसीजी सप्लायर" : "Primary wholesale credit partners for Annapurna Kirana"}
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-sand/30 p-3.5 ring-1 ring-line/70">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-ink">Sharma Distributors</p>
                    <span className="rounded-full bg-emerald/15 px-2 py-0.2 text-[9px] font-bold text-emerald">
                      {isHindi ? "⭐ प्राथमिक सप्लायर" : "⭐ Primary Partner"}
                    </span>
                  </div>
                  <p className="text-xs text-inksoft mt-0.5">Goripur, Patna · Biscuits, Tea & Detergents</p>
                  <p className="text-[11px] text-ink font-mono mt-0.5">Credit Terms: 7 Days · +91 98350 12345</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(inventoryCatalog[0])}
                  className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-rust ring-1 ring-line hover:bg-sand"
                >
                  WhatsApp PO
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-sand/30 p-3.5 ring-1 ring-line/70">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">Gupta FMCG Patna</p>
                  <p className="text-xs text-inksoft mt-0.5">Kankarbagh, Patna · Edible Oils, Atta & Staples</p>
                  <p className="text-[11px] text-ink font-mono mt-0.5">Credit Terms: 14 Days · +91 98350 67890</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(inventoryCatalog[1])}
                  className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-line hover:bg-sand"
                >
                  WhatsApp PO
                </button>
              </div>
            </div>
          </div>

          {/* AI Memory & Buffer Logic */}
          <div className="rounded-[20px] bg-paper p-5 ring-1 ring-line">
            <h2 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Sparkles className="size-4 text-rust" />
              <span>{isHindi ? "भारत एआई स्टॉक-आउट गणना" : "Bharat AI Stock Buffer Logic"}</span>
            </h2>
            <p className="text-xs text-inksoft">
              {isHindi ? "दुकानदार की प्राथमिकताओं पर आधारित रीऑर्डर सूत्र" : "Dynamic calculation tailored to Annapurna Kirana preferences"}
            </p>

            <div className="mt-4 rounded-xl bg-cream/70 p-4 ring-1 ring-line text-xs space-y-2.5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald shrink-0 mt-0.5" />
                <p>
                  <strong>{isHindi ? "3-दिन का बफर:" : "3-Day Buffer Preference:"}</strong>{" "}
                  {isHindi
                    ? "पारले-जी और मैगी जैसे उच्च-गति वाले सामानों के लिए 3 दिन की अग्रिम सुरक्षा रखी जाती है ताकि शाम की चाय भीड़ में नुकसान न हो।"
                    : "For high-velocity SKUs like Parle-G and Maggi, Bharat enforces a 3-day safety stock so you never miss the 5–8 PM evening tea rush."}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald shrink-0 mt-0.5" />
                <p>
                  <strong>{isHindi ? "सप्लायर का डिलीवरी समय:" : "Lead Time Protection:"}</strong>{" "}
                  {isHindi
                    ? "शर्मा डिस्ट्रीब्यूटर्स का औसत डिलीवरी समय 4 घंटे है। दोपहर 1 बजे से पहले दिया गया आर्डर शाम 5 बजे तक दुकान पहुंच जाता है।"
                    : "Sharma Distributors delivers in 4 hours on average. POs sent before 1 PM arrive right in time for counter rush."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive WhatsApp Purchase Order Preview Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-[24px] bg-paper p-6 shadow-2xl ring-1 ring-line">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
                    <MessageSquare className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">
                      {isHindi ? "व्हाट्सएप खरीद आर्डर (PO)" : "WhatsApp Purchase Order Draft"}
                    </h3>
                    <p className="text-xs text-inksoft">{selectedOrder.supplier} ({selectedOrder.supplierPhone})</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="size-7 rounded-full bg-sand hover:bg-sand/80 grid place-items-center text-xs font-bold text-ink"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-sand/30 p-4 text-xs font-mono space-y-2 text-ink ring-1 ring-line">
                <p className="font-bold text-rust">
                  {isHindi ? "अन्नपूर्णा किराना खरीद आर्डर:" : "ANNAPURNA KIRANA PURCHASE ORDER:"}
                </p>
                <p>नमस्ते {selectedOrder.supplier} जी,</p>
                <p>कृपया आज शाम तक निम्नलिखित सामान भेजें:</p>
                <p className="font-bold text-ink">
                  • {selectedOrder.name} — {selectedOrder.reorderLevel} {selectedOrder.unit}
                </p>
                <p>
                  अनुमानित लागत: ₹{(selectedOrder.reorderLevel * selectedOrder.costPrice).toLocaleString("en-IN")}
                </p>
                <p>भुगतान: 7-दिन क्रेडिट बही के अनुसार। धन्यवाद! — रमेश</p>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-inksoft hover:text-ink"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendOrder(selectedOrder)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#20bd5a] active:scale-95 transition-all"
                >
                  <Send className="size-3.5" />
                  <span>{isHindi ? "व्हाट्सएप पर PO भेजें" : "Dispatch WhatsApp PO"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
