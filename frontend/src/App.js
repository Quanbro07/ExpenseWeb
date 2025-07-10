import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import FinanceForm from "./FinanceForm";
import ProfileShow from "./pages/ProfileShow";
import "./App.css";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userData, setUserData] = useState(null); // chứa { email, username, id }

  // ✅ Khi đăng ký thành công
  const handleRegister = (userInfo) => {
    setIsNewUser(true);
    setUserData(userInfo);
    setCurrentForm("finance");
  };

  // ✅ Khi nhập thông tin tài chính xong
  const handleFinanceSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/user/${userData.username}`
      );
      if (!res.ok) throw new Error("Không thể lấy lại dữ liệu người dùng");

      const updatedUser = await res.json();
      setUserData(updatedUser);
      setCurrentForm("profile");
    } catch (err) {
      alert("Lỗi khi tải lại thông tin sau khi nhập tài chính");
    }
  };

  // ✅ Khi đăng nhập thành công
  const handleLoginSuccess = async (loginData) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/user/get?id=${loginData.id}`
      );
      if (!res.ok) throw new Error("Không lấy được thông tin người dùng");

      const fullUser = await res.json(); // Lấy dữ liệu chi tiết từ backend
      setUserData(fullUser);
      setCurrentForm("profile");
    } catch (err) {
      alert("Lỗi khi lấy dữ liệu người dùng từ backend");
    }
  };

  // ✅ Giao diện chính
  return (
    <>
      {currentForm === "profile" && userData ? (
        <ProfileShow user={userData} />
      ) : (
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
        </div>
      )}
    </>
  );
}

export default App;
