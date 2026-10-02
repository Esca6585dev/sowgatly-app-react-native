import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REGION_KEY = 'sowgatly_region';
const RegionContext = createContext(null);

// The city the user browses in. null means "all cities".
export const RegionProvider = ({ children }) => {
  const [region, setRegionState] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(REGION_KEY)
      .then((saved) => { if (saved) setRegionState(JSON.parse(saved)); })
      .catch(() => {});
  }, []);

  const setRegion = async (next) => {
    setRegionState(next);
    try {
      if (next) await AsyncStorage.setItem(REGION_KEY, JSON.stringify(next));
      else await AsyncStorage.removeItem(REGION_KEY);
    } catch (e) {
      // Selection still applies for this session.
    }
  };

  const value = useMemo(() => ({ region, setRegion }), [region]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
};

export const useRegion = () => {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return ctx;
};
