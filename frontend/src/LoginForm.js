import { useState } from "react";
import "./App.css";

export default function LoginForm({ onSwitch, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ Lỗi: " + (data.message || "Thông tin không hợp lệ"));
        return;
      }

      alert("✅ Đăng nhập thành công!");

      // 👇 Kiểm tra kỹ xem data có phải chứa user info không
      if (onLoginSuccess && typeof onLoginSuccess === "function") {
        onLoginSuccess(data);
      }
    } catch (err) {
      alert("❌ Lỗi kết nối tới server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-box" onSubmit={handleLogin}>
      <h2>Đăng Nhập</h2>

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
