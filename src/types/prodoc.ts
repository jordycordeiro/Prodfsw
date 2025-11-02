export type EffectivePageRow = {
  user_id: string | null;
  slug: string;
  content: any;
  is_customized: boolean;
  user_prescription_id: string | null;
  baseline_version_id: string | null;
  published_at: string | null; // ISO string
};
