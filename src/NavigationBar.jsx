import './NavigationBar.css'
export default function NavBar() {
    return (
        <div className="navbar1">
            <div className="glassBar">
                <div className="homePage">Trang chủ</div>
                <div className="personalPage">Thông tin</div>
                <div className="transaction">Giao dịch</div>
                <div className="credit">Về chúng tôi</div>
                <input type="text" className="searchBar" placeholder='Need a help?' />
            </div>
        </div>
    )
}