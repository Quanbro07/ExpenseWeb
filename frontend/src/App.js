import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import FinanceForm from "./FinanceForm";
import ProfileShow from "./pages/ProfileShow";
import TransactionPage from "./TransactionPage";
import NavBar from "./NavigationBar";
import "./App.css";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleRegister = (userInfo) => {
    setIsNewUser(true);
    setUserData(userInfo);
    setCurrentForm("finance");
  };

  const handleFinanceSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/user/get?id=${userData.id}`
      );
      if (!res.ok) throw new Error("Không thể lấy lại dữ liệu người dùng");
      console.log("userData.id:", userData.id);

      const updatedUser = await res.json();
      setUserData(updatedUser);
      setCurrentForm("profile");
    } catch (err) {
      alert("Lỗi khi tải lại thông tin sau khi nhập tài chính");
    }
  };

  const handleLoginSuccess = async (loginData) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/user/get?id=${loginData.id}`
      );
      if (!res.ok) throw new Error("Không lấy được thông tin người dùng");

      const fullUser = await res.json();
      setUserData(fullUser);
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
          <ProfileShow user={userData} />
        )}

        {currentForm === "transaction" && userData && (
          <TransactionPage
            userId={userData.id}
            user={userData}
            onBack={() => setCurrentForm("profile")}
          />
        )}
      </div>
    </>
  );
}

export default App;
