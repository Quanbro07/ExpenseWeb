import React from "react";

const ExpenseTable = ({ expenses }) => {
  return (
    <div className="expense-table">
      <h3>Danh sách chi tiêu</h3>
      {expenses.length === 0 ? (
        <p>Không có chi tiêu nào cho ngày đã chọn.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mô tả</th>
              <th>Số tiền (VND)</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
                <td>{expense.expenseDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button style={{ float: "right", marginTop: "10px" }}>Cập nhật</button>
    </div>
  );
};

export default ExpenseTable;
