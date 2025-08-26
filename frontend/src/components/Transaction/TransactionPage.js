import { useState, useEffect } from "react";
import AddDailyExpense from "./AddDailyExpense";
import AddCategoryExpense from "./AddCategoryExpense";
import DailyTransactionList from "./DailyTransactionList"; // Import DailyTransactionList
import DateSelector from "./DateSelector";
import "../../styles/TransactionPage.css";

export default function TransactionPage({ userId }) {
  const formatToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Return empty string for invalid dates
    }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState(
    formatToYYYYMMDD(new Date()) // Initialize with current date in YYYY-MM-DD format
  );
  const [showForm, setShowForm] = useState(null); // "daily" | "category" | null
  const [currentExpense, setCurrentExpense] = useState(null);

  // Fetch expense khi thay đổi ngày
  useEffect(() => {
    const fetchExpenseForDate = async () => {
      if (userId && selectedDate) {
        console.log(
          "Fetching expense for userId:",
          userId,
          "and selectedDate:",
          selectedDate
        ); // Added console.log
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
      console.log(
        "Reloading expense for userId:",
        userId,
        "and selectedDate:",
        selectedDate
      ); // Added console.log
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleReload();
    }
  };

  return (
    <div className="transaction-page" onKeyDown={handleKeyDown} tabIndex={0}>
      <h2>Giao dịch chi tiêu</h2>

      {/* Chọn ngày */}
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onFetch={handleReload}
      />

      {/* Hai nút điều khiển */}
      <div className="button-group">
        <button
          className="transaction-button category-expense-button"
          onClick={() => {
            setShowForm("category"); // No longer dependent on currentExpense
          }}
        >
          ➕ Thêm Chi tiêu từng loại
        </button>
      </div>

      {/* Form hiển thị theo nút bấm */}
      {showForm === "category" && (
        <AddCategoryExpense
          onAddCategory={handleReload}
          userId={userId} // Pass userId
          selectedDate={selectedDate} // Pass selectedDate
          expenseId={currentExpense?.expenseId} // Optional: still pass if exists for existing update logic
        />
      )}

      {/* Danh sách giao dịch trong ngày */}
      <DailyTransactionList
        userId={userId} // Pass userId back
        selectedDate={selectedDate}
      />
    </div>
  );
}
