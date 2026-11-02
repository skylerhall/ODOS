import { StyleSheet, Text } from 'react-native';
import type { Settings } from '../state/useOdos';
import { Icon, PressScale, Rail, RoundToggle, useTheme } from './controls';
import { elevate, font, RADIUS } from './theme';

type Props = {
  settings: Pick<Settings, 'voice' | 'night' | 'traffic' | 'avoidTolls'>;
  onToggle: (key: 'voice' | 'night' | 'traffic') => void;
  onToggleTolls: () => void;
  /** A row instead of a column (landscape). */
  horizontal: boolean;
  /** Tucked away into a small tab against the screen edge. */
  hidden: boolean;
  onHiddenChange: (hidden: boolean) => void;
};

/** The one-tap map toggles beside the map: voice, night, traffic and tolls, with a Hide button. */
export function MapToggles({ settings, onToggle, onToggleTolls, horizontal, hidden, onHiddenChange }: Props) {
  const t = useTheme();
  if (hidden) {
    return (
      <PressScale
        accessibilityRole="button"
        accessibilityLabel="Show map toggles"
        accessibilityHint="Voice, night, traffic and tolls"
        onPress={() => onHiddenChange(false)}
        scaleTo={0.92}
        style={[styles.tab, { backgroundColor: t.bg }, elevate(t, 2)]}
      >
        <Icon name="chevron-left" size={20} color={t.muted} />
        <Icon name="tune-variant" size={22} color={t.brand} />
      </PressScale>
    );
  }
  return (
    <Rail horizontal={horizontal}>
      <RoundToggle
        icon={settings.voice ? 'volume-high' : 'volume-off'}
        label="Voice"
        on={settings.voice}
        onPress={() => onToggle('voice')}
      />
      <RoundToggle icon="weather-night" label="Night" on={settings.night} onPress={() => onToggle('night')} />
      <RoundToggle icon="traffic-light" label="Traffic" on={settings.traffic} onPress={() => onToggle('traffic')} />
      <RoundToggle
        icon="boom-gate"
        label={settings.avoidTolls ? 'No tolls' : 'Tolls'}
        a11yLabel="Avoid tolls"
        slash={settings.avoidTolls}
        on={settings.avoidTolls}
        onPress={onToggleTolls}
      />
      <PressScale
        accessibilityRole="button"
        accessibilityLabel="Hide map toggles"
        onPress={() => onHiddenChange(true)}
        scaleTo={0.9}
        style={styles.hide}
      >
        <Icon name="chevron-right" size={22} color={t.muted} />
        <Text style={[styles.hideText, { color: t.muted }]}>Hide</Text>
      </PressScale>
    </Rail>
  );
}

const styles = StyleSheet.create({
  hide: { width: 64, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  hideText: { fontSize: 11, fontFamily: font('600') },
  tab: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: 10, borderRadius: RADIUS.control },
});
