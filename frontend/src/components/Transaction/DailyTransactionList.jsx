import { useState, useEffect } from "react";
import "../../styles/TransactionPage.css"; // Dùng chung style

// Ánh xạ các giá trị enum sang tiếng Việt
const categoryMap = {
  FoodAndDrink: "Ăn uống",
  Transportation: "Đi lại",
  Shopping: "Mua sắm",
  Travel: "Du lịch",
  Health: "Sức khỏe",
  Utilities: "Hóa đơn",
  Education: "Giáo dục",
  Charity: "Từ thiện",
  OTHER: "Khác",
  "Chưa phân loại": "Chưa phân loại", // Xử lý trường hợp mặc định
};

export default function DailyTransactionList({ userId, selectedDate }) {
  const [allTransactionsForDate, setAllTransactionsForDate] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State để theo dõi category được chọn
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      setSelectedCategory(null); // Reset selected category

      try {
        // Fetch all detailed transactions for the selected date
        const resAllTransactions = await fetch(
          `http://localhost:8080/api/v1/expense/get?userId=${userId}&expenseDate=${selectedDate}`
        );
        if (!resAllTransactions.ok) {
          throw new Error(
            "Không thể lấy dữ liệu giao dịch chi tiết cho ngày này."
          );
        }
        const allFetchedTransactions = await resAllTransactions.json();
        // Ensure allFetchedTransactions is an array, even if API returns null/empty object
        setAllTransactionsForDate(
          Array.isArray(allFetchedTransactions) ? allFetchedTransactions : []
        );

        // Fetch grouped categories for the selected date
        const resCategories = await fetch(
          `http://localhost:8080/api/v1/expense-category/get?userId=${userId}&fromDate=${selectedDate}&toDate=${selectedDate}`
        );
        if (!resCategories.ok) {
          throw new Error("Không thể lấy dữ liệu chi tiêu tổng thể theo loại.");
        }
        const fetchedCategories = await resCategories.json();
        setGroupedCategories(fetchedCategories);
      } catch (err) {
        console.error("Lỗi khi tải giao dịch hàng ngày:", err);
        setError("Không thể tải chi tiêu cho ngày này.");
        setAllTransactionsForDate([]);
        setGroupedCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId && selectedDate) {
      fetchTransactions();
    }
  }, [userId, selectedDate]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToSummary = () => {
    setSelectedCategory(null);
  };

  // Lọc các giao dịch chi tiết cho category được chọn
  const detailedTransactions = allTransactionsForDate.filter(
    (transaction) =>
      (transaction.expenseCategory || "Chưa phân loại") === selectedCategory
  );

  if (loading) {
    return <div className="loading-message">Đang tải chi tiêu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="daily-transaction-list">
      {selectedCategory ? (
        <div className="daily-transaction-detail-list">
          <button onClick={handleBackToSummary} className="back-button">
            &larr; Quay lại
          </button>
          <h3>
            Chi tiết {categoryMap[selectedCategory] || selectedCategory} trong
            ngày {selectedDate}:
          </h3>
          <ul>
            {detailedTransactions.length > 0 ? (
              detailedTransactions.map((transaction) => (
                <li
                  key={transaction.expenseId}
                  className="transaction-detail-item"
                >
                  <div className="firstCol">
                    <span className="transdt">
                      {new Date(transaction.expenseDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                    <span className="transmoney">
                      - {transaction.amount.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <div className="secondCol">
                    <span>{transaction.description}</span>
                  </div>
                </li>
              ))
            ) : (
              <div className="no-transactions">
                Không có chi tiết cho loại này.
              </div>
            )}
          </ul>
        </div>
      ) : (
        <>
          <h3>Tổng chi tiêu theo loại cho ngày {selectedDate}:</h3>
          {groupedCategories.length === 0 ? (
            <p className="no-transactions">
              Không có chi tiêu nào được ghi nhận cho ngày này.
            </p>
          ) : (
            <ul>
              {groupedCategories.map((item) => (
                <li
                  key={item.expenseCategory}
                  className="category-summary-item"
                  onClick={() => handleCategoryClick(item.expenseCategory)}
                >
                  <span className="category-name">
                    {categoryMap[item.expenseCategory] || item.expenseCategory}
                  </span>
                  <span className="category-amount">
                    - {item.amount.toLocaleString()} VNĐ
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
