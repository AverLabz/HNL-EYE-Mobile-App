import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from 'react-native-flash-message';
import { checkVersion } from 'react-native-check-version';
import ContextProvider from './src/Context/context-provider';
import HomeNavigator from './src/Navigators/navigators/StackNavigator';
import FocusAwareStatusBar from './src/Components/statusBar/FocusAwareStatusBar';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    async function check() {
      const version = await checkVersion();

      if (version.needsUpdate) {
        setTimeout(() => {
          Alert.alert(
            'Update App',
            'New version is available on playstore. Please update app',
            [
              {
                text: 'Update',
                onPress: () =>
                  Linking.openURL('market://details?id=com.hnlcontext'),
              },
            ],
            { cancelable: false },
          );
        }, 100);
      }
    }
    check();
  }, []);

  return (
    <ContextProvider>
      <NavigationContainer>
        <FocusAwareStatusBar />
        <HomeNavigator />
        <FlashMessage position="center" />
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
