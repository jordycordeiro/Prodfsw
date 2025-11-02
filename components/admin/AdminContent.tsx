import React from 'react';
import AdminTabs from './AdminTabs';

const ContentTable: React.FC<{ data: any[], headers: string[] }> = ({ data, headers }) => (
  <table>
    <thead>
      <tr>
        {headers.map(header => <th key={header}>{header}</th>)}
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          {headers.map(header => <td key={header}>{item[header.toLowerCase().replace(/ /g, '_')]}</td>)}
          <td className="actions">
            <button className="action-btn action-edit"><i className="fas fa-edit"></i></button>
            <button className="action-btn action-view"><i className="fas fa-eye"></i></button>
            <button className="action-btn action-delete"><i className="fas fa-trash"></i></button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const examsData = [
  { titulo: 'Exame Físico Completo', tipo: 'Padrão', autor: 'Administrador', data: '15/04/2023', status: <span className="status active">Ativo</span> },
  { titulo: 'Exame Cardiológico', tipo: 'Especializado', autor: 'Dr. Silva', data: '22/03/2023', status: <span className="status active">Ativo</span> },
];

const complaintsData = [
  { titulo: 'Síndrome Gripal', categoria: 'Infectologia', autor: 'Administrador', data: '10/05/2023', status: <span className="status active">Ativo</span> },
  { titulo: 'Diarréico Agudo', categoria: 'Gastroenterologia', autor: 'Dra. Costa', data: '05/05/2023', status: <span className="status active">Ativo</span> },
];

const templatesData = [
  { nome: 'Modelo de Prescrição Padrão', tipo: 'Prescrição', autor: 'Administrador', data: '15/04/2023', status: <span className="status active">Ativo</span> },
];

const AdminContent: React.FC = () => {
  const tabs = [
    { id: 'exams', label: 'Exames Físicos', content: <ContentTable data={examsData} headers={['Título', 'Tipo', 'Autor', 'Data', 'Status']} /> },
    { id: 'complaints', label: 'Queixas Gerais', content: <ContentTable data={complaintsData} headers={['Título', 'Categoria', 'Autor', 'Data', 'Status']} /> },
    { id: 'templates', label: 'Modelos', content: <ContentTable data={templatesData} headers={['Nome', 'Tipo', 'Autor', 'Data', 'Status']} /> },
  ];

  return (
    <div className="content-section" id="content">
      <div className="section-header">
        <h3 className="section-title">Conteúdo do Site</h3>
        <div>
          <button className="btn btn-primary" id="add-content-btn">
            <i className="fas fa-plus"></i> Novo Conteúdo
          </button>
        </div>
      </div>
      
      <AdminTabs tabs={tabs} />
    </div>
  );
};

export default AdminContent;
