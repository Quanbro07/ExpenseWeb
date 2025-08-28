import "./UserCard.css";
import avatar from "./avatar.svg";

export default function UserCard({ user, monthlyLimitedExpense, currentMonthTotalExpense }) {
  console.log("👤 Full user object:", user);

  if (!user) {
    return <div className="userCard">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="userCard">
      <div className="glass">
        <img src={avatar} alt="Avatar" className="avatar" />
        <div className="information">
          <div className="name">{user.userName || "Không tên"}</div>
          <div className="id">ID: {user?.id || "?"}</div>
          <div className="balance">
            Số dư: {user?.balance?.toLocaleString('vi-VN') || 0} VNĐ
          </div>{" "}
          <div className="monthly-limit">
            Hạn mức chi tiêu tháng: {monthlyLimitedExpense.toLocaleString('vi-VN')} VNĐ
          </div>
          <div className="monthly-total-expense">
            Tổng chi tiêu tháng này: {currentMonthTotalExpense.toLocaleString('vi-VN')} VNĐ
          </div>
          <div className="monthly-remaining">
            Còn lại: {(monthlyLimitedExpense - currentMonthTotalExpense).toLocaleString('vi-VN')} VNĐ
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
