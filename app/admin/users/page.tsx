import AdminLayout from '@/components/admin/AdminLayout';
import AdminUsersAdvanced from '@/components/admin/AdminUsersAdvanced';
import AdminStyles from '@/components/admin/AdminStyles';

export default function AdminUsersPage() {
  return (
    <>
      <AdminStyles />
      <AdminLayout>
        <AdminUsersAdvanced />
      </AdminLayout>
    </>
  );
}
