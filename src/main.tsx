import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize Capacitor plugins
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

// Hide splash screen when app is ready
if (Capacitor.isNativePlatform()) {
  // Wait for app to be fully rendered before hiding splash
  window.addEventListener('load', () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
