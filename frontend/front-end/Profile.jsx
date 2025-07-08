
import UserCard from './UserCard'
import users from './UserInf'
import Transactions from "./Transaction";

export default function Profile() {
    const user = users[0];
    return (
        <>
            <UserCard user={user} />

        </>
    )
}