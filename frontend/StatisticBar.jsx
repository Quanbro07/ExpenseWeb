import { BarChart } from '@mui/x-charts/BarChart';
import Transactions from './Transaction'
import React from 'react'
import { subMonths, format, parse } from 'date-fns'
import {
    BarPlot,
    ChartsXAxis,
    ChartsYAxis,
    ChartsTooltip,
    ChartsLegend,
} from '@mui/x-charts';
import './StatisticBar.css'
function dataPrep(transactions) {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(now, i);
        const label = format(date, 'yyyy-MM')
        months.push({ month: label, income: 0, expense: 0 })
    }
    transactions.forEach((tx) => {
        const txDate = parse(tx.date, 'dd/MM/yyyy', new Date());
        const txMonth = format(txDate, 'yyyy-MM');

        console.log('Giao dịch:', tx.date, '->', txMonth);  // 👈 Dòng này kiểm tra kết quả

        const found = months.find((m) => m.month === txMonth);
        if (found) {
            if (tx.type === 'Add') {
                found.income += tx.amount;
            } else if (tx.type === 'Pay') {
                found.expense += Math.abs(tx.amount);
            }
        }
    });

    console.log('📦 transactions:', transactions);
    transactions.forEach((tx, idx) => {
        const txDate = parse(tx.date, 'dd/MM/yyyy', new Date());
        console.log(`#${idx + 1}`, tx.date, '=>', txDate);
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
                xAxis={[{ data: xLabels, scaleType: 'band', label: 'Tháng' }]}
                yAxis={[{ label: 'Số tiền (VND)' }]}
                series={[
                    {
                        data: income,
                        label: 'Thu nhập',
                        color: '#4d934d',
                    },
                    {
                        data: expense,
                        label: 'Chi tiêu',
                        color: '#90151C',
                    },
                ]}
            />
        </div>
    );
}

