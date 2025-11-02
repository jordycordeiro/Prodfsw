import React from 'react';

const usersData = [
  { name: 'Dr. João Silva', email: 'joao.silva@prodoc.com', type: 'Médico', registrationDate: '15/01/2023', status: 'Ativo' },
  { name: 'Dra. Maria Costa', email: 'maria.costa@prodoc.com', type: 'Médico', registrationDate: '22/02/2023', status: 'Ativo' },
  { name: 'Dr. Pedro Oliveira', email: 'pedro.oliveira@prodoc.com', type: 'Administrador', registrationDate: '10/12/2022', status: 'Ativo' },
];

const AdminUsers: React.FC = () => {
  return (
    <div className="content-section" id="users">
      <div className="section-header">
        <h3 className="section-title">Gerenciar Usuários</h3>
        <button className="btn btn-primary" onClick={() => alert('Abrir Modal de Adicionar Usuário')}>
          <i className="fas fa-user-plus"></i> Adicionar Usuário
        </button>
      </div>
      
      <div className="form-group">
        <input type="text" placeholder="Filtrar usuários..." />
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
          {usersData.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>{user.registrationDate}</td>
              <td><span className={`status ${user.status === 'Ativo' ? 'active' : 'inactive'}`}>{user.status}</span></td>
              <td className="actions">
                <button className="action-btn action-edit" onClick={() => alert(`Editar usuário ${user.name}`)}><i className="fas fa-edit"></i></button>
                <button className="action-btn action-view" onClick={() => alert(`Visualizar usuário ${user.name}`)}><i className="fas fa-eye"></i></button>
                <button className="action-btn action-delete" onClick={() => alert(`Excluir usuário ${user.name}`)}><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
