import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Easing, makeMutable, withTiming, type SharedValue } from 'react-native-reanimated';

import { MAP_FOG_REGIONS, nextHiddenFogRegionId } from './layout';
import { useWorldStore } from './store';

const REVEAL_MS = 1900;

function isOpen(id: string, discoveredRegionIds: string[]): boolean {
  const region = MAP_FOG_REGIONS.find((entry) => entry.id === id);
  return Boolean(region?.revealedByDefault) || discoveredRegionIds.includes(id);
}

export function useFogReveal() {
  const discoveredRegionIds = useWorldStore((s) => s.discoveredRegionIds);
  const discoverRegion = useWorldStore((s) => s.discoverRegion);

  const progress = useMemo(() => {
    const map: Record<string, SharedValue<number>> = {};
    for (const region of MAP_FOG_REGIONS) {
      map[region.id] = makeMutable(region.revealedByDefault ? 1 : 0);
    }
    return map;
  }, []);

  const hydrated = useRef(false);

  useEffect(() => {
    const sync = (animateNew: boolean) => {
      const ids = useWorldStore.getState().discoveredRegionIds;
      for (const region of MAP_FOG_REGIONS) {
        const value = progress[region.id];
        if (!value) continue;
        if (isOpen(region.id, ids)) {
          if (value.value >= 0.999) continue;
          value.value = animateNew
            ? withTiming(1, { duration: REVEAL_MS, easing: Easing.bezier(0.16, 1, 0.3, 1) })
            : 1;
          continue;
        }
        if (!region.revealedByDefault && value.value !== 0) {
          value.value = 0;
        }
      }
    };

    if (!hydrated.current) {
      if (useWorldStore.persist.hasHydrated()) {
        hydrated.current = true;
        sync(false);
        return;
      }
      return useWorldStore.persist.onFinishHydration(() => {
        hydrated.current = true;
        sync(false);
      });
    }

    sync(true);
  }, [discoveredRegionIds, progress]);

  const unveilNextRegion = useCallback(() => {
    const id = nextHiddenFogRegionId(useWorldStore.getState().discoveredRegionIds);
    if (!id) return null;
    discoverRegion(id);
    return id;
  }, [discoverRegion]);

  return { progress, discoveredRegionIds, discoverRegion, unveilNextRegion };
}
