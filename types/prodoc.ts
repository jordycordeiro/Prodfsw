
export type PageBlock = { id: string; type: string; data: any };
export type PageContent = { blocks: PageBlock[]; [k: string]: any };

export type EffectivePage = {
  origin: 'admin' | 'user';
  content: PageContent;
  css?: string | null;
  version: number;
};
