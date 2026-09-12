import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { loyaltyClubData, shopInfo } from "@/lib/mock-data";
import { playPaytmChime, speakSoundboxAlert } from "@/lib/soundbox-audio";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  Award,
  BellRing,
  CheckCircle2,
  Gift,
  HeartHandshake,
  MessageSquare,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface PaytmLoyaltyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaytmLoyaltyModal({
  open,
  onOpenChange,
}: PaytmLoyaltyModalProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const [selectedMember, setSelectedMember] = useState(loyaltyClubData.members[0]);
  const [passSentMap, setPassSentMap] = useState<Record<string, boolean>>({});
  const [soundboxAlertPlayed, setSoundboxAlertPlayed] = useState(false);

  const handleTestSoundboxReward = (member: typeof selectedMember) => {
    playPaytmChime();
    setSoundboxAlertPlayed(true);

    const spokenText = isHindi
      ? `पेटीएम लॉयल्टी अलर्ट: बधाई हो ${member.name} जी! आपकी पांचवीं खरीदारी पर 30 रुपये की विशेष छूट लागू हो गई।`
      : `Paytm Loyalty Alert: Congratulations ${member.name}! Flat ₹30 discount unlocked on your 5th visit.`;

    speakSoundboxAlert(spokenText, isHindi ? "hi" : "en", () => {
      setSoundboxAlertPlayed(false);
    });
  };

  const handleSendVipPass = (memberId: string) => {
    setPassSentMap((prev) => ({ ...prev, [memberId]: true }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-[26px] bg-paper p-6 shadow-2xl ring-1 ring-line text-ink sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-rust text-cream shadow-sm">
              <Award className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink sm:text-lg">
                {t.loyaltyTitle}
              </h3>
              <p className="text-xs text-inksoft">{t.loyaltySub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="size-7 rounded-full bg-sand hover:bg-sand/80 grid place-items-center text-xs font-bold text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Anti-Quick-Commerce Scorecard */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
          <div className="rounded-xl bg-sand/30 p-3 ring-1 ring-line">
            <span className="text-[10px] text-inksoft">{isHindi ? "सक्रिय लॉयल्टी ग्राहक" : "Active Members"}</span>
            <p className="font-display text-xl font-bold text-ink mt-0.5">
              {loyaltyClubData.stats.registeredShoppers}
            </p>
            <p className="text-[10px] text-emerald font-semibold mt-0.5">
              {isHindi ? "पेटीएम क्यूआर द्वारा स्वतः दर्ज" : "Soundbox auto-tracked"}
            </p>
          </div>

          <div className="rounded-xl bg-sand/30 p-3 ring-1 ring-line border-l-4 border-l-emerald">
            <span className="text-[10px] text-inksoft">{isHindi ? "ब्लिंकिट/ज़ेप्टो से ग्राहक बचत" : "Churn Cut vs Zepto"}</span>
            <p className="font-display text-xl font-bold text-emerald mt-0.5">
              -{loyaltyClubData.stats.churnReductionPct}%
            </p>
            <p className="text-[10px] text-inksoft mt-0.5">
              {isHindi ? "ग्राहक टूटना 42% घटा" : "Retention vs quick-comm"}
            </p>
          </div>

          <div className="rounded-xl bg-sand/30 p-3 ring-1 ring-line">
            <span className="text-[10px] text-inksoft">{isHindi ? "मासिक खरीदारी आवृत्ति" : "Repeat Velocity"}</span>
            <p className="font-display text-xl font-bold text-ink mt-0.5">
              {loyaltyClubData.stats.repeatVisitsPerMonth} {isHindi ? "बार" : "visits"}
            </p>
            <p className="text-[10px] text-emerald font-semibold mt-0.5">
              ↑ vs {loyaltyClubData.stats.baselineVisits} {isHindi ? "पहले" : "baseline"}
            </p>
          </div>

          <div className="rounded-xl bg-sand/30 p-3 ring-1 ring-line">
            <span className="text-[10px] text-inksoft">{isHindi ? "छूट से उत्पन्न बिक्री" : "Revenue Unlocked"}</span>
            <p className="font-display text-xl font-bold text-rust mt-0.5">
              +₹{loyaltyClubData.stats.incrementalRevenueGenerated.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-inksoft mt-0.5">
              {isHindi ? "₹1,240 छूट के बदले" : "On ₹1,240 perks given"}
            </p>
          </div>
        </div>

        {/* The 5th Visit Reward Rule Banner */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-rust/10 via-sand/50 to-rust/5 p-4 ring-1 ring-rust/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Gift className="size-5 text-rust shrink-0" />
            <div>
              <p className="font-display text-xs font-bold text-ink">
                {isHindi ? loyaltyClubData.rewardRuleHi : loyaltyClubData.rewardRuleEn}
              </p>
              <p className="text-[11px] text-inksoft">
                {isHindi
                  ? "ग्राहक को कोई ऐप डाउनलोड नहीं करना पड़ता। साउंडबॉक्स स्वतः पहचान कर आवाज से बधाई देता है।"
                  : "Zero app download for shopper. Soundbox recognizes UPI handle and speaks congratulations aloud."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleTestSoundboxReward(loyaltyClubData.members[0])}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-rust px-3.5 py-1.5 text-xs font-bold text-cream hover:bg-rust/90 active:scale-95 shadow-sm transition-all"
          >
            <BellRing className="size-3.5" />
            <span>{isHindi ? "साउंडबॉक्स अलर्ट टेस्ट करें" : "Test Soundbox Alert"}</span>
          </button>
        </div>

        {/* Member Stamp Cards */}
        <div className="mt-5">
          <h4 className="font-display text-sm font-bold text-ink flex items-center gap-1.5">
            <Users className="size-4 text-rust" />
            <span>{isHindi ? "ग्राहक डिजिटल स्टैम्प कार्ड (हालिया सक्रिय)" : "Customer Digital Stamp Cards"}</span>
          </h4>

          <div className="mt-3 space-y-3">
            {loyaltyClubData.members.map((member) => {
              const isSent = passSentMap[member.id];
              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={cn(
                    "cursor-pointer rounded-2xl bg-paper p-4 ring-1 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                    member.unlocked ? "ring-2 ring-emerald bg-emerald/5" : "ring-line hover:bg-sand/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "grid size-10 place-items-center rounded-xl font-display font-bold text-sm shrink-0",
                        member.unlocked ? "bg-emerald text-white" : "bg-sand text-ink"
                      )}
                    >
                      {member.name[0]}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-sm font-bold text-ink">{member.name}</p>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.2 text-[9px] font-bold",
                            member.unlocked ? "bg-emerald text-white" : "bg-sand text-ink"
                          )}
                        >
                          {isHindi ? member.statusHi : member.statusEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-inksoft font-mono mt-0.5">
                        {member.phone} · {isHindi ? "इस महीने खर्च:" : "Spend this month:"} {member.spendThisMonth}
                      </p>
                    </div>
                  </div>

                  {/* Stamp Circles */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((stampIndex) => {
                        const isStamped = stampIndex <= member.stamps;
                        const isTarget = stampIndex === 5;
                        return (
                          <span
                            key={stampIndex}
                            className={cn(
                              "grid size-7 place-items-center rounded-full text-xs font-bold transition-all",
                              isStamped && isTarget
                                ? "bg-emerald text-white ring-2 ring-emerald animate-pulse shadow-md"
                                : isStamped
                                ? "bg-rust text-cream shadow-sm"
                                : "bg-sand/70 text-inksoft/50 ring-1 ring-line border-dashed"
                            )}
                          >
                            {isTarget ? "🎁" : isStamped ? "✓" : stampIndex}
                          </span>
                        );
                      })}
                    </div>

                    <div className="ml-2">
                      {isSent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald">
                          <CheckCircle2 className="size-3.5" />
                          <span>{isHindi ? "भेजा गया" : "Sent"}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendVipPass(member.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-[#20bd5a]"
                        >
                          <Send className="size-3" />
                          <span>WhatsApp Pass</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp VIP Digital Pass Preview */}
        <div className="mt-5 rounded-2xl bg-sand/40 p-4 ring-1 ring-line">
          <div className="flex items-center justify-between pb-2 border-b border-line/60">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-[#25D366]" />
              <span>
                {isHindi
                  ? `${selectedMember.name} के लिए व्हाट्सएप वीआईपी पास:`
                  : `WhatsApp VIP Pass Preview for ${selectedMember.name}:`}
              </span>
            </span>
            <span className="text-[10px] text-inksoft font-mono">Instant Delivery</span>
          </div>

          <div className="mt-2.5 rounded-xl bg-[#DCF8C6]/40 p-3.5 text-xs text-ink ring-1 ring-[#25D366]/30 leading-relaxed font-sans">
            <p className="font-bold text-[#075E54]">
              🏪 {shopInfo.name} — VIP ग्राहक रिवॉर्ड पास
            </p>
            <p className="mt-1">
              नमस्ते {selectedMember.name} जी! अन्नपूर्णा किराना के साथ खरीदारी के लिए धन्यवाद।
            </p>
            <p className="mt-1 font-semibold">
              ⭐ आपका लॉयल्टी स्टेटस: {selectedMember.stamps}/5 स्टैम्प्स
              {selectedMember.unlocked
                ? " (🎉 अगली खरीदारी पर ₹30 की तुरंत छूट अनलॉक हो चुकी है!)"
                : ` (केवल ${5 - selectedMember.stamps} खरीदारी और ₹30 छूट के लिए)`}
            </p>
            <p className="mt-1.5 text-[11px] text-inksoft">
              ✨ विशेष लाभ: फोन/व्हाट्सएप पर आर्डर करने पर 15-मिनट में फ्री होम डिलीवरी।
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex items-center justify-end border-t border-line pt-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-sand px-5 py-2 text-xs font-bold text-ink hover:bg-paper ring-1 ring-line"
          >
            {isHindi ? "बंद करें" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
