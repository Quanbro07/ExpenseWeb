import '../ProfileShow.css';
import NavBar from '../NavigationBar';
import ViewSwitcher from '../ViewSwitcher';
import UserCard from '../UserCard';

export default function Information({ user }) {
    return (
        <div>
            <NavBar />
            <UserCard user={user} />
            <ViewSwitcher user={user} />
        </div>
    );
}
