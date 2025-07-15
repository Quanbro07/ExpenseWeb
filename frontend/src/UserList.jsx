import { useEffect, useState } from "react";
import "./UserList.css";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/user/getAll");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            alert("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (id, action) => {
        try {
            const url =
                action === "delete"
                    ? `http://localhost:8080/api/v1/user/delete/${id}`
                    : `http://localhost:8080/api/v1/user/${action}/${id}`;

            const res = await fetch(url, {
                method: action === "delete" ? "DELETE" : "PUT",
            });

            if (!res.ok) throw new Error("Cập nhật thất bại");
            alert("✅ Cập nhật thành công");
            fetchUsers();
        } catch {
            alert("❌ Lỗi khi cập nhật trạng thái người dùng");
        }
    };

    const handlePasswordChange = async (id) => {
        const newPassword = prompt("Nhập mật khẩu mới cho người dùng:");
        if (!newPassword) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/user/updatePassword/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });
            if (!res.ok) throw new Error();
            alert("✅ Đổi mật khẩu thành công");
        } catch {
            alert("❌ Đổi mật khẩu thất bại");
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(u.id).includes(searchTerm)
    );

    return (
        <div className="user-list-container">
            <h2>📋 Danh sách người dùng</h2>
            <input
                className="search-input"
                placeholder="Tìm theo ID hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.active ? "✅ Hoạt động" : "❌ Đã khóa"}</td>
                                <td className="actions">
                                    <button
                                        onClick={() =>
                                            updateUserStatus(user.id, user.active ? "deactivate" : "activate")
                                        }
                                    >
                                        {user.active ? "Deactivate" : "Reactivate"}
                                    </button>
                                    <button onClick={() => updateUserStatus(user.id, "delete")}>
                                        Xóa
                                    </button>
                                    <button onClick={() => handlePasswordChange(user.id)}>
                                        Đổi mật khẩu
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
