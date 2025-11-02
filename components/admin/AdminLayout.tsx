"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminStyles from './AdminStyles';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Função para atualizar o título da página baseado no item de navegação ativo
  const updatePageTitle = (title: string) => {
    setPageTitle(title);
  };

  return (
    <div className="flex min-h-screen">
      <AdminStyles />
      <AdminSidebar updatePageTitle={updatePageTitle} />
      <div className="flex-1 ml-[var(--sidebar-width)] p-5 transition-all duration-300 main-content">
        <AdminHeader pageTitle={pageTitle} />
        <main className="mt-5">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;