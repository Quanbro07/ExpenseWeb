import { useEffect, useState } from "react";
import "./UserList.css";
import CustomAlert from "./components/CustomAlert"; // Import CustomAlert

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null); // State for custom alert
    const [alertType, setAlertType] = useState("error"); // State for custom alert type

    const handleCloseAlert = () => {
        setAlertMessage(null);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/v1/user/getAll");
            const data = await res.json();
            console.log("List: ", data);
            // Filter out admin users from the list
            const filteredAdminUsers = data.filter(user => user.role !== "Admin");
            setUsers(filteredAdminUsers);
        } catch (err) {
            setAlertMessage("Không thể tải danh sách người dùng");
            setAlertType("error");
            console.error("Error fetching users:", err); // Log error
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
            setAlertMessage("✅ Cập nhật thành công");
            setAlertType("success");
            fetchUsers();
        } catch (err) {
            console.error("Error updating user status:", err);
            setAlertMessage("❌ Lỗi khi cập nhật trạng thái người dùng");
            setAlertType("error");
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
            setAlertMessage("✅ Đổi mật khẩu thành công");
            setAlertType("success");
        } catch (err) {
            console.error("Error changing password:", err);
            setAlertMessage("❌ Đổi mật khẩu thất bại");
            setAlertType("error");
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
            {alertMessage && (
                <CustomAlert message={alertMessage} type={alertType} onClose={handleCloseAlert} />
            )}
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
                        {filteredUsers.map((user) => {
                            console.log("User isActive (from frontend):", user.isActive); // Log isActive
                            return (
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
                            );
                        })}
                    </tbody>
                </table>
            )}

        </div>
    );
}