import AdminLayout from '@/components/admin/AdminLayout';
import AdminStyles from '@/components/admin/AdminStyles';

const AdminFinancial = () => {
    return (
        <div className="content-section" id="financial">
            <div className="section-header">
                <h3 className="section-title">Financeiro - Assinaturas</h3>
                <button className="btn btn-primary">
                    <i className="fas fa-plus"></i> Novo Plano
                </button>
            </div>
            <p>Conteúdo da seção Financeiro.</p>
        </div>
    );
};

export default function AdminFinancialPage() {
  return (
    <>
      <AdminStyles />
      <AdminLayout>
        <AdminFinancial />
      </AdminLayout>
    </>
  );
}
