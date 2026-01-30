import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export function useCapacitor() {
  useEffect(() => {
    const initializeCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        // Hide splash screen after app is ready
        await SplashScreen.hide();
        
        // Configure status bar
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#1a1a2e' });
        } catch (e) {
          console.log('StatusBar not available');
        }
      }
    };

    initializeCapacitor();
  }, []);

  return {
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform()
  };
}
