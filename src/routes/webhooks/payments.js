// عند تأكيد الدفع
await pool.query(
  `UPDATE mining_accounts SET plan=$1 WHERE user_id=$2`,
  [plan, userId]
);
