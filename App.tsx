import AppLovinMAX from 'react-native-applovin-max';


import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View, Text, Button, StyleSheet, Platform} from 'react-native';


const SDK_KEY = 'TxhDiMQVbncc9h4M1QzqCMODZz7gMzTwuF8bbT6CKipTPuqQJoFV8dihbrNzpxthA0ImTOyt6mLWeAxyyBS5q9'; // MAX SDK key
const INTERSTITIAL_AD_UNIT_ID = Platform.select({ android: '081b0dfd806f88e2', ios: '081b0dfd806f88e2', default: '081b0dfd806f88e2' });
const REWARDED_AD_UNIT_ID     = Platform.select({ android: '2bd4d80c43f5f02e', ios: '2bd4d80c43f5f02e', default: '2bd4d80c43f5f02e' });
const BANNER_AD_UNIT_ID       = Platform.select({ android: '075282dd35c09d0d', ios: '075282dd35c09d0d', default: '075282dd35c09d0d' });

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [log, setLog] = useState('Initializing MAX…');

  useEffect(() => {
    console.log('MAX keys ->', Object.keys(AppLovinMAX));
    AppLovinMAX.setVerboseLogging?.(true);

    (async () => {
      try {
        AppLovinMAX.setTermsAndPrivacyPolicyFlowEnabled?.(true);
        AppLovinMAX.setPrivacyPolicyUrl?.('https://cas.ai/privacy_tr/');
        AppLovinMAX.setTermsOfServiceUrl?.('https://cas.ai/privacy_tr/');

        const conf: Configuration = await AppLovinMAX.initialize(SDK_KEY);
        setInitialized(true);
        setLog(`MAX initialized${conf?.countryCode ? ` (${conf.countryCode})` : ''}`);

        AppLovinMAX.addInterstitialLoadedEventListener?.(() => setLog('Interstitial loaded'));
        AppLovinMAX.addInterstitialLoadFailedEventListener?.((e: any) => setLog('Int load failed: ' + JSON.stringify(e)));
        AppLovinMAX.addInterstitialHiddenEventListener?.(() => setLog('Interstitial hidden'));

        AppLovinMAX.addRewardedAdLoadedEventListener?.(() => setLog('Rewarded loaded'));
        AppLovinMAX.addRewardedAdLoadFailedEventListener?.((e: any) => setLog('Rew load failed: ' + JSON.stringify(e)));
        AppLovinMAX.addRewardedAdHiddenEventListener?.(() => setLog('Rewarded hidden'));

        AppLovinMAX.loadInterstitial?.(INTERSTITIAL_AD_UNIT_ID);
        AppLovinMAX.loadRewardedAd?.(REWARDED_AD_UNIT_ID);
      } catch (e: any) {
        setLog('Init error: ' + (e?.message ?? String(e)));
      }
    })();

    return () => AppLovinMAX.removeAllListeners?.();
  }, []);

  const loadInterstitial = () => AppLovinMAX.loadInterstitial?.(INTERSTITIAL_AD_UNIT_ID);
  const showInterstitial = async () => {
    const ready = await AppLovinMAX.isInterstitialReady?.(INTERSTITIAL_AD_UNIT_ID);
    ready ? AppLovinMAX.showInterstitial?.(INTERSTITIAL_AD_UNIT_ID)
          : AppLovinMAX.loadInterstitial?.(INTERSTITIAL_AD_UNIT_ID);
  };

  const loadRewarded = () => AppLovinMAX.loadRewardedAd?.(REWARDED_AD_UNIT_ID);
  const showRewarded = async () => {
    const ready = await AppLovinMAX.isRewardedAdReady?.(REWARDED_AD_UNIT_ID);
    ready ? AppLovinMAX.showRewardedAd?.(REWARDED_AD_UNIT_ID)
          : AppLovinMAX.loadRewardedAd?.(REWARDED_AD_UNIT_ID);
  };

  const toggleBanner = async () => {
    if (!bannerVisible) {
      await AppLovinMAX.createBanner?.(BANNER_AD_UNIT_ID, 'top_center');
      AppLovinMAX.showBanner?.(BANNER_AD_UNIT_ID);
      setBannerVisible(true);
    } else {
      AppLovinMAX.hideBanner?.(BANNER_AD_UNIT_ID);
      AppLovinMAX.destroyBanner?.(BANNER_AD_UNIT_ID);
      setBannerVisible(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>AppLovin MAX – Test Screen</Text>
        <Text style={styles.log}>{log}</Text>

        <Button title="Open Mediation Debugger" onPress={() => AppLovinMAX.showMediationDebugger?.()} disabled={!initialized} />

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Interstitial</Text>
          <Button title="Load Interstitial" onPress={loadInterstitial} disabled={!initialized}/>
          <View style={styles.space} />
          <Button title="Show Interstitial" onPress={showInterstitial} disabled={!initialized}/>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Rewarded</Text>
          <Button title="Load Rewarded" onPress={loadRewarded} disabled={!initialized}/>
          <View style={styles.space} />
          <Button title="Show Rewarded" onPress={showRewarded} disabled={!initialized}/>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Banner</Text>
          <Button title={bannerVisible ? 'Hide Banner' : 'Show Banner'} onPress={toggleBanner} disabled={!initialized}/>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  log: { backgroundColor: '#000000ff', padding: 10, borderRadius: 8 },
  block: { padding: 12, borderRadius: 12, backgroundColor: '#9b9b9bff' },
  blockTitle: { fontWeight: '700', marginBottom: 8 },
  space: { height: 8 },
});
