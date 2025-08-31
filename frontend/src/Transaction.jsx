import "./Transaction.css";
import { useState } from "react";

export default function Transactions({ user, expenseList }) {
  const [visibleCount, setVisibleCount] = useState(5);

  if (!expenseList || !Array.isArray(expenseList) || expenseList.length === 0) {
    return (
      <div className="no-transactions">
        Không có dữ liệu giao dịch để hiển thị.
      </div>
    );
  }

  const showMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <div>
      {expenseList.slice(0, visibleCount).map((item, index) => (
        <div key={index} className="transactionItem">
          <div className="firstCol">
            <div className="transdt">{item.expenseDate}</div>
            <div className="transmoney" style={{ color: "red" }}>
              - {item.amount.toLocaleString()} VND
            </div>
          </div>
          <div className="secondCol">
            {item.description ||
              item.expenseCategory ||
              "(Không rõ loại chi tiêu)"}
          </div>
        </div>
      ))}

      {visibleCount < expenseList.length && (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button className="buttonView" onClick={showMore}>
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}
