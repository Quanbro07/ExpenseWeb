import "../../styles/TransactionPage.css";

export default function DateSelector({
  selectedDate,
  setSelectedDate,
  onFetch,
}) {
  const handleChange = (e) => {
    const newDateValue = e.target.value;
    setSelectedDate(newDateValue); // Pass the raw value from input to parent
    if (newDateValue) {
      onFetch(); // Tự động fetch khi ngày thay đổi
    }
  };

  return (
    <div className="date-range">
      <label htmlFor="date-input">Ngày:</label>
      <input
        id="date-input"
        type="date"
        value={selectedDate} // Value will be formatted by parent now
        onChange={handleChange}
      />
      {/* Removed the "Lấy dữ liệu" button */}
    </div>
  );
}
