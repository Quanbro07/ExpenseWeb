import { useState } from "react";
import "./TransactionPage.css";

export default function TransactionPage({ userId, user, onSuccess, onBack }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleAddExpense = async () => {
    if (!amount || !selectedDate) {
      alert("Vui lòng nhập số tiền và ngày giao dịch");
      return;
    }

    try {
      const formattedDate = selectedDate.replace(/-/g, "/");

      const payload = {
        userId,
        amount: parseFloat(amount),
        description,
        expenseDate: formattedDate,
      };

      const res = await fetch("http://localhost:8080/api/v1/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Thêm chi tiêu thất bại");

      alert("✅ Giao dịch đã được thêm!");

      // Reset form
      setAmount("");
      setDescription("");
      setSelectedDate("");

      // Gọi lại fetch dữ liệu mới
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ Lỗi khi thêm giao dịch:", err);
      alert("Không thể thêm giao dịch");
    }
  };

  return (
    <div className="transaction-container">
      <h2>Thêm Giao Dịch Mới</h2>
      <div className="date-range">
        <label>Chọn ngày:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Số tiền (VND):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="VD: 50000"
        />
      </div>

      <div className="form-group">
        <label>Mô tả:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="VD: Ăn sáng, mua sách..."
        />
      </div>

      <div className="button-group">
        <button onClick={handleAddExpense}>💾 Lưu Giao Dịch</button>
        <button onClick={onBack} style={{ marginLeft: "10px" }}>
          🔙 Quay lại
        </button>
      </div>
    </div>
  );
}
