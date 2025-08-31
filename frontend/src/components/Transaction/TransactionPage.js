import { useState, useEffect } from "react";
import AddDailyExpense from "./AddDailyExpense";
import AddCategoryExpense from "./AddCategoryExpense";
import DailyTransactionList from "./DailyTransactionList"; // Import DailyTransactionList
import DateSelector from "./DateSelector";
import "../../styles/TransactionPage.css";

export default function TransactionPage({ user, onBack, onSuccess }) {
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
  const [monthlyLimitedExpense, setMonthlyLimitedExpense] = useState(0); // New state
  const [currentMonthTotalExpense, setCurrentMonthTotalExpense] = useState(0); // New state
  const [hasAlertShown, setHasAlertShown] = useState(false); // New state to control alert display

  // Fetch monthly limited expense
  useEffect(() => {
    const fetchMonthlyLimitedExpense = async () => {
      if (!user || !user.id) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/balance/get-monthly-status?userId=${user.id}` // Corrected API endpoint to getMonthlyStatus
        );
        if (res.ok) {
          const data = await res.json();
          // Assuming getMonthlyStatus returns an object with monthlyLimitedExpense
          setMonthlyLimitedExpense(data.monthlyLimitedExpense || 0);
          // If getMonthlyStatus also returns current month's expense, we can use it here
          // For now, we will keep calculating it in handleReload
        } else {
          console.error(
            "Failed to fetch monthly limited expense from getMonthlyStatus"
          );
          setMonthlyLimitedExpense(0);
        }
      } catch (error) {
        console.error(
          "Error fetching monthly limited expense from getMonthlyStatus:",
          error
        );
        setMonthlyLimitedExpense(0);
      }
    };
    fetchMonthlyLimitedExpense();
  }, [user]);

  // Fetch expense khi thay đổi ngày (và cũng được gọi bởi handleReload)
  useEffect(() => {
    const fetchExpenseForDate = async () => {
      if (user && user.id && selectedDate) {
        console.log(
          "Fetching expense for userId:",
          user.id,
          "and selectedDate:",
          selectedDate
        );
        try {
          const res = await fetch(
            `http://localhost:8080/api/v1/expense/get?userId=${user.id}&expenseDate=${selectedDate}`
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
  }, [user, selectedDate]);

  // Reset hasAlertShown when selectedDate changes
  useEffect(() => {
    setHasAlertShown(false);
  }, [selectedDate]);

  const handleReload = async () => {
    if (user && user.id) {
      console.log(
        "Reloading expense and checking monthly limit for userId:",
        user.id
      );
      try {
        // Fetch all expenses for the current month
        const resAllExpenses = await fetch(
          `http://localhost:8080/api/v1/expense/getAll?userId=${user.id}`
        );
        if (!resAllExpenses.ok) {
          throw new Error(
            "Không thể lấy tất cả giao dịch để kiểm tra giới hạn."
          );
        }
        const allExpenses = await resAllExpenses.json();

        const currentMonth = new Date(selectedDate).getMonth();
        const currentYear = new Date(selectedDate).getFullYear();

        const totalExpenseThisMonth = allExpenses.reduce((sum, transaction) => {
          const transactionDate = new Date(transaction.expenseDate);
          if (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          ) {
            return sum + transaction.amount;
          }
          return sum;
        }, 0);
        setCurrentMonthTotalExpense(totalExpenseThisMonth);

        console.log("Monthly Limited Expense:", monthlyLimitedExpense); // Added console.log
        console.log("Current Month Total Expense:", totalExpenseThisMonth); // Added console.log

        // Check if monthly expense exceeds limit and show alert
        if (
          monthlyLimitedExpense > 0 &&
          totalExpenseThisMonth > monthlyLimitedExpense &&
          !hasAlertShown
        ) {
          alert("Vượt giới hạn chi tiêu hàng tháng! Vui lòng cân chỉnh lại.");
          setHasAlertShown(true);
        }

        // Also re-fetch current day's expense
        const resCurrentDayExpense = await fetch(
          `http://localhost:8080/api/v1/expense/get?userId=${user.id}&expenseDate=${selectedDate}`
        );
        if (resCurrentDayExpense.ok) {
          const data = await resCurrentDayExpense.json();
          console.log("✅ Data:", data);
          console.log("✅ Expense ID:", data.expenseId);
          setCurrentExpense(data);
        } else {
          console.log("No expense found for selected date");
          setCurrentExpense(null);
        }

        onSuccess?.(); // Trigger success callback from App.js if needed
      } catch (error) {
        console.error("Error reloading expense or checking limit:", error);
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

      {/* Nút Thêm Chi tiêu từng loại */}
      <div className="button-group">
        <button
          className="transaction-button category-expense-button"
          onClick={() => {
            setShowForm("category");
          }}
        >
          ➕ Thêm Chi tiêu từng loại
        </button>
      </div>

      {/* Form thêm chi tiêu theo loại */}
      {showForm === "category" && (
        <AddCategoryExpense
          onAddCategory={handleReload}
          userId={user.id} // Pass userId from user prop
          selectedDate={selectedDate}
          expenseId={currentExpense?.expenseId}
        />
      )}

      {/* Danh sách giao dịch trong ngày */}
      <DailyTransactionList
        userId={user.id} // Pass userId from user prop
        selectedDate={selectedDate}
      />
    </div>
  );
}
