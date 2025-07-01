import Profile from '../Profile'
import Transactions from '../Transaction'
import users from '../UserInf'
import '../ProfileShow.css'
import NavBar from '../NavigationBar'
import Barchart from '../StatisticBar'
import Linechart from '../StatisticLine'
export default function Information() {
    const user = users[0]
    return (
        <div>
            <NavBar />
            <Profile />
            <Transactions />
            <Barchart Transactions={users[0].history} />
            <Linechart Transactions={users[0].history} />
        </div>
    )
} 