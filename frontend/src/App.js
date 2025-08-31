import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import FinanceForm from "./FinanceForm";
import ProfileShow from "./pages/ProfileShow";
import TransactionPage from "./components/Transaction/TransactionPage";
import StatisticDashboard from "./StatisticDashboard"; // Import StatisticDashboard
import NavBar from "./NavigationBar";
import "./App.css";
import AdminPage from "./AdminPage";
import CustomAlert from "./components/CustomAlert"; // Import CustomAlert

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userData, setUserData] = useState(null);
  const [expenseList, setExpenseList] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null); // State for custom alert
  const [alertType, setAlertType] = useState("error"); // State for custom alert type
  const [monthlyLimitedExpense, setMonthlyLimitedExpense] = useState(0);
  const [currentMonthTotalExpense, setCurrentMonthTotalExpense] = useState(0);

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  // ✅ Lấy chi tiêu
  const handleFetchAllExpenses = async (userIdParam) => {
    const uid = userIdParam || userData?.id;
    if (!uid) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/expense/getAll?userId=${uid}`
      );
      if (!res.ok) throw new Error("Không thể lấy dữ liệu chi tiêu");

      const data = await res.json();
      console.log("✅ Chi tiêu từ backend:", data);
      setExpenseList(data);
      console.log("✅ Chi tiêu từ frontend:", expenseList);
    } catch (err) {
      setAlertMessage("Lỗi khi tải dữ liệu chi tiêu người dùng");
      setAlertType("error");
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
      setAlertMessage("Lỗi khi lấy dữ liệu số dư người dùng");
      setAlertType("error");
      console.error(err);
    }
  };

  // ✅ Lấy hạn mức và tổng chi tiêu tháng từ backend
  const handleFetchMonthlyStatus = async (userIdParam) => {
    const uid = userIdParam || userData?.id;
    if (!uid) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/balance/get-monthly-status?userId=${uid}`
      );
      if (!res.ok) throw new Error("Không thể lấy hạn mức và tổng chi tiêu tháng");

      const data = await res.json();
      setMonthlyLimitedExpense(data.monthlyLimitedExpense || 0);
      setCurrentMonthTotalExpense(data.monthlyExpense || 0); // Use monthlyExpense from backend

    } catch (err) {
      setAlertMessage("Lỗi khi lấy dữ liệu hạn mức và tổng chi tiêu tháng");
      setAlertType("error");
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

      // Lấy số dư mới và trạng thái hàng tháng
      await handleFetchBalance(updatedUser.id);
      await handleFetchMonthlyStatus(updatedUser.id);
    } catch (err) {
      setAlertMessage("Lỗi khi tải lại thông tin sau khi nhập tài chính");
      setAlertType("error");
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

      // Check isActive directly in frontend before proceeding
      if (!fullUser.isActive) {
        setAlertMessage("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
        setAlertType("error");
        return; // Stop further execution and navigation
      }

      setUserData(fullUser);

      if (fullUser.role === "Admin") {
        // Changed 0 to "Admin"
        setCurrentForm("admin");
        return; // Dừng ở đây nếu là admin
      } else if (fullUser.role === 1) {
        // Added else if for user role
        await handleFetchAllExpenses(fullUser.id);
        await handleFetchBalance(fullUser.id);
        await handleFetchMonthlyStatus(fullUser.id); // Call to fetch monthly status
        setCurrentForm("profile");
        return; // Dừng ở đây nếu là user
      }
      // If role is neither 0 nor 1, you might want a default behavior or an error.
      // For now, I'll keep the existing line for profile as a fallback if role is not 0.
      // If you want to handle other roles, you would add more else if conditions.
      await handleFetchAllExpenses(fullUser.id);
      await handleFetchBalance(fullUser.id);
      await handleFetchMonthlyStatus(fullUser.id); // Call to fetch monthly status
      setCurrentForm("profile");
    } catch (err) {
      console.error("Login Success Data Fetch Error:", err); // Log the detailed error
      setAlertMessage("Lỗi khi lấy dữ liệu người dùng từ backend");
      setAlertType("error");
    }
  };

  return (
    <>
      {alertMessage && (
        <CustomAlert message={alertMessage} type={alertType} onClose={handleCloseAlert} />
      )}
      {currentForm !== "login" &&
        currentForm !== "register" &&
        currentForm !== "admin" && (
          <NavBar onNavigate={(page) => setCurrentForm(page)} />
        )}

      <div className="app-container">
        {currentForm === "login" && (
          <LoginForm
            onSwitch={() => setCurrentForm("register")}
            onLoginSuccess={handleLoginSuccess}
            setAlertMessage={setAlertMessage} // Pass setAlertMessage to LoginForm
            setAlertType={setAlertType} // Pass setAlertType to LoginForm
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
          <ProfileShow
            user={userData}
            expenseList={expenseList}
            monthlyLimitedExpense={monthlyLimitedExpense}
            currentMonthTotalExpense={currentMonthTotalExpense}
          />
        )}

        {currentForm === "transaction" && userData && (
          <TransactionPage
            user={userData} // Pass the entire user object
            onBack={() => setCurrentForm("profile")}
            onSuccess={() => {
              handleFetchAllExpenses(userData.id);
              handleFetchBalance(userData.id);
              handleFetchMonthlyStatus(userData.id); // Also re-fetch monthly status on success
            }}
          />
        )}

        {currentForm === "statistics" && userData && (
          <StatisticDashboard
            transactions={expenseList}
            monthlyLimitedExpense={monthlyLimitedExpense}
            currentMonthTotalExpense={currentMonthTotalExpense}
          />
        )}

        {currentForm === "admin" && <AdminPage />}
      </div>
    </>
  );
}

export default App;
