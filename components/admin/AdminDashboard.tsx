import React from 'react';
import AdminCard from './AdminCard';
import AdminTabs from './AdminTabs';

const AdminDashboard: React.FC = () => {
  const cardsData = [
    { title: 'Usuários Ativos', value: '1,247', description: '+12% desde o último mês', icon: 'fas fa-users', colorClass: 'users' },
    { title: 'Prescrições', value: '5,832', description: '+8% desde o último mês', icon: 'fas fa-file-prescription', colorClass: 'prescriptions' },
    { title: 'Menus Ativos', value: '42', description: '+3 desde a última semana', icon: 'fas fa-folder', colorClass: 'menus' },
    { title: 'Receita Mensal', value: 'R$ 24.580', description: '+15% desde o último mês', icon: 'fas fa-dollar-sign', colorClass: 'financial' },
  ];

  const tabs = [
    { id: 'recent-activity', label: 'Atividade Recente', content: (
      <table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Ação</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Dr. Silva</td><td>Criou uma nova prescrição</td><td>10/05/2023 14:32</td></tr>
          <tr><td>Dra. Costa</td><td>Atualizou um menu</td><td>10/05/2023 13:15</td></tr>
          <tr><td>Dr. Oliveira</td><td>Atualizou informações do paciente</td><td>10/05/2023 11:45</td></tr>
          <tr><td>Dra. Santos</td><td>Criou um novo bloco de exame</td><td>10/05/2023 10:20</td></tr>
        </tbody>
      </table>
    )},
    { id: 'statistics', label: 'Estatísticas', content: (
      <p>Gráficos e estatísticas detalhadas seriam exibidos aqui.</p>
    )},
  ];

  return (
    <div className="content-section active" id="dashboard">
      <div className="section-header">
        <h3 className="section-title">Visão Geral do Sistema</h3>
      </div>
      
      <div className="cards-container">
        {cardsData.map((card, index) => (
          <AdminCard key={index} {...card} />
        ))}
      </div>
      
      <AdminTabs tabs={tabs} />
    </div>
  );
};

export default AdminDashboard;
