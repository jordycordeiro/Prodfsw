'use client';
import { useEffect, useState, useMemo } from 'react';
import { getEffective } from '@/server/effective';
import type { EffectivePageRow } from '@/types/prodoc';

// Client hook to fetch effective content on mount (Canvas usage)
export function useEffectiveLoader(visibleSlugs: string[]) {
  const [map, setMap] = useState<Map<string, EffectivePageRow>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await getEffective(visibleSlugs);
        if (!active) return;
        setMap(rows);
      } catch (e) {
        if (!active) return;
        setError(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [JSON.stringify(visibleSlugs)]);

  const get = useMemo(() => (slug: string) => map.get(slug), [map]);
  return { loading, error, get, map };
}
