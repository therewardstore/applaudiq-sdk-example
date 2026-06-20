import React, { useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ApplaudIQEmbed } from '@applaudiq/embed-react-native';

import { Config } from './config';
import { getEmbedToken } from './MintClient';

// Android draws edge-to-edge (enforced on Android 15+), so reserve the status-bar height ourselves
// to keep app content from rendering UNDER the status bar. (iOS handles the inset via SafeAreaView.)
const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

type Screen = 'home' | 'manual' | 'auto';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [token, setToken] = useState<string | undefined>();
  const [status, setStatus] = useState('Choose a login mode to open the embed.');

  const openAuto = async () => {
    try {
      setStatus('Minting token…');
      setToken(await getEmbedToken());
      setScreen('auto');
    } catch (e) {
      setStatus('Mint failed: ' + String(e));
    }
  };

  if (screen !== 'home') {
    return (
      <View style={styles.embed}>
        {/* Light icons; the embed sits BELOW the status bar (paddingTop) so the portal never overlaps it. */}
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ApplaudIQEmbed
          config={{
            key: Config.PUBLISHABLE_KEY,
            baseUrl: Config.BASE_URL,
            ssoCallback: Config.SSO_CALLBACK,
          }}
          token={screen === 'auto' ? token : undefined}
          mode={screen === 'auto' ? 'auto' : 'manual'}
          onReady={() => setStatus('Signed in')}
          onAuthPending={() => setStatus('Pending HR approval')}
          onError={(m) => setStatus('Error: ' + m)}
          onClose={() => setScreen('home')}
          onSignOut={() => setScreen('home')}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Dark icons on the light home screen. */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Text style={styles.title}>Applaud IQ — Expo embed example</Text>
      <Pressable style={styles.btn} onPress={() => setScreen('manual')}>
        <Text style={styles.btnText}>Manual login</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={openAuto}>
        <Text style={styles.btnText}>Auto-login</Text>
      </Pressable>
      <Text style={styles.status}>{status}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  embed: { flex: 1, paddingTop: STATUS_BAR_HEIGHT, backgroundColor: '#5b4ff0' },
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: STATUS_BAR_HEIGHT + 24,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  btn: { backgroundColor: '#6d5efc', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  status: { textAlign: 'center', color: '#666', marginTop: 12 },
});
