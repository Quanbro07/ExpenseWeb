import { useState } from "react";

export default function AddDailyExpense({ userId, selectedDate, onAdd }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      userId: userId,
      expenseDate: selectedDate,
      amount: parseFloat(amount),
      description: description,
    };

    try {
      // thử gọi POST /create trước
      let res = await fetch("http://localhost:8080/api/v1/expense/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      // nếu backend báo conflict (409) nghĩa là ngày này đã tồn tại
      if (res.status === 409) {
        console.log("Expense existed → updating instead...");
        res = await fetch("http://localhost:8080/api/v1/expense/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        });
      }

      if (!res.ok) throw new Error("Failed to add/update expense");

      const data = await res.json();
      console.log("✅ Expense saved:", data);
      onAdd?.(data); // reload lại list expense
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi lưu Expense");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Thêm tổng chi tiêu</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Nhập số tiền"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
      />
      <button type="submit">Lưu</button>
    </form>
  );
}
