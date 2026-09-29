import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { impactAsync, ImpactFeedbackStyle } from '@/lib/hapticsGate';
import { Nameplate } from '@/ui/Nameplate';
import { SceneHead } from '@/ui/SceneHead';
import { ScrimTop, SeamDock } from '@/ui/Seam';
import type { StickerName } from '@/ui/stickerRegistry';
import { tokens } from '@/ui/tokens';

import StillFrame from './StillFrame';
import { SKARNE_ENCOUNTER_ID } from './content';
import { HUB_HOTSPOTS, HUB_INTRINSIC, WORLD_ART, type HubHotspotDef } from './layout';
import { useWorldStore } from './store';
import { WorldNotice } from './WorldNotice';

const STICKER: Record<HubHotspotDef['id'], StickerName> = {
  tavern: 'beer',
  market: 'carrot',
  castle: 'castle',
};

export default function HubCrownhaven() {
  const openMap = useWorldStore((s) => s.openMap);
  const openInterior = useWorldStore((s) => s.openInterior);
  const palaceOpen = useWorldStore((s) => s.clearedEncounterIds.includes(SKARNE_ENCOUNTER_ID));
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setNotice(message);
    timer.current = setTimeout(() => setNotice(null), 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onHotspot = (spot: HubHotspotDef) => {
    impactAsync(ImpactFeedbackStyle.Medium);
    if (spot.action === 'tavern') {
      openInterior('tavern', 'ground');
      return;
    }
    if (spot.action === 'market') {
      openInterior('market', 'stall');
      return;
    }
    if (!palaceOpen) {
      showNotice('Gates stay shut until Champion ★1.');
      return;
    }
    openInterior('palace', 'hall');
  };

  return (
    <View style={styles.root}>
      <StillFrame
        source={WORLD_ART.hub}
        intrinsicWidth={HUB_INTRINSIC.width}
        intrinsicHeight={HUB_INTRINSIC.height}
      >
        {(box) => (
          <>
            {HUB_HOTSPOTS.map((spot) => {
              const locked = spot.id === 'castle' && !palaceOpen;
              return (
                <Nameplate
                  key={spot.id}
                  label={spot.label}
                  sticker={STICKER[spot.id]}
                  locked={locked}
                  featured={spot.id === 'tavern' && !locked}
                  frameWidth={box.width}
                  left={spot.x * box.width}
                  top={spot.y * box.height}
                  onPress={() => onHotspot(spot)}
                />
              );
            })}
          </>
        )}
      </StillFrame>
      <ScrimTop />
      <SeamDock fade={90} />
      <SceneHead kicker="Capital" name="Crownhaven" onBack={openMap} />
      {notice ? <WorldNotice message={notice} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.canvas,
  },
});
