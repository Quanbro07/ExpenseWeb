import React, { useState } from 'react';
import './PasswordChangeModal.css';

const PasswordChangeModal = ({ userId, onClose, onPasswordChange, setAlertMessage, setAlertType }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleConfirm = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Mật khẩu nhập lại không khớp.');
            return;
        }
        if (newPassword.length < 6) { // Example: minimum 6 characters
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setPasswordError('');
        try {
            await onPasswordChange(userId, newPassword); // Call the parent's password change function
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Error in modal password change:", error);
            setAlertMessage('Lỗi khi đổi mật khẩu.');
            setAlertType('error');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Đổi mật khẩu người dùng (ID: {userId})</h3>
                {passwordError && <p className="password-error">{passwordError}</p>}
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="modal-actions">
                    <button className="confirm-button" onClick={handleConfirm}>Xác nhận</button>
                    <button className="cancel-button" onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
