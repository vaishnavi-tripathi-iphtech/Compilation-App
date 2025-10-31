import React, {useEffect} from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { logout, selectCurrentUser } from '../../../store/authSlice';
import apiClient from '../../../api/client';

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const authData = useSelector(selectCurrentUser);
  const user = authData?.user;
  const { isRefreshing } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authData?.exp) {
      const expirationTime = authData.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration > 0) {
        console.log(`PROFILE SCREEN: Token will expire in ${Math.round(timeUntilExpiration / 1000)} seconds.`);
        
        const timerId = setTimeout(() => {
          console.warn('<<<<< TOKEN HAS EXPIRED! >>>>> You can now press "Test Protected API" to see the silent refresh.');
        }, timeUntilExpiration);

        // This is a cleanup function. It runs if the component unmounts.
        // It's important to clear the timer to prevent memory leaks.
        return () => clearTimeout(timerId);
      } else {
        console.warn('<<<<< TOKEN IS ALREADY EXPIRED! >>>>> Press "Test Protected API" to see the silent refresh.');
      }
    }
  }, [authData?.exp]); // This effect re-runs if the expiration time changes (on a new login)
  
  const handleTestApi = async () => {
    try {
      console.log(`triggering fake api call`);
       //Alert.alert('Triggering fake API call.',
        //'If token is expired this will trigger a silent refresh.', [{ text: 'OK' },
           // ]);
    // This will fail with a 404, but our interceptor will run first if the token is expired.
    // We will catch the 404 to prevent an unhandled rejection warning.
      await apiClient.get('/protected-data'); 
    } catch (e: any) {
      if (e.response?.status !== 401) {
        // This might run after a successful refresh if the final call still fails (e.g., 404)
        console.log('API call finished.');
      } else {
        console.log(`API call failed: ${e.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user && <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>}
      
      <View style={styles.button}>
        <Button title="Test Protected API" onPress={handleTestApi} />
      </View>

      <View style={styles.button}>
        <Button
          title={isRefreshing ? 'Refreshing Session...' : 'Log Out'}
          onPress={() => dispatch(logout())}
          disabled={isRefreshing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20
  },

  title: { 
    fontSize: 24, 
    marginBottom: 10 
  },

  welcomeText: {
    fontSize: 18,
    marginBottom: 30,
    color: '#333',
  },

  button: {
    width: '80%',
    marginVertical: 5,
  }
});

export default ProfileScreen;



