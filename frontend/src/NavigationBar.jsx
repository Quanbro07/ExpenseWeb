import "./NavigationBar.css";

export default function NavBar({ onNavigate }) {
  return (
    <div className="navbar1">
      <div className="glassBar">
        <div className="homePage" onClick={() => onNavigate("profile")}>
          Trang chủ
        </div>
        <div className="personalPage" onClick={() => onNavigate("profile")}>
          Thông tin
        </div>
        <div className="transaction" onClick={() => onNavigate("transaction")}>
          Giao dịch
        </div>
        <div className="credit">Về chúng tôi</div>
        <input type="text" className="searchBar" placeholder="Need a help?" />
      </div>
    </div>
  );
}
