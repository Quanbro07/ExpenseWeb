import { useState } from "react";

export default function AddCategoryExpense({
  expenseId,
  userId,
  selectedDate,
  onAddCategory,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("FoodAndDrink");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let currentExpenseId = expenseId; // Bắt đầu với expenseId hiện có nếu có

    // Nếu chưa có expenseId cho ngày này, tạo một tổng chi tiêu mới trước
    if (!currentExpenseId) {
      try {
        const createExpenseRes = await fetch(
          "http://localhost:8080/api/v1/expense/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              expenseDate: selectedDate,
              amount: 0, // Khởi tạo tổng chi tiêu là 0
              description: "Tổng chi tiêu trong ngày",
            }),
          }
        );

        if (!createExpenseRes.ok) {
          // Nếu có conflict, tức là expense đã tồn tại, chúng ta có thể bỏ qua hoặc fetch lại expenseId
          if (createExpenseRes.status === 409) {
            const getExpenseRes = await fetch(
              `http://localhost:8080/api/v1/expense/get?userId=${userId}&expenseDate=${selectedDate}`
            );
            if (getExpenseRes.ok) {
              const existingExpense = await getExpenseRes.json();
              currentExpenseId = existingExpense.expenseId;
            } else {
              throw new Error("Không thể lấy Expense ID đã tồn tại.");
            }
          } else {
            throw new Error("Không thể tạo tổng chi tiêu mới.");
          }
        }
        const newExpense = await createExpenseRes.json();
        currentExpenseId = newExpense.expenseId; // Cập nhật expenseId mới
      } catch (err) {
        console.error("Lỗi khi tạo tổng chi tiêu:", err);
        alert("Có lỗi khi tạo tổng chi tiêu cho ngày này.");
        return;
      }
    }

    const categoryData = {
      amount: parseFloat(amount),
      expenseCategory: category,
      expenseId: currentExpenseId,
    };

    try {
      // Thử gọi create trước
      let res = await fetch(
        "http://localhost:8080/api/v1/expense-category/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        }
      );

      // Nếu đã tồn tại category → update thay thế
      if (res.status === 409) {
        console.log("Category existed → updating instead...");
        res = await fetch(
          "http://localhost:8080/api/v1/expense-category/update",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryData),
          }
        );
      }

      if (!res.ok) throw new Error("Failed to add/update expense category");

      const data = await res.json();
      console.log("✅ Category saved:", data);
      onAddCategory?.(data); // reload lại expense list
      setAmount("");
      setCategory("FoodAndDrink");
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi lưu Category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-category-expense-form">
      <h3>Thêm chi tiêu theo loại</h3>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="FoodAndDrink">Ăn uống</option>
        <option value="Transportation">Đi lại</option>
        <option value="Shopping">Mua sắm</option>
        <option value="Travel">Du lịch</option>
        <option value="Health">Sức khỏe</option>
        <option value="Utilities">Hóa đơn</option>
        <option value="Education">Giáo dục</option>
        <option value="Charity">Từ thiện</option>
        <option value="OTHER">Khác</option>
      </select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Nhập số tiền"
        required
      />

      <button type="submit">Lưu</button>
    </form>
  );
}
