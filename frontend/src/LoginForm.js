import { useState } from "react";
import "./LoginForm.css";

export default function LoginForm({ onSwitch, onLoginSuccess, setAlertMessage, setAlertType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // Removed internal alert state and functions

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null); // Clear previous alerts from App.js

    try {
      const res = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("Login Response Status:", res.status); // Log status
      console.log("Login Response Data:", data);     // Log data

      if (!res.ok) {
        // Use the setAlertMessage and setAlertType from props
        if (res.status === 403) {
          setAlertMessage(data.message || "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
          setAlertType("error");
          return; // Stop execution if 403
        } else {
          setAlertMessage(data.message || "Thông tin không hợp lệ");
          setAlertType("error");
          return; // Stop execution for other errors
        }
      }

      // 👇 Kiểm tra kỹ xem data có phải chứa user info không
      if (onLoginSuccess && typeof onLoginSuccess === "function") {
        onLoginSuccess(data);
      }
    } catch (err) {
      console.error("Login Error:", err); // Log the error for debugging
      setAlertMessage("Lỗi kết nối tới server hoặc xử lý phản hồi!");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-box" onSubmit={handleLogin}>
      <h2>Đăng Nhập</h2>

      {/* Removed internal CustomAlert rendering */}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      <p>
        Chưa có tài khoản?{" "}
        <span className="link" onClick={onSwitch}>
          Đăng ký
        </span>
      </p>
    </form>
  );
}
