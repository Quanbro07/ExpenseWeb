import { useEffect, useState } from "react";
import "./UserList.css";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/v1/user/getAll");
            const data = await res.json();
            console.log("List: ", data)
            setUsers(data);
        } catch (err) {
            alert("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };


    const updateUserStatus = async (id, action) => {
        try {
            let url;
            let method;

            if (action === "delete") {
                if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
                    return; // Người dùng hủy xóa
                }
                url = `http://localhost:8080/api/v1/user/delete?id=${id}`;
                method = "DELETE";
            } else if (action === "activate" || action === "deactivate") {
                // Logic cũ cho activate/deactivate (sẽ được cập nhật sau)
                url = `http://localhost:8080/api/v1/user/changeActive?userId=${id}&state=${action === "activate"}`;
                method = "PUT";
            } else {
                // Default case or error
                return;
            }

            const res = await fetch(url, {
                method: method,
            });

            if (!res.ok) throw new Error("Cập nhật thất bại");
            alert("✅ Cập nhật thành công");
            fetchUsers();
        } catch (err) {
            console.error("Error updating user status:", err);
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

    const filteredUsers = users.filter((u) => {
        if (!u || !u.userName) return false;
        return (
            u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(u.id).includes(searchTerm)
        );
    });


    return (
        <div className="user-list-container">
            <h2>📋 Danh sách người dùng</h2>
            <div className="search-container">
                <input
                    className="search-input"
                    placeholder="Tìm theo ID hoặc tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr className="table">
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr className="table" key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.isActive ? "✅ Hoạt động" : "❌ Đã khóa"}</td>
                                <td className="actions">
                                    <button
                                        className="actionButton"
                                        onClick={() =>
                                            updateUserStatus(user.id, user.isActive ? "deactivate" : "activate")
                                        }
                                    >
                                        {user.isActive ? "Deactivate" : "Reactivate"}
                                    </button>
                                    <button className="actionButton" onClick={() => updateUserStatus(user.id, "delete")}>
                                        Xóa
                                    </button>
                                    <button className="actionButton" onClick={() => handlePasswordChange(user.id)}>
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