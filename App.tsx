//import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//import SplashScreen from 'react-native-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { store, persistor } from './src/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {

  return (
    // Provide the Redux store to the entire app
    <Provider store={store}>

{/* persistgate delays rendering until the persisted state is rehydrated */}
      <PersistGate
      
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar backgroundColor='#000000ff' barStyle="light-content" />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;   