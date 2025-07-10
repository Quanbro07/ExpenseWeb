import './UserCard.css';
import avatar from './avatar.svg';
import qrcode from './qrcode.png';

export default function UserCard({ user }) {
  console.log(user);

  if (!user) {
    return <div className="userCard">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="userCard">
      <div className="glass">
        <img src={avatar} alt="Avatar" className="avatar" />
        <div className="information">
          <div className="name">{user.userName || "Không tên"}</div>
          <div className="id">ID: {user.id}</div>
          <div className="balance">Số dư: {user.balance ?? 0} VNĐ</div>
        </div>
        <img src={qrcode} alt="QR-CODE" className="qrcode" />
      </div>
    </div>
  );
}