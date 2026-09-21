import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import GutterjackLocation from './GutterjackLocation';
import HubCrownhaven from './HubCrownhaven';
import KingdomMap from './KingdomMap';
import TavernGround from './TavernGround';
import { TAVERN_INTERIOR, floorById } from './interiors';
import { useWorldStore } from './store';

export default function WorldScreen() {
  const screen = useWorldStore((s) => s.currentScreen);
  const interiorId = useWorldStore((s) => s.currentInteriorId);
  const floorId = useWorldStore((s) => s.currentFloorId);
  const openHub = useWorldStore((s) => s.openHub);
  const openMap = useWorldStore((s) => s.openMap);

  const tavernFloor =
    screen === 'interior' && interiorId === 'tavern'
      ? floorById(TAVERN_INTERIOR, floorId ?? TAVERN_INTERIOR.defaultFloorId)
      : undefined;
  const tavernFight = tavernFloor?.kind === 'fight' && tavernFloor.fightId === 'gutterjack';
  const tavernHall = Boolean(tavernFloor) && !tavernFight;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = useWorldStore.getState().currentScreen;
      if (current === 'map') return false;
      if (current === 'interior') {
        openHub();
        return true;
      }
      openMap();
      return true;
    });
    return () => sub.remove();
  }, [openHub, openMap]);

  return (
    <View style={styles.root}>
      <View style={styles.stage}>
        {screen === 'map' ? <KingdomMap /> : null}
        {screen === 'hub' ? <HubCrownhaven /> : null}
        {tavernHall ? <TavernGround /> : null}
        {tavernFight ? <GutterjackLocation /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070510',
    alignItems: 'center',
  },
  stage: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
  },
});
