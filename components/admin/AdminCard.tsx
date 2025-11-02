import React from 'react';

interface AdminCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  colorClass: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, value, description, icon, colorClass }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        <div className={`card-icon ${colorClass}`}>
          <i className={icon}></i>
        </div>
      </div>
      <div className="card-value">{value}</div>
      <div className="card-description">{description}</div>
    </div>
  );
};

export default AdminCard;
