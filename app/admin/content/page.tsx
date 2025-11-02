import AdminLayout from '@/components/admin/AdminLayout';
import AdminContentAdvanced from '@/components/admin/AdminContentAdvanced';
import AdminStyles from '@/components/admin/AdminStyles';

export default function AdminContentPage() {
  return (
    <>
      <AdminStyles />
      <AdminLayout>
        <AdminContentAdvanced />
      </AdminLayout>
    </>
  );
}
