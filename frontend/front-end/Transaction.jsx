import users from './UserInf'
import './Transaction.css'
export default function Transactions() {
    const user = users[0]
    const list = user.history
    let curBalance = user.balance
    return (
        <div>
            {list.map((item, index) => {
                const prevBalance = curBalance
                curBalance = prevBalance - item.amount
                return (
                    <div key={index} className="transactionItem">
                        <div className="firstCol">
                            <div className="transdt">
                                <div className="transdate">{item.date}</div>
                                <div className="transtime">{item.time}</div>
                            </div>
                            <div className="transbalance">Before: {curBalance} VND</div>
                            <div className="transmoney" style={{ color: item.amount >= 0 ? 'green' : 'red' }}>{item.amount > 0 ? '+' : ''}
                                {item.amount} VND
                            </div>
                            <div className="transbalance">After: {prevBalance} VND</div>
                        </div>
                        <div className="secondCol">
                            <div className="sr"> {item.amount >= 0 ? `From: ${item.from}` : `To: ${item.to}`}</div>
                            <div className="message">{item.text}</div>
                            <div className="idtrans">{item.idtrans} </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}