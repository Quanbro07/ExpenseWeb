import { useEffect, useState } from "react";
import "./TransactionPage.css";

export default function TransactionPage({ userId, user }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [expensesOfDay, setExpensesOfDay] = useState([]); // Danh sách chi tiêu trong ngày
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("none");
  const [expenseId, setExpenseId] = useState(null);

  const [totalSpent, setTotalSpent] = useState(0);

  // Khi chọn ngày → lấy expense tổng ngày (nếu có)
  const fetchExpenseByDate = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/expense/get?userId=${userId}`
      );
      const allExpenses = await res.json();

      const matching = allExpenses.find((e) => e.expenseDate === selectedDate);

      if (matching) {
        setExpensesOfDay(matching.expenseCategories || []);
        setExpenseId(matching.id);

        // tính tổng chi tiêu ngày
        const categorySum = (matching.expenseCategories || []).reduce(
          (sum, item) => sum + item.amount,
          0
        );
        const total = matching.amount + categorySum;
        setTotalSpent(total);
      } else {
        setExpensesOfDay([]);
        setExpenseId(null);
        setTotalSpent(0);
      }
    } catch (err) {
      console.error("Lỗi lấy expense theo ngày:", err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!selectedDate || !amount) return alert("Vui lòng nhập đủ thông tin");

    if (category === "none") {
      const payload = {
        expenseDate: selectedDate,
        amount: parseFloat(amount),
        description,
        userId,
      };
      await fetch("http://localhost:8080/api/v1/expense/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      const payload = {
        amount: parseFloat(amount),
        expenseCategory: category,
        expenseId,
      };
      await fetch("http://localhost:8080/api/v1/expense-category/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setAmount("");
    setDescription("");
    fetchExpenseByDate();
  };

  return (
    <div className="form-box">
      <h2>Giao Dịch Chi Tiêu</h2>

      {!selectedDate ? (
        <div>
          <p>Mời bạn thêm ngày tháng năm vào:</p>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={fetchExpenseByDate}>Xem chi tiêu ngày</button>
        </div>
      ) : (
        <>
          <p>
            Ngày: <strong>{selectedDate}</strong>
          </p>

          <h4>Hạn mức tháng: {user.dailyAmount?.toLocaleString()} VNĐ</h4>
          <h4>Tổng đã chi hôm đó: {totalSpent.toLocaleString()} VNĐ</h4>

          {user.dailyAmount && totalSpent > user.dailyAmount && (
            <p style={{ color: "red" }}>
              ⚠️ Bạn đã vượt hạn mức chi tiêu tháng!
            </p>
          )}
          {user.dailyAmount && totalSpent <= user.dailyAmount && (
            <p style={{ color: "green" }}>
              ✅ Bạn còn lại {(user.dailyAmount - totalSpent).toLocaleString()}{" "}
              VNĐ trong tháng.
            </p>
          )}

          <h4>Bảng chi tiêu trong ngày</h4>
          {expensesOfDay.length === 0 ? (
            <p>Chưa có chi tiêu nào.</p>
          ) : (
            <ul>
              {expensesOfDay.map((item, i) => (
                <li key={i}>
                  {item.expenseCategory}: {item.amount.toLocaleString()} VNĐ
                </li>
              ))}
            </ul>
          )}

          <hr />
          <h4>Thêm chi tiêu</h4>
          <form onSubmit={handleAddExpense}>
            <label>Loại chi tiêu:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="none">(Không nhớ loại)</option>
              <option value="DI_LAI">Đi lại</option>
              <option value="DI_CHO">Đi chợ</option>
              <option value="GIAI_TRI">Giải trí</option>
              <option value="KHAC">Khác</option>
            </select>

            <input
              type="number"
              placeholder="Số tiền"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            {category === "none" && (
              <input
                type="text"
                placeholder="Ghi chú (tuỳ chọn)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}

            <button type="submit">Thêm</button>
          </form>
        </>
      )}
    </div>
  );
}
