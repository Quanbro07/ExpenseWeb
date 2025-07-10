import UserCard from "./UserCard";
import ViewSwitcher from "./ViewSwitcher";

export default function Profile({ user }) {
    if (!user) return <div className="Alert">Không có dữ liệu người dùng</div>;

    return (
        <div>
            <UserCard user={user} />
            <ViewSwitcher user={user} />
        </div>
    );
}
