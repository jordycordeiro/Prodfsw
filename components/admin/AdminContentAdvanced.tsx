"use client";

import React, { useState } from 'react';
import { ContentItem } from '@/lib/admin-types';
import { mockContent } from '@/lib/admin-mock-data';
import AdminTabs from './AdminTabs';

interface ContentModalState {
  isOpen: boolean;
  type: 'add' | 'edit';
  data?: ContentItem;
  contentType?: 'exam' | 'complaint' | 'template';
}

const AdminContentAdvanced: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [contentModal, setContentModal] = useState<ContentModalState>({ isOpen: false, type: 'add' });

  // Filtrar conteúdo por tipo
  const exams = content.filter(item => item.type === 'exam');
  const complaints = content.filter(item => item.type === 'complaint');
  const templates = content.filter(item => item.type === 'template');

  // Funções para Conteúdo
  const handleAddContent = (type: 'exam' | 'complaint' | 'template') => {
    setContentModal({ isOpen: true, type: 'add', contentType: type });
  };

  const handleEditContent = (item: ContentItem) => {
    setContentModal({ isOpen: true, type: 'edit', data: item });
  };

  const handleDeleteContent = (itemId: number) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      setContent(content.filter(item => item.id !== itemId));
      alert('Conteúdo excluído com sucesso!');
    }
  };

  const handleSaveContent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Conteúdo ${contentModal.type === 'add' ? 'adicionado' : 'atualizado'} com sucesso!`);
    setContentModal({ isOpen: false, type: 'add' });
  };

  const ContentTable: React.FC<{ items: ContentItem[], type: 'exam' | 'complaint' | 'template' }> = ({ items, type }) => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => handleAddContent(type)}>
          <i className="fas fa-plus"></i> Novo {type === 'exam' ? 'Exame' : type === 'complaint' ? 'Queixa' : 'Modelo'}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            {type === 'exam' && (
              <>
                <th>Título</th>
                <th>Tipo</th>
                <th>Autor</th>
                <th>Data</th>
                <th>Status</th>
              </>
            )}
            {type === 'complaint' && (
              <>
                <th>Título</th>
                <th>Categoria</th>
                <th>Autor</th>
                <th>Data</th>
                <th>Status</th>
              </>
            )}
            {type === 'template' && (
              <>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Autor</th>
                <th>Data</th>
                <th>Status</th>
              </>
            )}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{type === 'complaint' ? item.category : 'Padrão'}</td>
              <td>{item.author}</td>
              <td>{item.createdAt}</td>
              <td>
                <span className={`status ${item.status === 'active' ? 'active' : 'inactive'}`}>
                  {item.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="actions">
                <button className="action-btn action-edit" onClick={() => handleEditContent(item)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn action-view" onClick={() => alert(`Visualizar: ${item.title}`)}>
                  <i className="fas fa-eye"></i>
                </button>
                <button className="action-btn action-delete" onClick={() => handleDeleteContent(item.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
          Nenhum {type === 'exam' ? 'exame' : type === 'complaint' ? 'queixa' : 'modelo'} encontrado.
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'exams', label: 'Exames Físicos', content: <ContentTable items={exams} type="exam" /> },
    { id: 'complaints', label: 'Queixas Gerais', content: <ContentTable items={complaints} type="complaint" /> },
    { id: 'templates', label: 'Modelos', content: <ContentTable items={templates} type="template" /> },
  ];

  return (
    <div className="content-section" id="content">
      <div className="section-header">
        <h3 className="section-title">Conteúdo do Site</h3>
      </div>

      <AdminTabs tabs={tabs} />

      {/* Modal para Conteúdo */}
      <div className={`modal ${contentModal.isOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">
              {contentModal.type === 'add' ? 'Adicionar' : 'Editar'} Conteúdo
            </h3>
            <button className="close-modal" onClick={() => setContentModal({ isOpen: false, type: 'add' })}>×</button>
          </div>
          <form onSubmit={handleSaveContent}>
            <div className="form-group">
              <label htmlFor="content-title">Título</label>
              <input type="text" id="content-title" defaultValue={contentModal.data?.title} required />
            </div>
            <div className="form-group">
              <label htmlFor="content-author">Autor</label>
              <input type="text" id="content-author" defaultValue={contentModal.data?.author} required />
            </div>
            {contentModal.contentType === 'complaint' && (
              <div className="form-group">
                <label htmlFor="content-category">Categoria</label>
                <input type="text" id="content-category" defaultValue={contentModal.data?.category} />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="content-body">Conteúdo</label>
              <textarea id="content-body" defaultValue={contentModal.data?.content}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="content-status">Status</label>
              <select id="content-status" defaultValue={contentModal.data?.status || 'active'}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Salvar Conteúdo</button>
              <button type="button" className="btn btn-danger" onClick={() => setContentModal({ isOpen: false, type: 'add' })}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminContentAdvanced;
