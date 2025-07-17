import { useState, useEffect, useCallback } from "react";
import ExpenseTable from "./ExpenseTable";
import ExpenseSummary from "./ExpenseSummary";
import "../styles/TransactionPage.css";

const CATEGORY_OPTIONS = [
  { value: "FoodAndDrink", label: "Ăn uống" },
  { value: "Transportation", label: "Di chuyển" },
  { value: "Shopping", label: "Mua sắm" },
  { value: "Travel", label: "Du lịch" },
  { value: "Health", label: "Sức khỏe" },
  { value: "Utilities", label: "Tiện ích" },
  { value: "Education", label: "Giáo dục" },
  { value: "Charity", label: "Từ thiện" },
  { value: "OTHER", label: "Khác" },
];

export default function TransactionPage({ userId, onBack }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [selectedDate, setSelectedDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseId, setExpenseId] = useState(null); // id bản ghi expense theo ngày

  const fetchExpenses = useCallback(async () => {
    if (!selectedDate) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/expense/getByDate?date=${selectedDate}&userId=${userId}`
      );
      const data = await res.json();
      setExpenses(data?.categories || []);
      setExpenseId(data?.id || null);
      calculateTotal(data?.categories || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }, [selectedDate, userId]);

  const calculateTotal = (categories) => {
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    setTotalExpenses(total);
  };

  const ensureExpenseExists = async () => {
    if (expenseId) return expenseId;

    const payload = {
      userId,
      amount: 0, // ban đầu 0, có thể cập nhật sau
      description: "Tổng chi tiêu ngày",
      expenseDate: selectedDate,
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/expense/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        // nếu đã tồn tại thì fetch lại
        await fetchExpenses();
        return expenseId;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const created = await res.json();
      setExpenseId(created.id);
      return created.id;
    } catch (err) {
      console.error("Lỗi tạo expense tổng:", err);
      alert("Không thể tạo expense ngày");
      return null;
    }
  };

  const handleAddCategory = async () => {
    if (!amount || !selectedDate) {
      alert("Hãy nhập số tiền và ngày");
      return;
    }

    const expenseIdCreated = await ensureExpenseExists();
    if (!expenseIdCreated) return;

    const payload = {
      amount: parseFloat(amount),
      expenseCategory: category,
      expenseId: expenseIdCreated,
    };

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/expense-category/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      alert("✅ Đã thêm mục chi tiêu!");

      setAmount("");
      setCategory("OTHER");
      setDescription("");
      fetchExpenses();
    } catch (err) {
      console.error("Lỗi thêm category:", err);
      alert("Không thể thêm mục chi tiêu");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="transaction-container">
      <h2>Giao dịch chi tiêu</h2>

      <div className="date-range">
        <label>Chọn ngày:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setExpenseId(null); // reset expenseId khi đổi ngày
          }}
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
        <label>Danh mục:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
        <button onClick={handleAddCategory}>💾 Thêm mục</button>
        <button onClick={onBack} style={{ marginLeft: "10px" }}>
          🔙 Quay lại
        </button>
      </div>

      <ExpenseTable expenses={expenses} />
      <ExpenseSummary totalExpenses={totalExpenses} />
    </div>
  );
}
