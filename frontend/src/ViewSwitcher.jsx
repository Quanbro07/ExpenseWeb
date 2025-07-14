import { useState } from "react";
import Transactions from "./Transaction";
import StatisticDashboard from "./StatisticDashboard";

export default function ViewSwitcher({ user, expenseList }) {
  const [view, setView] = useState("transactions");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          margin: "20px",
        }}
      >
        <button className="buttonView" onClick={() => setView("transactions")}>
          Lịch sử giao dịch
        </button>
        <button className="buttonView" onClick={() => setView("statistics")}>
          Thống kê
        </button>
      </div>

      {view === "transactions" ? (
        <Transactions user={user} expenseList={expenseList} />
      ) : (
        <StatisticDashboard transactions={expenseList} />
      )}
    </div>
  );
}
