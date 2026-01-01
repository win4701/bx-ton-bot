router.get("/payments", isAdmin, getPendingPayments);
router.post("/approve/:id", isAdmin, approvePayment);
router.post("/reject/:id", isAdmin, rejectPayment);
