import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import GutterjackLocation from './GutterjackLocation';
import HubCrownhaven from './HubCrownhaven';
import KingdomMap from './KingdomMap';
import { useWorldStore } from './store';

export default function WorldScreen() {
  const screen = useWorldStore((s) => s.currentScreen);
  const locationId = useWorldStore((s) => s.currentLocationId);
  const openHub = useWorldStore((s) => s.openHub);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = useWorldStore.getState().currentScreen;
      if (current === 'hub') return false;
      openHub();
      return true;
    });
    return () => sub.remove();
  }, [openHub]);

  return (
    <View style={styles.root}>
      <View style={styles.stage}>
        {screen === 'map' ? <KingdomMap /> : null}
        {screen === 'location' && locationId === 'gutterjack' ? <GutterjackLocation /> : null}
        {screen === 'hub' || (screen === 'location' && locationId !== 'gutterjack') ? (
          <HubCrownhaven />
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
