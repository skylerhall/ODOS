import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, PressScale, useTheme } from './controls';
import { elevate, font, RADIUS } from './theme';

/** How long "End" stays armed for the confirming second tap. */
const END_CONFIRM_MS = 4000;

/**
 * Under the turn banner while navigating: search to add a stop or change the destination, go back to
 * the trip as planned after a quick change, and end navigation. Ending takes a second tap, so a bump
 * on a rough road doesn't end the trip.
 */
export function TripBar(props: { onSearch: () => void; original: { name: string } | null; onRestore: () => void; onEnd: () => void }) {
  const t = useTheme();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), END_CONFIRM_MS);
    return () => clearTimeout(timer);
  }, [armed]);
  return (
    <View style={styles.bar}>
      <PressScale
        accessibilityRole="search"
        accessibilityLabel="Add a stop or change where you're going"
        onPress={props.onSearch}
        scaleTo={0.98}
        style={[styles.search, { backgroundColor: t.bg }, elevate(t, 2)]}
      >
        <Icon name="magnify" size={22} color={t.brand} />
        <Text style={[styles.searchText, { color: t.muted }]} numberOfLines={1}>
          Add a stop or reroute
        </Text>
      </PressScale>
      {props.original ? (
        <PressScale
          accessibilityRole="button"
          accessibilityLabel={`Back to your original trip to ${props.original.name}`}
          onPress={props.onRestore}
          scaleTo={0.94}
          style={[styles.button, { backgroundColor: t.bg }, elevate(t, 2)]}
        >
          <Icon name="backup-restore" size={22} color={t.accent} />
          <Text style={[styles.buttonText, { color: t.accent }]}>Original</Text>
        </PressScale>
      ) : null}
      <PressScale
        accessibilityRole="button"
        accessibilityLabel={armed ? 'Tap again to end navigation' : 'End navigation'}
        accessibilityHint={armed ? undefined : 'Tap twice to end the trip'}
        onPress={() => {
          if (!armed) return setArmed(true);
          setArmed(false);
          props.onEnd();
        }}
        scaleTo={0.94}
        style={[styles.button, { backgroundColor: armed ? t.danger : t.bg }, elevate(t, 2)]}
      >
        <Icon name="close-octagon" size={22} color={armed ? t.onAccent : t.danger} />
        <Text style={[styles.buttonText, { color: armed ? t.onAccent : t.danger }]}>{armed ? 'Tap again' : 'End'}</Text>
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', marginTop: 8, gap: 8 },
  search: { flex: 1, minHeight: 56, borderRadius: RADIUS.pill, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  searchText: { flex: 1, fontSize: 16, fontFamily: font('500'), marginLeft: 8 },
  button: { width: 76, minHeight: 56, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  buttonText: { fontSize: 12, fontFamily: font('700'), marginTop: 2 },
});
