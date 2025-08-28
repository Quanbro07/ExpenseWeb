import "../ProfileShow.css";
import ViewSwitcher from "../ViewSwitcher";
import UserCard from "../UserCard";

export default function Information({ user, expenseList, monthlyLimitedExpense, currentMonthTotalExpense }) {
  return (
    <div>
      <UserCard user={user} monthlyLimitedExpense={monthlyLimitedExpense} currentMonthTotalExpense={currentMonthTotalExpense} />
      <ViewSwitcher user={user} expenseList={expenseList} />
    </div>
  );
}
