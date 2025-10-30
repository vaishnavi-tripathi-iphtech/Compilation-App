import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { registerUser, clearError } from '../../store/authSlice';
import { AuthStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;
const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

useEffect(() => {
    //clears error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    
    // Thunks return a promise. We can use .unwrap() to handle success/error inline.
    try {
      await dispatch(registerUser({ username, password })).unwrap();
      Alert.alert('Success!', 'You have registered. Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (rejectedValue) {
      console.error('Failed to register:', rejectedValue);
    }
  };
  return (
    <View style={styles.container}>
       <Text style={styles.title}>Welcome!</Text>
       <Text style={styles.subtitle}>Create an account to get started.</Text>
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={setConfirmPassword} secureTextEntry />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.button}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#003a92ff" />
        ) : (
          <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.logInContainer}>
      <Text style= {styles.logInText}>Already have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
        <Text style={styles.logInLink}>Log In</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d2a3d',
    textAlign: 'center',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5a677d',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e4e7eb',
  },
  button: {
    backgroundColor: '#007bff', 
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  logInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  logInText: {
    fontSize: 16,
    color: '#5a677d',
  },
  logInLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;