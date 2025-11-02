"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', href: '/admin' },
  { id: 'content', label: 'Conteúdo do Site', icon: 'fas fa-file-medical', href: '/admin/content' },
  { id: 'menus', label: 'Menus e Prescrições', icon: 'fas fa-folder', href: '/admin/menus' },
  { id: 'users', label: 'Usuários', icon: 'fas fa-users', href: '/admin/users' },
  { id: 'financial', label: 'Financeiro', icon: 'fas fa-chart-line', href: '/admin/financial' },
  { id: 'settings', label: 'Configurações', icon: 'fas fa-cog', href: '/admin/settings' },
];

interface AdminSidebarProps {
  updatePageTitle: (title: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ updatePageTitle }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleNavItemClick = (item: NavItem) => {
    setActiveItem(item.id);
    updatePageTitle(item.label);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Prodoc</h1>
        <p>Painel Administrativo</p>
      </div>
      <div className="nav-menu">
        {navItems.map((item) => (
          <Link href={item.href} key={item.id} passHref legacyBehavior>
            <div
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => handleNavItemClick(item)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
