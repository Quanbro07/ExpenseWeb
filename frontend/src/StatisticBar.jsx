import { BarChart } from "@mui/x-charts/BarChart";
import Transactions from "./Transaction";
import React from "react";
import { subMonths, format, parse } from "date-fns";
import {
  BarPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
  ChartsLegend,
} from "@mui/x-charts";
import "./StatisticBar.css";
function dataPrep(transactions) {
  if (!transactions || !Array.isArray(transactions)) return [];

  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i);
    const label = format(date, "yyyy-MM");
    months.push({ month: label, income: 0, expense: 0 });
  }

  transactions.forEach((tx) => {
    if (!tx.expenseDate) {
      console.warn("❌ Giao dịch thiếu expenseDate:", tx);
      return;
    }

    let txDate;
    try {
      const dateString = tx.expenseDate.replace(/\//g, "-");
      txDate = parse(dateString, "yyyy-MM-dd", new Date());
    } catch (e) {
      console.error("❌ Không thể parse ngày:", tx.expenseDate);
      return;
    }

    const txMonth = format(txDate, "yyyy-MM");
    const found = months.find((m) => m.month === txMonth);
    if (found) {
      found.expense += Math.abs(tx.amount || 0);
    }
  });

  return months;
}

export default function Barchart({ Transactions }) {
  const data = dataPrep(Transactions);
  const xLabels = data.map((d) => d.month);
  const income = data.map((d) => d.income);
  const expense = data.map((d) => d.expense);

  return (
    <div className="barChart">
      <BarChart
        height={400}
        xAxis={[
          {
            data: xLabels,
            scaleType: "band",
            label: "Tháng",
            sx: {
              tickLabel: { fill: "#1976d2" }, // Màu chữ trục hoành
              label: { fill: "#1976d2" }, // Màu tiêu đề trục hoành
            },
          },
        ]}
        yAxis={[
          {
            label: "Số tiền (VND)",
            sx: {
              tickLabel: { fill: "#d32f2f" }, // Màu chữ trục tung
              label: { fill: "#d32f2f" }, // Màu tiêu đề trục tung
            },
          },
        ]}
        series={[
          {
            data: income,
            label: "Thu nhập",
            color: "#4d934d",
          },
          {
            data: expense,
            label: "Chi tiêu",
            color: "#90151C",
          },
        ]}
      />
    </div>
  );
}
