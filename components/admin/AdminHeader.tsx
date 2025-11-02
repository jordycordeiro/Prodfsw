import React from 'react';

interface AdminHeaderProps {
  pageTitle: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle }) => {
  return (
    <div className="header">
      <h2 id="page-title">{pageTitle}</h2>
      <div className="user-info">
        <img src="https://ui-avatars.com/api/?name=Admin+User&background=3498db&color=fff" alt="Admin User" />
        <span>Admin User</span>
      </div>
    </div>
  );
};

export default AdminHeader;
