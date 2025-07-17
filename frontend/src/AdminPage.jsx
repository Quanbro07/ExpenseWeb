import './AdminPage.css'
import UserList from './UserList'

export default function AdminPage() {
    console.log("🔧 AdminPage mounted");
    return (
        <div>
            <UserList />
        </div>
    )
}
