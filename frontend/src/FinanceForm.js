import { useState } from "react";
import "./LoginForm.css";
export default function FinanceForm({ userId, onSubmit }) {
  const [salary, setSalary] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [balance, setBalance] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      currentBalance: parseFloat(balance),
      salary: parseFloat(salary),
      monthlyLimitedExpense: parseFloat(monthlyLimit),
      update_at: new Date().toISOString().split("T")[0],
      userId,
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/balance/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Lỗi khi lưu thông tin tài chính");
        return;
      }

      alert("Lưu thành công!");
      onSubmit();
    } catch {
      alert("Lỗi kết nối backend");
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <h2>Thông Tin Tài Chính</h2>
      <input
        type="number"
        placeholder="Lương hàng tháng"
        required
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <input
        type="number"
        placeholder="Hạn mức chi tiêu/tháng"
        required
        value={monthlyLimit}
        onChange={(e) => setMonthlyLimit(e.target.value)}
      />
      <input
        type="number"
        placeholder="Số dư hiện tại"
        required
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />
      <button type="submit">Lưu thông tin</button>
    </form>
  );
}
