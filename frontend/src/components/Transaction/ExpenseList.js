import "../../styles/TransactionPage.css";

export default function ExpenseList({ categories }) {
  if (!categories || categories.length === 0) {
    return <div className="no-expense">Không có chi tiêu nào</div>;
  }

  return (
    <div className="expense-list">
      <h3>Danh sách chi tiêu theo loại:</h3>
      <ul>
        {categories.map((item, index) => (
          <li key={index}>
            <span className="category-name">{item.expenseCategory}</span>:{" "}
            <span className="category-amount">
              {item.amount.toLocaleString()} VNĐ
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
