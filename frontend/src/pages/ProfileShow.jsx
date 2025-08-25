import "../ProfileShow.css";
import ViewSwitcher from "../ViewSwitcher";
import UserCard from "../UserCard";
import NavBar from "../NavigationBar";

export default function Information({ user, expenseList }) {
  return (
    <div>
      <NavBar />
      <UserCard user={user} />
      <ViewSwitcher user={user} expenseList={expenseList} />
    </div>
  );
}
