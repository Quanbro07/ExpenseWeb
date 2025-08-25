import { useState } from "react";

export default function AddCategoryExpense({ expenseId, onAddCategory }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("FoodAndDrink");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      amount: parseFloat(amount),
      expenseCategory: category,
      expenseId: expenseId,
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
    <form onSubmit={handleSubmit}>
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
