import UserCard from "./UserCard";
import ViewSwitcher from "./ViewSwitcher";

export default function Profile({ user }) {
    return (
        <div>
            <UserCard user={user} />
            <ViewSwitcher user={user} />
        </div>
    );
}
