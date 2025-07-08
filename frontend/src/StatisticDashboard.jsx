import React from 'react';
import Linechart from './StatisticLine';
import Barchart from './StatisticBar';
import './StatisticDashboard.css'

export default function StatisticDashboard({ transactions }) {
    return (
        <div className="statistic-dashboard">
            <div className="chart-container">
                <Linechart Transactions={transactions} />
                <div className="chartName"> Biểu đồ thể hiện tăng trưởng số dư trong 6 tháng gần đây</div>
            </div>
            <div className="chart-container">
                <Barchart Transactions={transactions} />
                <div className="chartName"> Biểu đồ thể hiện mức chi tiêu và thu nhập từng tháng</div>
            </div>
        </div>
    );
}
