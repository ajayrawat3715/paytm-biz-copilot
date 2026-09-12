# Roadmap

- [x] Merchant copilot dashboard (warm kirana ledger design): sales snapshot, opportunity cards, at-a-glance strip
- [x] AI copilot chat (Lovable AI) that knows the shop's numbers
- [x] Daily bahi-khata metrics: Total Credit Outstanding; Today's Udhar Collections with mode breakdown (Cash vs Paytm QR/UPI); Net Daily Balance = Cash Sales + Udhar Collections − Cash Expenses
- [x] Udhar workflow: create credit sale (customer, phone, items, amount, due date); log partial/full repayments
- [x] Status badges in IST (Asia/Kolkata): Settled (balance 0), Overdue (balance > 0 and due date before today IST), Active/Due Today (balance > 0 and due today or later)
- [x] Per-customer ledger drawer: repayment history, remaining balance, preset chips (₹200/₹500/₹1000/Full), method selector (Cash | Paytm QR | UPI), pre-filled WhatsApp receipt link
- [x] All statuses and summary numbers update reactively from shared state

## Paytm AI Hackathon demo upgrade

- [ ] Centralize the merchant data used by the Morning Brief, three priority cards, campaign, and chat
- [ ] Upgrade the Morning Brief and three explainable “Worth Doing Today” cards from shared mock data
- [ ] Implement the exact 10% campaign preview, dispatch loading, and approval success flow
- [ ] Add Paytm business insights, 7-day trend, and explicit Demo / Mock Data labeling
- [ ] Add udhaar risk buckets, reminder preview/send flow, and inventory purchase-order preview
- [ ] Add English / हिंदी chat mode, three data-grounded suggestions, 400ms response state, and microphone control
- [ ] Preserve and regression-test new udhaar, repayment, status, and WhatsApp receipt workflows
- [ ] Verify the full 60–90 second demo path on desktop and mobile
