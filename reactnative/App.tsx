import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import isLoggedIn from './hooks/isLoggedIn';
import Navigation from './navigation';
import { HeaderLoggedOut } from './components/HeaderLoggedOut';
import { HeaderLoggedIn } from './components/HeaderLoggedIn';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const loggedIn = isLoggedIn();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
        <SafeAreaProvider>
            {loggedIn ? <HeaderLoggedIn/> : <HeaderLoggedOut/>}
          <Navigation/>
        </SafeAreaProvider>
    );
  }
}
