import "./NavigationBar.css";

export default function NavBar({ onNavigate }) {
  return (
    <div className="navbar1">
      <div className="glassBar">
        <div className="nav-item" onClick={() => onNavigate("profile")}>
          <span>Thông tin</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate("transaction")}>
          <span>Giao dịch</span>
        </div>
        <input className="nav-item" type="text"  placeholder="Need a help?" />
      </div>
    </div>
  );
}
