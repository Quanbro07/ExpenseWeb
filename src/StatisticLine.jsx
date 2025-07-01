import { LineChart } from '@mui/x-charts/LineChart'
import Transactions from './Transaction'
import React from 'react'
import { subMonths, format, parse } from 'date-fns'
import {
    LinePlot,
    ChartsXAxis,
    ChartsYAxis,
    ChartsTooltip,
    ChartsLegend
} from '@mui/x-charts'
import './StaticLine.css'

function dataPrep(transactions) {
    if (!transactions || !Array.isArray(transactions))
        return []
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(now, i);
        const label = format(date, 'yyyy-MM')
        months.push({ month: label, income: 0, expense: 0 })
    }
    transactions.forEach((tx) => {
        const txDate = parse(tx.date, 'dd/MM/yyyy', new Date())
        const txMonth = format(txDate, 'yyyy-MM')
        const found = months.find((m) => m.month === txMonth)
        if (found) {
            if (tx.type === 'Add')
                found.income += tx.amount
            else if (tx.type === 'Pay')
                found.expense += Math.abs(tx.amount)
        }
    })
    return months
}
export default function Linechart({ Transactions }) {
    const monthsData = dataPrep(Transactions)
    const balanceMonth = monthsData.map(({ month, income, expense }) => ({
        month,
        balance: income - expense
    }))
    let cumulativeBalance = 0;
    const balanceGrowth = balanceMonth.map(({ month, balance }) => {
        cumulativeBalance += balance;
        return { month, cumulativeBalance }
    })
    const series = [
        {
            label: 'Tăng trưởng số dư',
            data: balanceGrowth.map((d) => d.cumulativeBalance),
        },]
    const xLabels = balanceGrowth.map((d) => d.month)
    console.log('Transactions: ', Transactions)
    console.log('X Labels: ', xLabels)
    return (
        <div className="lineChart">
            <LineChart
                xAxis={[{ data: xLabels, scaleType: 'point', label: 'Tháng' }]}
                yAxis={[{ label: 'Số dư (VND)' }]}
                series={series}
            />
        </div>
    )
}