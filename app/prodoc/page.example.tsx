
// Exemplo de uso (renomeie para page.tsx e ajuste imports/convenções do seu projeto)
import { getSessionUser } from '@/lib/auth';
import { getEffectivePageBySlug } from '@/lib/templates';
import ProdocViewer from '@/components/prodoc/ProdocViewer';

export default async function ProdocPage() {
  const user = await getSessionUser();
  const effective = await getEffectivePageBySlug(user?.id ?? '', 'site_base');
  return <ProdocViewer content={effective?.content} cssText={effective?.css ?? ''} origin={effective?.origin} version={effective?.version} />;
}
