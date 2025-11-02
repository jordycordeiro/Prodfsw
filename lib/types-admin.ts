export type Role = 'user' | 'admin' | 'superadmin';

export interface Prescription {
  id: string;
  title: string;
  section: 'USO ORAL' | 'USO EV' | 'USO IM' | 'USO SC' | 'TÓPICO' | 'INALATÓRIO' | 'OUTROS';
  content: string;
  author_id: string;
  author_name?: string | null;
  updated_at: string;
  is_published?: boolean | null; // quando for template/global
}

export interface InboxItem {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  payload?: any;
}
