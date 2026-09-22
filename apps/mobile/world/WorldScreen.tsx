import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import GutterjackLocation from './GutterjackLocation';
import HubCrownhaven from './HubCrownhaven';
import KingdomMap from './KingdomMap';
import LocationStill from './LocationStill';
import MapBossApproach from './MapBossApproach';
import NpcStill from './NpcStill';
import TavernGround from './TavernGround';
import {
  MAP_LOCATIONS,
  dungeonForHotspot,
  getLocationHotspot,
  npcById,
} from './content';
import { INTERIORS, floorById } from './interiors';
import { useWorldStore } from './store';

export default function WorldScreen() {
  const screen = useWorldStore((s) => s.currentScreen);
  const interiorId = useWorldStore((s) => s.currentInteriorId);
  const floorId = useWorldStore((s) => s.currentFloorId);
  const locationId = useWorldStore((s) => s.currentLocationId);
  const hotspotId = useWorldStore((s) => s.currentHotspotId);
  const openHub = useWorldStore((s) => s.openHub);
  const openMap = useWorldStore((s) => s.openMap);
  const closeEncounter = useWorldStore((s) => s.closeEncounter);

  const interior = screen === 'interior' && interiorId ? INTERIORS[interiorId] : undefined;
  const interiorFloor = interior
    ? floorById(interior, floorId ?? interior.defaultFloorId)
    : undefined;
  const tavernFight =
    interior?.id === 'tavern' &&
    interiorFloor?.kind === 'fight' &&
    interiorFloor.fightId === 'gutterjack';
  const tavernHall = interior?.id === 'tavern' && Boolean(interiorFloor) && !tavernFight;
  const hubNpc =
    interiorFloor?.kind === 'npc' && interiorFloor.npcId
      ? npcById(interiorFloor.npcId)
      : undefined;

  const mapLocation = screen === 'location' && locationId ? MAP_LOCATIONS[locationId] : undefined;
  const encounterHotspot =
    screen === 'encounter' && locationId ? getLocationHotspot(locationId, hotspotId) : undefined;
  const encounterDungeon = dungeonForHotspot(encounterHotspot);
  const encounterNpc =
    encounterHotspot?.kind === 'npc' ? npcById(encounterHotspot.npcId) : undefined;
  const encounterLocation = locationId ? MAP_LOCATIONS[locationId] : undefined;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = useWorldStore.getState().currentScreen;
      if (current === 'map') return false;
      if (current === 'interior') {
        openHub();
        return true;
      }
      if (current === 'encounter') {
        closeEncounter();
        return true;
      }
      if (current === 'location') {
        openMap();
        return true;
      }
      openMap();
      return true;
    });
    return () => sub.remove();
  }, [closeEncounter, openHub, openMap]);

  return (
    <View style={styles.root}>
      <View style={styles.stage}>
        {screen === 'map' ? <KingdomMap /> : null}
        {screen === 'hub' ? <HubCrownhaven /> : null}
        {tavernHall ? <TavernGround /> : null}
        {tavernFight ? <GutterjackLocation /> : null}
        {hubNpc && interior ? (
          <NpcStill
            name={hubNpc.name}
            kicker={interior.hubKicker}
            still={hubNpc.still}
            flavor={hubNpc.flavor}
            stillAnchor={hubNpc.stillAnchor}
            onBack={openHub}
            testID={`npc-still-${hubNpc.id}`}
          />
        ) : null}
        {mapLocation && locationId ? <LocationStill locationId={locationId} /> : null}
        {encounterDungeon && locationId ? <MapBossApproach locationId={locationId} /> : null}
        {encounterNpc && encounterLocation ? (
          <NpcStill
            name={encounterNpc.name}
            kicker={encounterLocation.name}
            still={encounterNpc.still}
            flavor={encounterNpc.flavor}
            stillAnchor={encounterNpc.stillAnchor}
            onBack={closeEncounter}
            testID={`npc-still-${encounterNpc.id}`}
          />
        ) : null}
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
