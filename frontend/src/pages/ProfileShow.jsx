import "../ProfileShow.css";
import ViewSwitcher from "../ViewSwitcher";
import UserCard from "../UserCard";

export default function Information({ user, expenseList }) {
  return (
    <div>
      <UserCard user={user} />
      <ViewSwitcher user={user} expenseList={expenseList} />
    </div>
  );
}
