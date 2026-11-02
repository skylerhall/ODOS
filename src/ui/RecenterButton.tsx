import { StyleSheet } from 'react-native';
import { Icon, PressScale, useTheme } from './controls';
import { elevate } from './theme';

const SIZE = 58;
/** Width of the toggle rail below; the button is centered over it. */
const RAIL_WIDTH = 72;

/** Top right, beside the weather: plain while the map follows you, filled once you've panned away. */
export function RecenterButton({ following, onPress }: { following: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel={following ? 'Map is centered on your location' : 'Re-center map on your location'}
      style={[styles.button, { backgroundColor: following ? t.bg : t.accent }, elevate(t, 2)]}
    >
      <Icon name="crosshairs-gps" size={26} color={following ? t.accent : t.onAccent} />
    </PressScale>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    marginRight: (RAIL_WIDTH - SIZE) / 2,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
