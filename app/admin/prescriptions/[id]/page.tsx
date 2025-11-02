import AdminLayout from '@/components/admin/AdminLayout';
import AdminStyles from '@/components/admin/AdminStyles';
import PrescriptionEditor from '@/components/admin/PrescriptionEditor';
import { getPrescription } from '@/app/(app)/prescriptions/actions';

export default async function EditPrescriptionPage({ params }:{ params: { id: string }}) {
  const item = await getPrescription(params.id);
  return (
    <>
      <AdminStyles />
      <AdminLayout>
        {/* Render editor drawer-like fullscreen */}
        <PrescriptionEditor initial={item} onClose={() => { /* no-op in SSR */ }} />
      </AdminLayout>
    </>
  )
}
