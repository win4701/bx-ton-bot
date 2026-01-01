export async function createPendingOrder(userId, method) {
  return db.insert({
    userId,
    method,
    status: "PENDING",
    createdAt: Date.now()
  });
}
