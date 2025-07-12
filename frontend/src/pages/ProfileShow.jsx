import "../ProfileShow.css";
import ViewSwitcher from "../ViewSwitcher";
import UserCard from "../UserCard";

export default function Information({ user }) {
  return (
    <div>
      <UserCard user={user} />
      <ViewSwitcher user={user} />
    </div>
  );
}
