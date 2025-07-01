import './UserCard.css'
import avatar from './avatar.svg'
import qrcode from './qrcode.png'
export default function UserCard({ user }) {
    return (
        <div className="userCard">
            <div className="glass">
                <img src={avatar} alt="Avatar" className="avatar" />
                <div className="information">
                    <div className="name">{user.name}</div>
                    <div className="id">{user.id}</div>
                    <div className="balance">Số dư: {user.balance} VNĐ</div>
                </div>
                <img src={qrcode} alt="QR-CODE" className="qrcode"></img>
            </div>
        </div >
    )
}