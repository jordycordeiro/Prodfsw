import AdminLayout from '@/components/admin/AdminLayout';
import AdminStyles from '@/components/admin/AdminStyles';

const AdminSettings = () => {
    return (
        <div className="content-section" id="settings">
            <div className="section-header">
                <h3 className="section-title">Configurações do Sistema</h3>
            </div>
            <p>Conteúdo da seção Configurações.</p>
        </div>
    );
};

export default function AdminSettingsPage() {
  return (
    <>
      <AdminStyles />
      <AdminLayout>
        <AdminSettings />
      </AdminLayout>
    </>
  );
}
