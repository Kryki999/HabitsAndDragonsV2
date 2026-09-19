import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import GutterjackLocation from './GutterjackLocation';
import HubCrownhaven from './HubCrownhaven';
import KingdomMap from './KingdomMap';
import LocationStill from './LocationStill';
import { getLocation } from './content';
import { useWorldStore } from './store';

export default function WorldScreen() {
  const locationId = useWorldStore((s) => s.currentLocationId);
  const goBack = useWorldStore((s) => s.goBack);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => goBack());
    return () => sub.remove();
  }, [goBack]);

  const loc = locationId ? getLocation(locationId) : null;

  return (
    <View style={styles.root}>
      <View style={styles.stage}>
        {!loc ? <KingdomMap /> : null}
        {loc?.view === 'hub' ? <HubCrownhaven /> : null}
        {loc?.view === 'gutterjack' ? <GutterjackLocation /> : null}
        {loc?.view === 'still' && locationId ? <LocationStill locationId={locationId} /> : null}
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
