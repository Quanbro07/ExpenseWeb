import { useState, useEffect } from "react";
import DateSelector from "./DateSelector";
import AddDailyExpense from "./AddDailyExpense";
import AddCategoryExpense from "./AddCategoryExpense";
import ExpenseList from "./ExpenseList";
import "../../styles/TransactionPage.css";

export default function TransactionPage({ userId }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(null); // "daily" | "category" | null
  const [currentExpense, setCurrentExpense] = useState(null);

  // Fetch expense khi thay đổi ngày
  useEffect(() => {
    const fetchExpenseForDate = async () => {
      if (userId && selectedDate) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/v1/expense/get?userId=${userId}&expenseDate=${selectedDate}`
          );
          if (res.ok) {
            const data = await res.json();
            setCurrentExpense(data); // data đã có expenseId từ ExpenseResponseIdDTO
          } else if (res.status === 404) {
            setCurrentExpense(null);
          } else {
            throw new Error(`Failed to fetch expense: ${res.statusText}`);
          }
        } catch (error) {
          console.error("Error fetching expense for date:", error);
          setCurrentExpense(null);
        }
      }
    };

    fetchExpenseForDate();
  }, [userId, selectedDate]);

  const handleReload = async () => {
    if (userId && selectedDate) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/expense/get?userId=${userId}&expenseDate=${selectedDate}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log("✅ Data:", data);
          console.log("✅ Expense ID:", data.expenseId);
          setCurrentExpense(data);
        } else {
          console.log("No expense found for selected date");
          setCurrentExpense(null);
        }
      } catch (error) {
        console.error("Error reloading expense:", error);
        setCurrentExpense(null);
      }
    }
  };

  return (
    <div className="transaction-page">
      <h2>Giao dịch chi tiêu</h2>

      {/* Chọn ngày */}
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate} // ✅ sửa: dùng setSelectedDate thay vì onDateChange
        onFetch={handleReload}
      />

      {/* Hai nút điều khiển */}
      <div className="button-group">
        <button
          className="transaction-button daily-expense-button"
          onClick={() => setShowForm("daily")}
        >
          ➕ Thêm Tổng chi tiêu
        </button>
        <button
          className="transaction-button category-expense-button"
          onClick={() => {
            if (!currentExpense) {
              alert("⚠️ Bạn cần thêm tổng chi tiêu trước!");
              return;
            }
            setShowForm("category");
          }}
        >
          ➕ Thêm Chi tiêu từng loại
        </button>
      </div>

      {/* Form hiển thị theo nút bấm */}
      {showForm === "daily" && (
        <AddDailyExpense
          onAdd={handleReload}
          userId={userId}
          selectedDate={selectedDate}
        />
      )}

      {showForm === "category" && currentExpense && (
        <AddCategoryExpense
          onAddCategory={handleReload}
          expenseId={currentExpense.expenseId} // ✅ chỉ truyền expenseId
        />
      )}

      {/* Danh sách chi tiêu trong ngày */}
      <ExpenseList categories={currentExpense?.expenseCategoryList || []} />
    </div>
  );
}
