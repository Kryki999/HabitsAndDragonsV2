import BossApproach from './BossApproach';
import FloorLift from './FloorLift';
import {
  GUTTERJACK_ART,
  GUTTERJACK_ART_INTRINSIC,
  GUTTERJACK_CHALLENGE,
  GUTTERJACK_LOOT_TABLE,
} from './content';
import { TAVERN_INTERIOR } from './interiors';
import { useTavernLift } from './useTavernLift';
import { useWorldStore } from './store';

export default function GutterjackLocation() {
  const openHub = useWorldStore((s) => s.openHub);
  const markGutterjackCleared = useWorldStore((s) => s.markGutterjackCleared);
  const alreadyCleared = useWorldStore((s) => s.gutterjackCleared);
  const { floorId, onPickFloor, whisper } = useTavernLift();

  return (
    <BossApproach
      art={GUTTERJACK_ART.fight}
      intrinsic={GUTTERJACK_ART_INTRINSIC}
      challenge={GUTTERJACK_CHALLENGE}
      lootTable={GUTTERJACK_LOOT_TABLE}
      isFirstClear={!alreadyCleared}
      sipWine
      onBack={openHub}
      onCleared={markGutterjackCleared}
      headerExtra={<FloorLift floors={TAVERN_INTERIOR.floors} currentId={floorId} onSelect={onPickFloor} />}
      whisper={whisper}
    />
  );
}
