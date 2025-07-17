import React from "react";

const ExpenseSummary = ({ expenses = [] }) => {
  const total = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  return (
    <div className="expense-summary">
      <h4>Tổng cộng: {total.toLocaleString()} VND</h4>
    </div>
  );
};

export default ExpenseSummary;
