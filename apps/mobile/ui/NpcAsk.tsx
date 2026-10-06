import { Image, StyleSheet, View } from 'react-native';

import { SpeechBubble } from '@/ui/SpeechBubble';
import { shadow, tokens } from '@/ui/tokens';

const FACE = require('../lookdev/assets/face-vendor.jpg');

type Props = {
  caption?: string;
  question: string;
};

/** C2: stall keeper asks in a bubble. Face is the vendor still, not a form. */
export function NpcAsk({ caption = 'Stall keeper', question }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.faceRing}>
        <Image source={FACE} style={styles.face} />
      </View>
      <SpeechBubble caption={caption} emphasis="question" onCanvas style={styles.bubble}>
        {question}
      </SpeechBubble>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  faceRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: tokens.surface,
    overflow: 'hidden',
    backgroundColor: tokens.surface2,
    boxShadow: [shadow.dropMd],
  },
  face: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
  },
});
