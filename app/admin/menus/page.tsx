import AdminLayout from '@/components/admin/AdminLayout';
import AdminMenusAdvanced from '@/components/admin/AdminMenusAdvanced';
import AdminStyles from '@/components/admin/AdminStyles';

export default function AdminMenusPage() {
  return (
    <>
      <AdminStyles />
      <AdminLayout>
        <AdminMenusAdvanced />
      </AdminLayout>
    </>
  );
}
