import React, { useMemo } from 'react';

import {
  LOCATION_STILL_INTRINSIC,
  PLAYGROUND_LOOT_TABLE,
  challengeFor,
  dungeonFloorById,
  dungeonForHotspot,
  dungeonLiftFloors,
  getLocationHotspot,
} from './content';
import { LevelNav } from '@/ui/LevelNav';

import BossApproach from './BossApproach';
import { isFloorOpen } from './interiors';
import { useFloorLift } from './useTavernLift';
import { useWorldStore } from './store';
import type { MapLocationId } from './types';

type Props = {
  locationId: MapLocationId;
};

/** Map-dungeon approach — Gutterjack chrome + floor elevator when the Bible has tiers. */
export default function MapBossApproach({ locationId }: Props) {
  const closeEncounter = useWorldStore((s) => s.closeEncounter);
  const markEncounterCleared = useWorldStore((s) => s.markEncounterCleared);
  const clearedEncounterIds = useWorldStore((s) => s.clearedEncounterIds);
  const hotspotId = useWorldStore((s) => s.currentHotspotId);
  const currentFloorId = useWorldStore((s) => s.currentFloorId);

  const hotspot = getLocationHotspot(locationId, hotspotId);
  const dungeon = dungeonForHotspot(hotspot);
  const floor = dungeon ? dungeonFloorById(dungeon, currentFloorId) : undefined;

  const liftFloors = useMemo(
    () => (dungeon ? dungeonLiftFloors(dungeon, clearedEncounterIds) : []),
    [clearedEncounterIds, dungeon],
  );
  const { floorId, onPickFloor, whisper } = useFloorLift(
    liftFloors,
    floor?.id ?? dungeon?.defaultFloorId ?? 'common',
  );

  if (!dungeon || !floor || hotspot?.kind !== 'dungeon') return null;

  const encounter = floor.encounter;
  const challenge = challengeFor(encounter);
  const showLift = liftFloors.length > 1;

  return (
    <BossApproach
      key={encounter.id}
      art={encounter.still}
      intrinsic={LOCATION_STILL_INTRINSIC}
      challenge={challenge}
      lootTable={floor.lootTable ?? PLAYGROUND_LOOT_TABLE}
      farmWeights={floor.farmWeights}
      isFirstClear={!clearedEncounterIds.includes(encounter.id)}
      onBack={closeEncounter}
      onCleared={() => markEncounterCleared(encounter.id)}
      sceneKicker={dungeon.name}
      sceneName={floor.label}
      levelNav={
        showLift ? (
          <LevelNav
            floors={liftFloors.map((entry) => ({
              id: entry.id,
              label: entry.label,
              locked: !isFloorOpen(entry),
            }))}
            currentId={floorId}
            onSelect={(next) => {
              const target = liftFloors.find((entry) => entry.id === next.id);
              if (target) onPickFloor(target);
            }}
          />
        ) : null
      }
      whisper={whisper}
    />
  );
}
