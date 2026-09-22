import { useCallback, useEffect, useRef, useState } from 'react';

import { isFloorOpen, TAVERN_INTERIOR, type InteriorFloorDef } from './interiors';
import { useWorldStore } from './store';

/** Shared lift handler — tavern and map dungeon elevators. */
export function useFloorLift(floors: InteriorFloorDef[], currentId: string) {
  const setFloor = useWorldStore((s) => s.setFloor);
  const [whisper, setWhisper] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showWhisper = useCallback((message: string | null) => {
    if (timer.current) clearTimeout(timer.current);
    setWhisper(message);
    if (message) {
      timer.current = setTimeout(() => setWhisper(null), 1800);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onPickFloor = useCallback(
    (next: InteriorFloorDef) => {
      if (next.id === currentId) return;
      if (!isFloorOpen(next)) {
        showWhisper(next.hint ?? 'Later.');
        return;
      }
      setFloor(next.id);
    },
    [currentId, setFloor, showWhisper],
  );

  return { floorId: currentId, onPickFloor, whisper };
}

/** Shared lift handler for every tavern floor (hall + Gutterjack cellar). */
export function useTavernLift() {
  const floorId = useWorldStore((s) => s.currentFloorId) ?? TAVERN_INTERIOR.defaultFloorId;
  return useFloorLift(TAVERN_INTERIOR.floors, floorId);
}
