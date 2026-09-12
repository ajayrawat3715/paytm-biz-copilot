# Focused Paytm Hackathon Demo Upgrade

## Goal
Strengthen the first 60–90 seconds of the existing Bharat demo without changing its warm kirana aesthetic or current bahi-khata features.

## What will change

1. **Centralized demo data**
   - Create one shared source for Annapurna Kirana’s sales, inactive customers, campaign forecast, udhaar, payments, and Parle stock figures.
   - Wire the Morning Brief, all three priority cards, campaign preview, and Bharat responses to these exact values.

2. **Morning Brief and three priorities**
   - Show the exact greeting and 16% lower-sales forecast.
   - Present three “Worth Doing Today” cards for 240 inactive customers, zero-stock Parle biscuits, and ₹2,800 overdue udhaar.
   - Structure each card as problem, reason, recommended action, expected impact, plus a “Why am I seeing this?” disclosure.

3. **Exact campaign approval flow**
   - “Review & send” opens a preview showing: 240 customers, 10% off from 4–8 PM, 38 expected returns, ₹6,100 sales, and ₹2,100 profit.
   - “Approve & send” immediately enters a subtle dispatch state, then shows a green check and: “Campaign approved! 240 customers will receive the offer.”
   - Include Edit, Cancel, Done, and automatic close after success.

4. **Bharat chat demo controls**
   - Add an English | हिंदी toggle at the top and a microphone icon in the composer.
   - Use the three requested suggestion chips and provide realistic, shared-data-grounded Hinglish responses.
   - Preserve streamed AI chat for other questions while guaranteeing a clean 400ms response state for the demo suggestions.

## Technical details
- Keep TanStack Start, AI Elements, existing responsive chat panel/sheet, local khata persistence, typography, and semantic colors.
- Split the focused additions into small presentation components where useful; do not rebuild the dashboard.
- Update the server AI snapshot and language instruction to use the same centralized values.

## Verification
- Check desktop and mobile layouts.
- Exercise all three priority cards, evidence disclosures, full campaign approval flow, language toggle, microphone control, and all three suggested prompts.
- Confirm existing new-udhaar, repayment, status, and receipt flows still work.
