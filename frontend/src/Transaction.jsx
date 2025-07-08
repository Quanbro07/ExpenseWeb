import './Transaction.css';
import { useState } from 'react';

export default function Transactions({ user }) {
    const [visibleCount, setVisibleCount] = useState(5);
    if (!user || !Array.isArray(user.history)) {
        return (
            <div className="error-message">
                Không có dữ liệu giao dịch để hiển thị.
            </div>
        );
    }
    const list = user.history;
    if (list.length === 0) {
        return <div className="no-transactions">Người dùng chưa có giao dịch nào.</div>;
    }

    let curBalance = user.balance;
    const showMore = () => setVisibleCount((prev) => prev + 5);
    return (
        <div>
            {list.length === 0 ? (
                <div className="no-transactions">Không có giao dịch nào.</div>
            ) : (
                list.slice(0, visibleCount).map((item, index) => {
                    const prevBalance = curBalance;
                    curBalance = prevBalance - item.amount;

                    return (
                        <div key={index} className="transactionItem">
                            <div className="firstCol">
                                <div className="transdt">
                                    <div className="transdate">{item.date}</div>
                                    <div className="transtime">{item.time}</div>
                                </div>
                                <div className="transbalance">Before: {curBalance} VND</div>
                                <div className="transmoney" style={{ color: item.amount >= 0 ? 'green' : 'red' }}>
                                    {item.amount > 0 ? '+' : ''}{item.amount} VND
                                </div>
                                <div className="transbalance">After: {prevBalance} VND</div>
                            </div>
                            <div className="secondCol">
                                <div className="sr">{item.amount >= 0 ? `From: ${item.from}` : `To: ${item.to}`}</div>
                                <div className="message">{item.text}</div>
                                <div className="idtrans">{item.idtrans}</div>
                            </div>
                        </div>
                    );
                })
            )}
            {visibleCount < list.length && (
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <button className="buttonView1" onClick={showMore}>Xem thêm</button>
                </div>
            )}
        </div>
    );
}
