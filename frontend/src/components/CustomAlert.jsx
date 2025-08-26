import React, { useEffect } from 'react';
import './CustomAlert.css';

const CustomAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Tự động đóng sau 3 giây
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`custom-alert ${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default CustomAlert;

