import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';

const MotionContext = createContext({ reduceMotion: true, appActive: true });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(true);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    let alive = true;
    let preferenceChanged = false;
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      preferenceChanged = true;
      setReduceMotion(value);
    });
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (alive && !preferenceChanged) setReduceMotion(value);
    }).catch(() => {});
    const activity = AppState.addEventListener('change', value => setAppActive(value === 'active'));
    return () => { alive = false; preference.remove(); activity.remove(); };
  }, []);
  return <MotionContext.Provider value={{ reduceMotion, appActive }}>{children}</MotionContext.Provider>;
}

export const useMotionPreferences = () => useContext(MotionContext);
