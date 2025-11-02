"use client";

import React, { useState } from 'react';
import { MenuItem, Prescription } from '@/lib/admin-types';
import { mockMenus } from '@/lib/admin-mock-data';

interface MenuModalState {
  isOpen: boolean;
  type: 'add' | 'edit';
  data?: MenuItem;
}

interface PrescriptionModalState {
  isOpen: boolean;
  type: 'add' | 'edit';
  data?: Prescription;
  menuId?: number;
}

const AdminMenusAdvanced: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>(mockMenus);
  const [expandedMenus, setExpandedMenus] = useState<number[]>([1]); // Menu 1 começa expandido
  const [menuModal, setMenuModal] = useState<MenuModalState>({ isOpen: false, type: 'add' });
  const [prescriptionModal, setPrescriptionModal] = useState<PrescriptionModalState>({ isOpen: false, type: 'add' });

  // Funções para Menu
  const handleAddMenu = () => {
    setMenuModal({ isOpen: true, type: 'add' });
  };

  const handleEditMenu = (menu: MenuItem) => {
    setMenuModal({ isOpen: true, type: 'edit', data: menu });
  };

  const handleDeleteMenu = (menuId: number) => {
    if (confirm('Tem certeza que deseja excluir este menu?')) {
      setMenus(menus.filter(m => m.id !== menuId));
      alert('Menu excluído com sucesso!');
    }
  };

  const handleSaveMenu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Menu ${menuModal.type === 'add' ? 'adicionado' : 'atualizado'} com sucesso!`);
    setMenuModal({ isOpen: false, type: 'add' });
  };

  // Funções para Prescrição
  const handleAddPrescription = (menuId: number) => {
    setPrescriptionModal({ isOpen: true, type: 'add', menuId });
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setPrescriptionModal({ isOpen: true, type: 'edit', data: prescription });
  };

  const handleDeletePrescription = (menuId: number, prescriptionId: number) => {
    if (confirm('Tem certeza que deseja excluir esta prescrição?')) {
      setMenus(menus.map(menu => {
        if (menu.id === menuId) {
          return {
            ...menu,
            prescriptions: menu.prescriptions.filter(p => p.id !== prescriptionId),
          };
        }
        return menu;
      }));
      alert('Prescrição excluída com sucesso!');
    }
  };

  const handleSavePrescription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Prescrição ${prescriptionModal.type === 'add' ? 'adicionada' : 'atualizada'} com sucesso!`);
    setPrescriptionModal({ isOpen: false, type: 'add' });
  };

  const toggleMenuExpanded = (menuId: number) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <div className="content-section" id="menus">
      <div className="section-header">
        <h3 className="section-title">Gerenciar Menus e Prescrições</h3>
        <div>
          <button className="btn btn-primary" onClick={handleAddMenu}>
            <i className="fas fa-folder-plus"></i> Novo Menu
          </button>
        </div>
      </div>

      <p>Gerencie os menus pai e as prescrições (submenus) do sistema. Os menus pai agrupam prescrições relacionadas.</p>

      <div className="menu-tree">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-item">
            <div className="menu-header" onClick={() => toggleMenuExpanded(menu.id)}>
              <div className="menu-title">
                <i className="fas fa-folder"></i> {menu.name}
              </div>
              <div className="menu-actions">
                <button className="action-btn action-edit" onClick={(e) => { e.stopPropagation(); handleEditMenu(menu); }}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn action-delete" onClick={(e) => { e.stopPropagation(); handleDeleteMenu(menu.id); }}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div className={`submenu-list ${expandedMenus.includes(menu.id) ? 'active' : ''}`}>
              {menu.prescriptions.length > 0 ? (
                <>
                  {menu.prescriptions.map((prescription) => (
                    <div key={prescription.id} className="submenu-item">
                      <span>{prescription.name}</span>
                      <div className="actions">
                        <button className="action-btn action-edit" onClick={(e) => { e.stopPropagation(); handleEditPrescription(prescription); }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn action-delete" onClick={(e) => { e.stopPropagation(); handleDeletePrescription(menu.id, prescription.id); }}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 15px 10px 40px', borderTop: '1px solid #f0f0f0' }}>
                    <button className="btn btn-success" onClick={() => handleAddPrescription(menu.id)}>
                      <i className="fas fa-plus"></i> Adicionar Prescrição
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-message">Nenhuma prescrição adicionada</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Menu */}
      <div className={`modal ${menuModal.isOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{menuModal.type === 'add' ? 'Adicionar Menu' : 'Editar Menu'}</h3>
            <button className="close-modal" onClick={() => setMenuModal({ isOpen: false, type: 'add' })}>×</button>
          </div>
          <form onSubmit={handleSaveMenu}>
            <div className="form-group">
              <label htmlFor="menu-name">Nome do Menu</label>
              <input type="text" id="menu-name" defaultValue={menuModal.data?.name} required />
            </div>
            <div className="form-group">
              <label htmlFor="menu-description">Descrição</label>
              <textarea id="menu-description" defaultValue={menuModal.data?.description}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="menu-status">Status</label>
              <select id="menu-status" defaultValue={menuModal.data?.status || 'active'}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Salvar Menu</button>
              <button type="button" className="btn btn-danger" onClick={() => setMenuModal({ isOpen: false, type: 'add' })}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para Prescrição */}
      <div className={`modal ${prescriptionModal.isOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{prescriptionModal.type === 'add' ? 'Adicionar Prescrição' : 'Editar Prescrição'}</h3>
            <button className="close-modal" onClick={() => setPrescriptionModal({ isOpen: false, type: 'add' })}>×</button>
          </div>
          <form onSubmit={handleSavePrescription}>
            <div className="form-group">
              <label htmlFor="prescription-name">Nome da Prescrição</label>
              <input type="text" id="prescription-name" defaultValue={prescriptionModal.data?.name} required />
            </div>
            <div className="form-group">
              <label htmlFor="prescription-content">Conteúdo</label>
              <textarea id="prescription-content" defaultValue={prescriptionModal.data?.content}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="prescription-status">Status</label>
              <select id="prescription-status" defaultValue={prescriptionModal.data?.status || 'active'}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Salvar Prescrição</button>
              <button type="button" className="btn btn-danger" onClick={() => setPrescriptionModal({ isOpen: false, type: 'add' })}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMenusAdvanced;
