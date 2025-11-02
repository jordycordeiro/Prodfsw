"use client";

import React, { useState } from 'react';
import { User } from '@/lib/admin-types';
import { mockUsers } from '@/lib/admin-mock-data';

interface UserModalState {
  isOpen: boolean;
  type: 'add' | 'edit';
  data?: User;
}

const AdminUsersAdvanced: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [userModal, setUserModal] = useState<UserModalState>({ isOpen: false, type: 'add' });
  const [searchTerm, setSearchTerm] = useState('');

  // Funções para Usuário
  const handleAddUser = () => {
    setUserModal({ isOpen: true, type: 'add' });
  };

  const handleEditUser = (user: User) => {
    setUserModal({ isOpen: true, type: 'edit', data: user });
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      alert('Usuário excluído com sucesso!');
    }
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Usuário ${userModal.type === 'add' ? 'adicionado' : 'atualizado'} com sucesso!`);
    setUserModal({ isOpen: false, type: 'add' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(user =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
        )
      );
    }
  };

  return (
    <div className="content-section" id="users">
      <div className="section-header">
        <h3 className="section-title">Gerenciar Usuários</h3>
        <button className="btn btn-primary" onClick={handleAddUser}>
          <i className="fas fa-user-plus"></i> Adicionar Usuário
        </button>
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Filtrar usuários..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Data de Registro</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type === 'admin' ? 'Administrador' : user.type === 'doctor' ? 'Médico' : 'Usuário'}</td>
              <td>{user.registrationDate}</td>
              <td>
                <span className={`status ${user.status === 'active' ? 'active' : 'inactive'}`}>
                  {user.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="actions">
                <button className="action-btn action-edit" onClick={() => handleEditUser(user)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn action-view" onClick={() => alert(`Visualizar usuário ${user.name}`)}>
                  <i className="fas fa-eye"></i>
                </button>
                <button className="action-btn action-delete" onClick={() => handleDeleteUser(user.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
          Nenhum usuário encontrado.
        </div>
      )}

      {/* Modal para Usuário */}
      <div className={`modal ${userModal.isOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{userModal.type === 'add' ? 'Adicionar Usuário' : 'Editar Usuário'}</h3>
            <button className="close-modal" onClick={() => setUserModal({ isOpen: false, type: 'add' })}>×</button>
          </div>
          <form onSubmit={handleSaveUser}>
            <div className="form-group">
              <label htmlFor="user-name">Nome</label>
              <input type="text" id="user-name" defaultValue={userModal.data?.name} required />
            </div>
            <div className="form-group">
              <label htmlFor="user-email">Email</label>
              <input type="email" id="user-email" defaultValue={userModal.data?.email} required />
            </div>
            <div className="form-group">
              <label htmlFor="user-type">Tipo de Usuário</label>
              <select id="user-type" defaultValue={userModal.data?.type || 'user'}>
                <option value="admin">Administrador</option>
                <option value="doctor">Médico</option>
                <option value="user">Usuário</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="user-status">Status</label>
              <select id="user-status" defaultValue={userModal.data?.status || 'active'}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Salvar Usuário</button>
              <button type="button" className="btn btn-danger" onClick={() => setUserModal({ isOpen: false, type: 'add' })}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersAdvanced;
