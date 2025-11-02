"use client";

import React, { useState } from 'react';

interface Prescription {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  icon: string;
  prescriptions: Prescription[];
}

const initialMenus: MenuItem[] = [
  {
    id: 1,
    name: 'Exame Físico',
    icon: 'fas fa-folder',
    prescriptions: [
      { id: 1, name: 'Observações Gerais' },
      { id: 2, name: 'Medicações na Unidade' },
      { id: 3, name: 'Infectologia' },
    ],
  },
  {
    id: 2,
    name: 'Sifilis',
    icon: 'fas fa-folder',
    prescriptions: [
      { id: 4, name: 'USO ORAL - Posologia completa' },
    ],
  },
  {
    id: 3,
    name: 'Cardiologia',
    icon: 'fas fa-folder',
    prescriptions: [],
  },
];

const AdminMenus: React.FC = () => {
  const [menus, setMenus] = useState(initialMenus);
  const [activeMenu, setActiveMenu] = useState<number | null>(1); // Simula o primeiro menu ativo

  const handleMenuToggle = (menuId: number) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const handleAction = (type: 'menu' | 'prescription', action: 'edit' | 'delete', id: number) => {
    alert(`Ação: ${action} em ${type} com ID: ${id}`);
    // Implementação real de modals e lógica de CRUD viria aqui
  };

  return (
    <div className="content-section" id="menus">
      <div className="section-header">
        <h3 className="section-title">Gerenciar Menus e Prescrições</h3>
        <div>
          <button className="btn btn-primary" onClick={() => alert('Abrir Modal de Novo Menu')}>
            <i className="fas fa-folder-plus"></i> Novo Menu
          </button>
          <button className="btn btn-success" onClick={() => alert('Abrir Modal de Nova Prescrição')}>
            <i className="fas fa-file-medical"></i> Nova Prescrição
          </button>
        </div>
      </div>
      
      <p>Gerencie os menus pai e as prescrições (submenus) do sistema. Os menus pai agrupam prescrições relacionadas.</p>
      
      <div className="menu-tree">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-item">
            <div className="menu-header" onClick={() => handleMenuToggle(menu.id)}>
              <div className="menu-title">
                <i className={menu.icon}></i> {menu.name}
              </div>
              <div className="menu-actions">
                <button className="action-btn action-edit" onClick={(e) => { e.stopPropagation(); handleAction('menu', 'edit', menu.id); }}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn action-delete" onClick={(e) => { e.stopPropagation(); handleAction('menu', 'delete', menu.id); }}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div className={`submenu-list ${activeMenu === menu.id ? 'active' : ''}`}>
              {menu.prescriptions.length > 0 ? (
                menu.prescriptions.map((prescription) => (
                  <div key={prescription.id} className="submenu-item">
                    <span>{prescription.name}</span>
                    <div className="actions">
                      <button className="action-btn action-edit" onClick={(e) => { e.stopPropagation(); handleAction('prescription', 'edit', prescription.id); }}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn action-delete" onClick={(e) => { e.stopPropagation(); handleAction('prescription', 'delete', prescription.id); }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-message">Nenhuma prescrição adicionada</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenus;
