import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import DevPanel from './DevPanel';
import GutterjackLocation from './GutterjackLocation';
import HubCrownhaven from './HubCrownhaven';
import KingdomMap from './KingdomMap';
import LocationScreen from './LocationScreen';
import { useWorldStore } from './store';

export default function WorldScreen() {
  const screen = useWorldStore((s) => s.currentScreen);
  const locationId = useWorldStore((s) => s.currentLocationId);
  const openHub = useWorldStore((s) => s.openHub);
  const openMap = useWorldStore((s) => s.openMap);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = useWorldStore.getState().currentScreen;
      const loc = useWorldStore.getState().currentLocationId;
      if (current === 'map') return false;
      if (current === 'location' && loc === 'gutterjack') {
        openHub();
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
  }, [openHub, openMap]);

  return (
    <View style={styles.root}>
      <View style={styles.stage}>
        {screen === 'map' ? <KingdomMap /> : null}
        {screen === 'hub' ? <HubCrownhaven /> : null}
        {screen === 'location' && locationId === 'gutterjack' ? <GutterjackLocation /> : null}
        {screen === 'location' && locationId && locationId !== 'gutterjack' ? <LocationScreen /> : null}
        <DevPanel />
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
