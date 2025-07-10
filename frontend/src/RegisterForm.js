import { useState } from "react";
import "./LoginForm.css";

export default function RegisterForm({ onRegister, onSwitch }) {
  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState(""); // nếu backend yêu cầu username
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Lỗi: " + data.message);
        return;
      }

      // Gọi callback để mở form nhập tài chính, kèm theo userId
      onRegister({
        email: data.email,
        id: data.id,
        username: data.username,
      });
    } catch (err) {
      alert("Lỗi kết nối tới backend");
    }
  };

  return (
    <form className="form-box" onSubmit={handleRegister}>
      <h2>Đăng Ký</h2>
      <input
        type="text"
        placeholder="Tên người dùng"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
      <button type="submit">Tạo tài khoản</button>
      <p>
        Đã có tài khoản?{" "}
        <span className="link" onClick={onSwitch}>
          Đăng nhập
        </span>
      </p>
    </form>
  );
}
