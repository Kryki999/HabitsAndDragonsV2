import { useOnboardingStore } from '@/onboarding/store';
import { LevelNav } from '@/ui/LevelNav';

import BossApproach from './BossApproach';
import {
  GUTTERJACK_ART,
  GUTTERJACK_ART_INTRINSIC,
  GUTTERJACK_CHALLENGE,
  GUTTERJACK_LOOT_TABLE,
} from './content';
import { isFloorOpen, TAVERN_INTERIOR } from './interiors';
import { useTavernLift } from './useTavernLift';
import { useWorldStore } from './store';

export default function GutterjackLocation() {
  const openHub = useWorldStore((s) => s.openHub);
  const markGutterjackCleared = useWorldStore((s) => s.markGutterjackCleared);
  const alreadyCleared = useWorldStore((s) => s.gutterjackCleared);
  const { floorId, onPickFloor, whisper } = useTavernLift();
  const floor = TAVERN_INTERIOR.floors.find((entry) => entry.id === floorId);

  return (
    <BossApproach
      art={GUTTERJACK_ART.fight}
      intrinsic={GUTTERJACK_ART_INTRINSIC}
      challenge={GUTTERJACK_CHALLENGE}
      lootTable={GUTTERJACK_LOOT_TABLE}
      isFirstClear={!alreadyCleared}
      tutorialLock={!alreadyCleared}
      skipEntryGate={!alreadyCleared}
      sipWine
      onBack={openHub}
      onCleared={() => {
        markGutterjackCleared();
        useOnboardingStore.getState().markTutorialDone();
      }}
      sceneKicker={TAVERN_INTERIOR.name}
      sceneName={floor?.label ?? 'Cellar'}
      levelNav={
        <LevelNav
          floors={TAVERN_INTERIOR.floors.map((entry) => ({
            id: entry.id,
            label: entry.label,
            locked: !isFloorOpen(entry),
          }))}
          currentId={floorId}
          onSelect={(next) => {
            const target = TAVERN_INTERIOR.floors.find((entry) => entry.id === next.id);
            if (target) onPickFloor(target);
          }}
        />
      }
      whisper={whisper}
    />
  );
}
