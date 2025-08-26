import "./NavigationBar.css";

export default function NavBar({ onNavigate }) {
  return (
    <div className="navbar1">
      <div className="glassBar">
        <div className="nav-item" onClick={() => onNavigate("profile")}>
          <span>Trang chủ</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate("profile")}>
          <span>Thông tin</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate("transaction")}>
          <span>Giao dịch</span>
        </div>
        <div className="nav-item">
          <span>Về chúng tôi</span>
        </div>
        <input type="text" className="searchBar" placeholder="Need a help?" />
      </div>
    </div>
  );
}
