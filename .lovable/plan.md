# Paytm AI Hackathon Demo Upgrade

## Goal
Turn the existing Bharat dashboard into a polished 60–90 second demo while preserving its warm kirana visual system and the complete bahi-khata workflow.

## What will change

1. **One shared demo data source**
   - Consolidate Annapurna Kirana’s merchant profile, sales, customer, Paytm payment, udhaar, inventory, trend, campaign, and forecast figures.
   - Keep live khata entries and repayments reactive, while ensuring dashboard cards and Bharat’s context use the same source.

2. **Sharper opening story**
   - Upgrade the morning briefing with the 16% sales forecast and three priorities: inactive customers, Parle stock, and overdue udhaar.
   - Add a compact Business Health row and a “Review all” action that takes the presenter through the priorities.

3. **Explainable AI recommendation cards**
   - Restructure each card into problem, evidence, recommendation, expected impact, and primary action.
   - Add a per-card “Why am I seeing this?” disclosure using the exact mock-data factors.

4. **Interactive campaign and scenario demos**
   - Add the “Review & send” campaign modal with target, offer window, projected returns, profit, edit/cancel, and animated approval confirmation.
   - Add “Ask Bharat: What if?” controls for 10%, 15%, and custom discounts, with side-by-side outcomes and Bharat’s profit-based recommendation.

5. **Paytm Business Insights**
   - Add the five requested payment metrics, a compact 7-day trend chart, insight pills, and a clear “Demo / Mock Data” badge.

6. **Udhaar AI and inventory intelligence**
   - Extend the existing bahi-khata area with pending/due/overdue splits, risk buckets, and a Hindi reminder preview with simulated send confirmation.
   - Add the Parle zero-stock alert and an order-review modal for 24 units from Sharma Distributors.
   - Preserve new-credit, repayment, status, ledger history, and WhatsApp receipt behavior.

7. **Bharat chat demo controls**
   - Add English / हिंदी mode, the requested data-grounded prompt chips, and a microphone control for presentation realism.
   - Update the AI context and instructions so answers consistently use the centralized numbers and selected language.

## Technical details
- Keep the current TanStack Start, AI Elements chat, local browser khata persistence, and existing semantic color/type tokens.
- Break the expanded dashboard into focused components rather than rebuilding the page.
- Use existing dialog, sheet, button, disclosure, and chart primitives; all demo actions remain client-side simulations.
- Ensure all content fits cleanly in the existing desktop chat-panel layout and mobile bottom-sheet experience.

## Verification
- Run project checks and inspect the rendered dashboard at desktop and mobile sizes.
- Exercise campaign approval, discount comparison, reminder send, purchase-order review, chat language switching, new udhaar, and repayment updates.
- Confirm every displayed figure and AI snapshot matches the shared mock data.
