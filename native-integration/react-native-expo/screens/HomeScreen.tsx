import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { LinearGradient } from '../gradient';
import { Brand } from '../theme';
import { Config } from '../config';
import { getEmbedToken } from '../MintClient';
import { useStatus, type StatusKind } from '../statusStore';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { kind, message, set } = useStatus();
  const [minting, setMinting] = React.useState(false);

  const openManual = () => {
    set('idle', 'Opening manual login…');
    navigation.navigate('Embed', { mode: 'manual' });
  };

  const openAuto = async () => {
    setMinting(true);
    set('loading', 'Minting a one-time token…');
    try {
      const token = await getEmbedToken();
      setMinting(false);
      navigation.navigate('Embed', { mode: 'auto', token });
    } catch (e) {
      setMinting(false);
      set('error', 'Mint failed: ' + String(e));
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={Brand.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 24 }]}
      >
        <View style={styles.badge}>
          <Image source={require('../assets/brand.png')} style={styles.badgeImg} resizeMode="contain" />
        </View>
        <Text style={styles.heroTitle}>Applaud IQ</Text>
        <Text style={styles.heroSubtitle}>{Config.EXAMPLE_LABEL} embed example</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionLabel}>CHOOSE A LOGIN MODE</Text>

        <ModeCard
          icon="🔒"
          title="Manual login"
          subtitle="Employees sign in inside the embed (email + SSO). No server needed."
          onPress={openManual}
          disabled={minting}
        />
        <View style={{ height: 12 }} />
        <ModeCard
          icon="⚡"
          title="Auto-login"
          subtitle="Silent sign-in with a one-time token minted on your server."
          onPress={openAuto}
          disabled={minting}
          busy={minting}
        />

        <View style={{ height: 22 }} />
        <StatusPill kind={kind} message={message} />

        <Text style={styles.footer}>@applaudiq/embed-react-native · npm</Text>
      </ScrollView>
    </View>
  );
}

function ModeCard({
  icon,
  title,
  subtitle,
  onPress,
  disabled,
  busy,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        disabled && !busy ? styles.cardDisabled : null,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <LinearGradient colors={Brand.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.iconTile}>
        <Text style={styles.iconText}>{icon}</Text>
      </LinearGradient>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      {busy ? <ActivityIndicator color={Brand.violet} /> : <Text style={styles.chevron}>›</Text>}
    </Pressable>
  );
}

function StatusPill({ kind, message }: { kind: StatusKind; message: string }) {
  const color = Brand.status[kind];
  return (
    <View style={[styles.pill, { backgroundColor: color + '1A', borderColor: color + '40' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.pillText, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.surface },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  badgeImg: { width: 48, height: 48 },
  heroTitle: { color: Brand.white, fontSize: 24, fontWeight: '700', marginTop: 18 },
  heroSubtitle: { color: 'rgba(255,255,255,0.84)', fontSize: 15, marginTop: 4 },

  body: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 },
  sectionLabel: {
    color: Brand.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Brand.cardBorder,
    padding: 16,
  },
  cardDisabled: { opacity: 0.55 },
  cardPressed: { opacity: 0.85 },
  iconTile: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22 },
  cardBody: { flex: 1, marginLeft: 14 },
  cardTitle: { color: Brand.ink, fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: Brand.muted, fontSize: 13, marginTop: 3, lineHeight: 18 },
  chevron: { color: Brand.muted, fontSize: 26, marginLeft: 10 },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  pillText: { flex: 1, fontSize: 14, fontWeight: '600' },

  footer: { color: Brand.muted, fontSize: 12, textAlign: 'center', marginTop: 18 },
});
