import "../../styles/TransactionPage.css";

export default function DateSelector({
  selectedDate,
  setSelectedDate,
  onFetch,
}) {
  const handleChange = (e) => {
    setSelectedDate(e.target.value); // cập nhật ngày khi người dùng chọn
  };

  return (
    <div className="date-range">
      <label>Chọn ngày:</label>
      <input type="date" value={selectedDate} onChange={handleChange} />
      <button onClick={onFetch}>Lấy dữ liệu</button>
    </div>
  );
}
