import AdminLayout from '@/components/admin/AdminLayout';
import AdminStyles from '@/components/admin/AdminStyles';
import AdminDashboard from '@/components/admin/AdminDashboard';
import SuperAdminSwitch from '@/components/admin/SuperAdminSwitch';
import NotificationsBell from '@/components/admin/NotificationsBell';
import { listPrescriptions } from '@/app/(app)/prescriptions/actions';

export default async function AdminPage() {
  const items = await listPrescriptions();

  return (
    <>
      <AdminStyles />
      <AdminLayout>
        <div className="content-section">
          <div className="section-header">
            <h3 className="section-title">Dashboard</h3>
            <div className="flex items-center gap-2">
              <SuperAdminSwitch />
              <NotificationsBell />
            </div>
          </div>
          <AdminDashboard />

          <div className="section-header mt-6">
            <h3 className="section-title">Prescrições</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Título</th><th>Seção</th><th>Atualizado em</th><th>Status</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.section}</td>
                  <td>{new Date(p.updatedAt).toLocaleString()}</td>
                  <td>{p.isPublished ? <span className="status active">Global</span> : <span className="status pending">Rascunho</span>}</td>
                  <td className="actions">
                    <a className="action-btn action-edit" href={`/admin/prescriptions/${p.id}`}>Editar</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </>
  );
}
