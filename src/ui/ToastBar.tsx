import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { Toast } from '../state/useOdos';
import { Icon, useTheme } from './controls';
import { font, RADIUS } from './theme';

/** Warnings stay up longer than confirmations. */
const SHOW_MS = { amber: 9000, other: 5000 };

/** Short confirmations and alerts above the panel. Tap to dismiss. */
export function ToastBar({ text, tone, onDone }: { text: string; tone: Toast['tone']; onDone: () => void }) {
  const t = useTheme();
  useEffect(() => {
    const id = setTimeout(onDone, tone === 'amber' ? SHOW_MS.amber : SHOW_MS.other);
    return () => clearTimeout(id);
  }, [onDone, tone]);
  const look = {
    info: { bg: t.banner, fg: t.onBanner, icon: 'information-outline' as const },
    amber: { bg: t.amber, fg: t.onAmber, icon: 'alert-outline' as const },
    good: { bg: t.good, fg: '#FFFFFF', icon: 'check-circle-outline' as const },
    danger: { bg: t.danger, fg: '#FFFFFF', icon: 'alert-circle-outline' as const },
  }[tone];
  return (
    <Pressable
      onPress={onDone}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.toast, { backgroundColor: look.bg }]}
    >
      <Icon name={look.icon} size={22} color={look.fg} />
      <Text style={[styles.text, { color: look.fg }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.control,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  text: { flex: 1, fontSize: 16, fontFamily: font('600'), marginLeft: 10, lineHeight: 21 },
});
