import AdminLayout from '@/components/admin/AdminLayout';
import AdminStyles from '@/components/admin/AdminStyles';
import PrescriptionEditor from '@/components/admin/PrescriptionEditor';

export default function NewPrescriptionPage() {
  return (
    <>
      <AdminStyles />
      <AdminLayout>
        <PrescriptionEditor onClose={() => {}} />
      </AdminLayout>
    </>
  )
}
