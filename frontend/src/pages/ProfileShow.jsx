import Profile from '../Profile'
import users from '../UserInf'
import '../ProfileShow.css'
import NavBar from '../NavigationBar'
import ViewSwitcher from '../ViewSwitcher'
import UserCard from '../UserCard'
export default function Information() {
    //const user = users[0]
    return (
        <div>
            <NavBar />
            <UserCard user={user} />
            <ViewSwitcher user={user} />
        </div>
    )
}