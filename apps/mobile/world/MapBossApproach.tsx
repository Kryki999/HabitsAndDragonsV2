import React from 'react';

import { PLAYGROUND_LOOT_TABLE } from './content';
import BossApproach from './BossApproach';
import { LOCATION_STILL_INTRINSIC, MAP_LOCATIONS, challengeFor } from './locations';
import { useWorldStore } from './store';
import type { MapLocationId } from './types';

type Props = {
  locationId: MapLocationId;
};

/** Map-boss approach — Gutterjack chrome, no tavern lift. */
export default function MapBossApproach({ locationId }: Props) {
  const closeEncounter = useWorldStore((s) => s.closeEncounter);
  const markEncounterCleared = useWorldStore((s) => s.markEncounterCleared);
  const clearedEncounterIds = useWorldStore((s) => s.clearedEncounterIds);
  const location = MAP_LOCATIONS[locationId];
  const encounter = location.encounter;
  if (encounter.kind !== 'boss') return null;

  const challenge = challengeFor(encounter);

  return (
    <BossApproach
      art={encounter.still}
      intrinsic={LOCATION_STILL_INTRINSIC}
      challenge={challenge}
      lootTable={PLAYGROUND_LOOT_TABLE}
      isFirstClear={!clearedEncounterIds.includes(encounter.id)}
      onBack={closeEncounter}
      onCleared={() => markEncounterCleared(encounter.id)}
    />
  );
}
