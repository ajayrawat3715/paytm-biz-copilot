import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  QrCode,
  Store,
  CheckCircle2,
  ArrowRight,
  X,
  Copy,
  Check,
} from "lucide-react";

export interface OfferScheme {
  id: string;
  tag: string;
  tagHi: string;
  isSpecial?: boolean;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  ctaText: string;
  ctaTextHi: string;
  highlightText: string;
  highlightTextHi: string;
  partnerText: string;
  partnerTextHi: string;
  promoCode: string;
  validity: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  btnBg: string;
  details: {
    steps: { en: string; hi: string }[];
    perks: { en: string; hi: string }[];
  };
}

const SCHEMES: OfferScheme[] = [
  {
    id: "paytm-upi-cashback",
    tag: "Special Scheme",
    tagHi: "विशेष स्कीम",
    isSpecial: true,
    title: "Accept Payments via UPI, Earn Cashback!",
    titleHi: "UPI से करो भुगतान, पाओ कैशबैक!",
    subtitle: "Get exciting cashback and zero-fee rewards on every counter payment.",
    subtitleHi: "हर डिजिटल भुगतान पर पाएं आकर्षक ऑफर और कैशबैक.",
    ctaText: "Explore Offer",
    ctaTextHi: "अभी देखें",
    highlightText: "Cashback of ₹10 – ₹50 on UPI Payments",
    highlightTextHi: "UPI पेमेंट्स पर ₹10 – ₹50 तक का कैशबैक",
    partnerText: "Big Progress for Small Kirana Merchants · With Bharat at every step.",
    partnerTextHi: "छोटे व्यापारियों की बड़ी तरक्की · Bharat के साथ हर कदम पर.",
    promoCode: "PAYTM-UPI-50",
    validity: "Valid till 30 Sep 2026",
    bgGradient: "from-[#E6F5FC] via-[#EEF8FE] to-[#FFF8F2]",
    borderColor: "border-[#BEE4F8]",
    badgeBg: "bg-[#002970]",
    badgeText: "text-white",
    btnBg: "bg-[#002970] hover:bg-[#001D52] text-white",
    details: {
      steps: [
        { en: "Accept minimum 10 payments of ₹50+ via Paytm QR or Soundbox daily", hi: "पेटीएम क्यूआर या साउंडबॉक्स से रोज कम से कम 10 भुगतान (₹50+) स्वीकार करें" },
        { en: "Get ₹10 to ₹50 direct cashback credited to your linked bank account every midnight", hi: "हर आधी रात को सीधे आपके बैंक खाते में ₹10 से ₹50 तक का कैशबैक जमा होगा" },
        { en: "Enjoy 0% MDR fee on all RuPay credit cards and UPI transactions", hi: "सभी रुपे क्रेडिट कार्ड और यूपीआई लेनदेन पर 0% एमडीआर शुल्क" },
      ],
      perks: [
        { en: "₹0 merchant setup fee", hi: "₹0 व्यापारी सेटअप शुल्क" },
        { en: "Instant Soundbox voice notification", hi: "तुरंत साउंडबॉक्स ध्वनि सूचना" },
        { en: "Auto settlement at 6 AM daily", hi: "प्रतिदिन सुबह 6 बजे ऑटो सेटलमेंट" },
      ],
    },
  },
  {
    id: "soundbox-upgrade",
    tag: "Soundbox 4.0",
    tagHi: "साउंडबॉक्स 4.0",
    isSpecial: false,
    title: "Paytm 4G Soundbox 4.0 at ₹1/month Rental!",
    titleHi: "पेटीएम 4G साउंडबॉक्स 4.0 — ₹1/माह रेंटल पर!",
    subtitle: "Instant voice chime in 11 Indian languages with 3-day backup and dual sim.",
    subtitleHi: "11 भारतीय भाषाओं में तुरंत वॉइस कन्फर्मेशन और 3 दिन के बैटरी बैकअप के साथ.",
    ctaText: "Upgrade Now",
    ctaTextHi: "साउंडबॉक्स अपग्रेड करें",
    highlightText: "75% Off Rental · Zero Setup Fee",
    highlightTextHi: "75% छूट रेंटल पर · जीरो सेटअप फीस",
    partnerText: "Never miss a payment at your counter · Soundbox 4.0",
    partnerTextHi: "दुकान पर कभी न छूटे कोई भुगतान · साउंडबॉक्स 4.0",
    promoCode: "SOUNDBOX-1RS",
    validity: "Special festive rate",
    bgGradient: "from-[#EEF2FF] via-[#F2F6FF] to-[#EBFBF6]",
    borderColor: "border-[#CAD9FF]",
    badgeBg: "bg-[#0D62FE]",
    badgeText: "text-white",
    btnBg: "bg-[#0D62FE] hover:bg-[#0A4ECC] text-white",
    details: {
      steps: [
        { en: "Collect 100+ UPI payments per month on your counter", hi: "महीने में काउंटर पर 100+ यूपीआई भुगतान स्वीकार करें" },
        { en: "Your monthly rental is automatically reduced to just ₹1", hi: "आपका मासिक रेंटल अपने आप घटकर सिर्फ ₹1 रह जाएगा" },
        { en: "Free replacement warranty and doorstep battery check included", hi: "मुफ्त रिप्लेसमेंट वारंटी और डोरस्टेप सर्विस शामिल" },
      ],
      perks: [
        { en: "Loud speaker audible in crowded market", hi: "भीड़ भरे बाजार में भी साफ सुनाई देने वाला लाउडस्पीकर" },
        { en: "Supports Hindi, English, Bhojpuri, Maithili", hi: "हिंदी, अंग्रेजी, भोजपुरी, मैथिली सहित 11 भाषाएं" },
        { en: "24x7 merchant helpline", hi: "24x7 मर्चेंट हेल्पलाइन" },
      ],
    },
  },
  {
    id: "fmcg-margin-deal",
    tag: "Distributor Margin",
    tagHi: "डिस्ट्रीब्यूटर स्कीम",
    isSpecial: true,
    title: "Extra 6% Margin on Fortune Oil & Parle Bulk Restock",
    titleHi: "फॉर्च्यून तेल और पारले पर 6% अतिरिक्त रीऑर्डर मार्जिन!",
    subtitle: "Order before 5 PM today via Sharma Distributors for 15-day interest-free credit.",
    subtitleHi: "शर्मा डिस्ट्रीब्यूटर्स से आज शाम 5 बजे से पहले आर्डर करें और 15 दिन की क्रेडिट पाएं.",
    ctaText: "Claim Discount",
    ctaTextHi: "स्टॉक छूट देखें",
    highlightText: "+₹1,420 Extra Profit on Bulk Crate",
    highlightTextHi: "थोक क्रेट पर +₹1,420 का अतिरिक्त मुनाफा",
    partnerText: "Direct FMCG tie-up for Annapurna Kirana.",
    partnerTextHi: "अन्नपूर्णा किराना के लिए विशेष डिस्ट्रीब्यूटर पार्टनरशिप.",
    promoCode: "SHARMA-KIRANA-6",
    validity: "Today only till 5 PM",
    bgGradient: "from-[#FFF6EC] via-[#FFF9F2] to-[#F1F9F5]",
    borderColor: "border-[#FED7AA]",
    badgeBg: "bg-[#C6532D]",
    badgeText: "text-white",
    btnBg: "bg-[#C6532D] hover:bg-[#A94322] text-white",
    details: {
      steps: [
        { en: "Add minimum 5 crates of Parle-G and 2 tins of Fortune Mustard Oil", hi: "पारले-जी के 5 क्रेट और फॉर्च्यून सरसों तेल के 2 टिन आर्डर में जोड़ें" },
        { en: "Apply partner code SHARMA-KIRANA-6 at supplier confirmation", hi: "सप्लायर कन्फर्मेशन पर पार्टनर कोड SHARMA-KIRANA-6 लागू करें" },
        { en: "Enjoy 15 days udhaar ledger directly backed by Bharat Copilot", hi: "भारत कोपायलट द्वारा समर्थित 15 दिन की उधार बहीखाता सुविधा" },
      ],
      perks: [
        { en: "Guaranteed delivery by 11:00 AM tomorrow", hi: "कल सुबह 11:00 बजे तक गारंटीड डिलीवरी" },
        { en: "₹0 delivery transport surcharge", hi: "₹0 ट्रांसपोर्ट डिलीवरी चार्ज" },
        { en: "Fresh 2026 manufacturing batch", hi: "ताजा 2026 मैन्युफैक्चरिंग बैच" },
      ],
    },
  },
  {
    id: "mudra-loan",
    tag: "Paytm Business Loan",
    tagHi: "पेटीएम बिजनेस लोन",
    isSpecial: false,
    title: "Instant ₹1,00,000 Mudra Loan — Zero Paperwork",
    titleHi: "बिना कागजी कार्रवाई के ₹1,00,000 तक का तुरंत लोन!",
    subtitle: "Pre-approved based on your daily Paytm UPI run-rate with flexible daily EDI repayment.",
    subtitleHi: "आपकी दैनिक UPI बिक्री पर आधारित आसान दैनिक किस्तों (EDI) में पुनर्भुगतान.",
    ctaText: "Check Eligibility",
    ctaTextHi: "पात्रता जांचें",
    highlightText: "Interest starting from 8.9% · 2 Min Approval",
    highlightTextHi: "8.9% ब्याज दर से शुरू · 2 मिनट में स्वीकृति",
    partnerText: "Scale your Kirana inventory for the festive rush.",
    partnerTextHi: "त्योहारी सीजन में अपनी दुकान की इन्वेंट्री बढ़ाएं.",
    promoCode: "MUDRA-KIRANA",
    validity: "Pre-approved offer",
    bgGradient: "from-[#EDFAF4] via-[#F4FCF7] to-[#EFF6FF]",
    borderColor: "border-[#A7F3D0]",
    badgeBg: "bg-[#159570]",
    badgeText: "text-white",
    btnBg: "bg-[#159570] hover:bg-[#0F7557] text-white",
    details: {
      steps: [
        { en: "Check your pre-approved limit based on QR collection history", hi: "क्यूआर कलेक्शन हिस्ट्री के आधार पर अपनी प्री-अप्रूव्ड लिमिट जांचें" },
        { en: "Accept terms with 1-click OTP verification", hi: "1-क्लिक ओटीपी वेरिफिकेशन के साथ नियम स्वीकार करें" },
        { en: "Funds transferred instantly to your current bank account within 2 minutes", hi: "2 मिनट में राशि सीधे आपके चालू बैंक खाते में ट्रांसफर" },
      ],
      perks: [
        { en: "No collateral or property pledge needed", hi: "बिना किसी गारंटी या गिरवी के" },
        { en: "Automatic daily deduction from UPI collections (₹80-₹150/day)", hi: "दैनिक यूपीआई कलेक्शन से ऑटोमेटिक छोटी किस्तें (₹80-₹150/दिन)" },
        { en: "Zero prepayment penalty", hi: "समय से पहले चुकाने पर कोई पेनल्टी नहीं" },
      ],
    },
  },
];

export function MerchantOffersBanner() {
  const { isHindi } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeModalScheme, setActiveModalScheme] = useState<OfferScheme | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activatedOfferId, setActivatedOfferId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-slide every 6.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused || activeModalScheme) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SCHEMES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, activeModalScheme]);

  const currentScheme = SCHEMES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SCHEMES.length) % SCHEMES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SCHEMES.length);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleActivateOffer = (scheme: OfferScheme) => {
    setActivatedOfferId(scheme.id);
    const msg = isHindi
      ? `✓ "${scheme.titleHi}" सफलतापूर्वक सक्रिय कर दी गई है!`
      : `✓ "${scheme.title}" has been successfully activated!`;
    setToastMessage(msg);
    setTimeout(() => {
      setActiveModalScheme(null);
    }, 1200);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <>
      <section
        className="relative my-4 overflow-hidden rounded-2xl border shadow-xs transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Merchant Schemes and Offers Banner"
      >
        <div
          className={cn(
            "relative flex flex-col lg:flex-row items-center justify-between p-4 sm:p-5 sm:px-7 bg-gradient-to-r transition-all duration-500",
            currentScheme.bgGradient,
            currentScheme.borderColor,
          )}
        >
          {/* LEFT PANEL: Paytm Logo, Scheme Tag, Main Headline, Subtitle, CTA Button */}
          <div className="flex-1 min-w-0 pr-0 lg:pr-6 z-10 text-left w-full">
            {/* Logo + Scheme Tag */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {/* Crisp Official Paytm Mark */}
              <div className="flex items-center select-none">
                <span className="font-sans text-[22px] sm:text-[24px] font-black tracking-tighter text-[#002970]">
                  pay
                </span>
                <span className="font-sans text-[22px] sm:text-[24px] font-black tracking-tighter text-[#00BAF2]">
                  tm
                </span>
              </div>

              {/* Tag Pill */}
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-bold tracking-wide shadow-2xs",
                  currentScheme.badgeBg,
                  currentScheme.badgeText,
                )}
              >
                <Sparkles className="size-3" />
                <span>{isHindi ? currentScheme.tagHi : currentScheme.tag}</span>
              </span>

              {activatedOfferId === currentScheme.id && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold ring-1 ring-emerald-300">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  {isHindi ? "सक्रिय है" : "Active"}
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h2 className="font-sans text-[22px] sm:text-[26px] lg:text-[30px] font-bold leading-[1.18] tracking-[-0.025em] text-[#002970]">
              {isHindi ? currentScheme.titleHi : currentScheme.title}
            </h2>

            {/* Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed text-[#334155] max-w-[620px]">
              {isHindi ? currentScheme.subtitleHi : currentScheme.subtitle}
            </p>

            {/* CTA Button */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModalScheme(currentScheme)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all",
                  currentScheme.btnBg,
                )}
              >
                <span>{isHindi ? currentScheme.ctaTextHi : currentScheme.ctaText}</span>
                <ArrowRight className="size-4" />
              </button>

              <span className="text-[11px] font-semibold text-[#64748B] hidden sm:inline">
                {currentScheme.validity}
              </span>
            </div>
          </div>

          {/* MIDDLE & RIGHT PANELS: Paytm QR Phone Mockup + Kirana Store card */}
          <div className="mt-5 lg:mt-0 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 shrink-0 z-10 w-full lg:w-auto justify-center lg:justify-end">
            {/* Center Phone / QR Graphic */}
            <div className="relative flex items-center gap-2.5 rounded-2xl bg-white/95 p-3.5 ring-1 ring-black/5 shadow-sm min-w-[210px] max-w-[240px]">
              {/* Smartphone mockup */}
              <div className="relative flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#F0F8FF] to-[#E2F1FD] p-2 ring-1 ring-[#00BAF2]/30 shrink-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[9px] font-black text-[#002970]">paytm</span>
                  <span className="text-[8px] text-red-500">♥</span>
                  <span className="text-[8px] font-bold text-[#00BAF2]">UPI</span>
                </div>
                <div className="grid size-12 place-items-center rounded-lg bg-white p-1 shadow-2xs">
                  <QrCode className="size-10 text-[#002970]" />
                </div>
              </div>

              {/* Floating UPI Cashback Pill */}
              <div className="flex-1 min-w-0">
                <div className="rounded-xl bg-[#00BAF2] p-2 text-white shadow-xs">
                  <p className="text-[10px] font-medium leading-tight opacity-90">
                    {isHindi ? "UPI पेमेंट्स पर" : "On UPI Payments"}
                  </p>
                  <p className="text-xs sm:text-[13px] font-extrabold tracking-tight leading-tight mt-0.5">
                    {isHindi ? "₹10 – ₹50" : "₹10 – ₹50"}
                  </p>
                  <p className="text-[9px] font-medium leading-tight opacity-90">
                    {isHindi ? "तक का कैशबैक" : "Instant Cashback"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Kirana Store Front Graphic & Bharat Trust Card */}
            <div className="relative flex items-center gap-3 rounded-2xl bg-[#FFFBF5]/95 p-3.5 ring-1 ring-[#E8D7C3] shadow-sm max-w-[260px]">
              {/* Store illustration icon */}
              <div className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA] text-[#C6532D] shadow-2xs">
                <Store className="size-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
                </span>
              </div>

              {/* Text */}
              <div className="leading-tight">
                <p className="text-xs sm:text-[13px] font-bold text-[#0E8345]">
                  {isHindi ? "छोटे व्यापारियों की बड़ी तरक्की" : "Small Kirana, Big Growth"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#6F675E]">
                  <span className="grid size-4 place-items-center rounded-full bg-[#C6532D] text-[9px] font-bold text-white">
                    भ
                  </span>
                  <span>{isHindi ? "Bharat के साथ हर कदम पर." : "With Bharat at every step."}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows (Desktop / Hover) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous scheme"
            className="absolute left-2 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-white/90 text-[#002970] shadow-md ring-1 ring-black/5 hover:bg-white hover:scale-105 active:scale-95 transition-all z-20"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next scheme"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-white/90 text-[#002970] shadow-md ring-1 ring-black/5 hover:bg-white hover:scale-105 active:scale-95 transition-all z-20"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 py-2 bg-white/80 border-t border-black/5">
          {SCHEMES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "w-6 bg-[#00BAF2]"
                  : "w-1.5 bg-black/20 hover:bg-black/40",
              )}
            />
          ))}
        </div>
      </section>

      {/* Live Toast Confirmation Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#002970] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-settle">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Scheme Detail Dialog */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10 animate-scale-in">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalScheme(null)}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-xl font-black text-[#002970]">pay</span>
              <span className="font-sans text-xl font-black text-[#00BAF2]">tm</span>
              <span className="rounded-full bg-[#00BAF2]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#00BAF2]">
                {isHindi ? activeModalScheme.tagHi : activeModalScheme.tag}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {isHindi ? activeModalScheme.titleHi : activeModalScheme.title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {isHindi ? activeModalScheme.subtitleHi : activeModalScheme.subtitle}
            </p>

            {/* Promo Code & Validity Box */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isHindi ? "मर्चेंट ऑफर कोड" : "Merchant Promo Code"}
                </p>
                <p className="font-mono text-sm font-bold text-[#002970]">
                  {activeModalScheme.promoCode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(activeModalScheme.promoCode)}
                className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100 active:scale-95 transition-all shadow-2xs"
              >
                {copiedCode ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span className="text-emerald-600">{isHindi ? "कॉपी हो गया!" : "Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>{isHindi ? "कोड कॉपी करें" : "Copy Code"}</span>
                  </>
                )}
              </button>
            </div>

            {/* How It Works Steps */}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isHindi ? "यह कैसे काम करता है (How It Works)" : "How It Works"}
              </p>
              <ul className="mt-2 space-y-2 text-xs text-slate-600">
                {activeModalScheme.details.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#00BAF2] text-[10px] font-bold text-white mt-0.5">
                      {i + 1}
                    </span>
                    <span>{isHindi ? st.hi : st.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Perks */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {isHindi ? "मुख्य लाभ (Key Merchant Benefits)" : "Key Merchant Benefits"}
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {activeModalScheme.details.perks.map((pk, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>{isHindi ? pk.hi : pk.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModalScheme(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {isHindi ? "बंद करें" : "Close"}
              </button>

              <button
                type="button"
                onClick={() => handleActivateOffer(activeModalScheme)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold shadow-sm active:scale-95 transition-all",
                  activatedOfferId === activeModalScheme.id
                    ? "bg-emerald-600 text-white"
                    : activeModalScheme.btnBg,
                )}
              >
                {activatedOfferId === activeModalScheme.id ? (
                  <>
                    <Check className="size-3.5" />
                    <span>{isHindi ? "ऑफर सक्रिय है" : "Offer Activated"}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    <span>{isHindi ? "ऑफर तुरंत सक्रिय करें" : "Activate Offer Now"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
