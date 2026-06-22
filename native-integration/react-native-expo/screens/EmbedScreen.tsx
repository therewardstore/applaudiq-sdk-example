import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApplaudIQEmbed } from '@applaudiq/embed-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Config } from '../config';
import { Brand } from '../theme';
import { useStatus } from '../statusStore';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Embed'>;

/**
 * Full-screen embed host (no nav header) — the back gesture pops it. The WebView doesn't read the
 * device safe-area, so we pad the top by the status-bar inset (a brand-violet strip, matching the
 * home hero) to keep the portal's own top bar clear of the status bar.
 */
export default function EmbedScreen({ route, navigation }: Props) {
  const { mode, token } = route.params;
  const { set } = useStatus();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.fill, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ApplaudIQEmbed
        config={{
          key: Config.PUBLISHABLE_KEY,
          baseUrl: Config.BASE_URL,
          ssoCallback: Config.SSO_CALLBACK,
        }}
        token={mode === 'auto' ? token : undefined}
        mode={mode}
        onReady={() => set('success', 'Signed in')}
        onAuthPending={() => set('pending', 'Pending HR approval')}
        onError={(m) => set('error', 'Error: ' + m)}
        onClose={() => navigation.goBack()}
        onSignOut={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1, backgroundColor: Brand.violet } });
