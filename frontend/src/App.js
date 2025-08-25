import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import FinanceForm from "./FinanceForm";
import ProfileShow from "./pages/ProfileShow";
import TransactionPage from "./components/Transaction/TransactionPage";
import Transaction from "./Transaction";
import NavBar from "./NavigationBar";
import "./App.css";
import AdminPage from "./AdminPage";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userData, setUserData] = useState(null);
  const [expenseList, setExpenseList] = useState([]);

  // ✅ Lấy chi tiêu
  const handleFetchAllExpenses = async (userIdParam) => {
    const uid = userIdParam || userData?.id;
    if (!uid) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/expense/get?userId=${uid}`
      );
      if (!res.ok) throw new Error("Không thể lấy dữ liệu chi tiêu");

      const data = await res.json();
      console.log("✅ Chi tiêu từ backend:", data);
      setExpenseList(data);
    } catch (err) {
      alert("Lỗi khi tải dữ liệu chi tiêu người dùng");
      console.error(err);
    }
  };

  // ✅ Lấy số dư
  const handleFetchBalance = async (userIdParam) => {
    const uid = userIdParam || userData?.id;
    if (!uid) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/balance/get?userId=${uid}`
      );
      if (!res.ok) throw new Error("Không thể lấy số dư");

      const balanceData = await res.json();
      console.log("💰 Số dư từ backend:", balanceData);

      setUserData((prev) => ({
        ...prev,
        balance: balanceData.currentBalance,
      }));
    } catch (err) {
      alert("Lỗi khi lấy dữ liệu số dư người dùng");
      console.error(err);
    }
  };

  // ✅ Đăng ký → sang nhập tài chính
  const handleRegister = (userInfo) => {
    setIsNewUser(true);
    setUserData(userInfo);
    setCurrentForm("finance");
  };

  // ✅ Gửi xong tài chính → cập nhật dữ liệu người dùng
  const handleFinanceSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/user/get?id=${userData.id}`
      );
      if (!res.ok) throw new Error("Không thể lấy lại dữ liệu người dùng");

      const updatedUser = await res.json();
      setUserData(updatedUser);
      setCurrentForm("profile");

      // Lấy số dư mới
      await handleFetchBalance(updatedUser.id);
    } catch (err) {
      alert("Lỗi khi tải lại thông tin sau khi nhập tài chính");
    }
  };

  // ✅ Đăng nhập → lấy user, số dư, chi tiêu
  const handleLoginSuccess = async (loginData) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/user/get?id=${loginData.id}`
      );
      if (!res.ok) throw new Error("Không lấy được thông tin người dùng");

      const fullUser = await res.json();
      console.log("👤 User từ backend:", fullUser);
      setUserData(fullUser);

      if (fullUser.role === "ADMIN") {
        setCurrentForm("admin");
        return; // Dừng ở đây nếu là admin
      }

      await handleFetchAllExpenses(fullUser.id);
      await handleFetchBalance(fullUser.id);
      setCurrentForm("profile");
    } catch (err) {
      alert("Lỗi khi lấy dữ liệu người dùng từ backend");
    }
  };

  return (
    <>
      {currentForm !== "login" && currentForm !== "register" && (
        <NavBar onNavigate={(page) => setCurrentForm(page)} />
      )}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button
          onClick={() => setCurrentForm("admin")}
          className="SettingButton"
        >
          🔧 Mở Admin (DEV)
        </button>
        <button
          onClick={() => setCurrentForm("profile")}
          className="SettingButton"
        >
          👤 Mở Profile (DEV)
        </button>
      </div>
      <div className="app-container">
        {currentForm === "login" && (
          <LoginForm
            onSwitch={() => setCurrentForm("register")}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentForm === "register" && (
          <RegisterForm
            onRegister={handleRegister}
            onSwitch={() => setCurrentForm("login")}
          />
        )}

        {currentForm === "finance" && isNewUser && userData?.id && (
          <FinanceForm userId={userData.id} onSubmit={handleFinanceSubmit} />
        )}

        {currentForm === "profile" && userData && (
          <ProfileShow user={userData} expenseList={expenseList} />
        )}

        {currentForm === "transaction" && userData && (
          <>
            <TransactionPage
              userId={userData.id}
              user={userData}
              onBack={() => setCurrentForm("profile")}
              onSuccess={() => {
                handleFetchAllExpenses(userData.id);
                handleFetchBalance(userData.id);
              }}
            />
            <Transaction
              user={userData}
              expenseList={expenseList}
              onFetchAll={handleFetchAllExpenses}
            />
          </>
        )}
        {currentForm === "admin" && <AdminPage />}
      </div>
    </>
  );
}

export default App;
