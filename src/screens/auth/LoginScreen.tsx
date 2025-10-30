import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { loginUser, clearError } from '../../store/authSlice';
import { AuthStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    //clears error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) return;
    dispatch(loginUser({ username, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTib9pnixf5hy3Qs_WB9rMCu09PpG8HkE6oDw&s' }} 
            style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.buttonContainer}>
       
        {isLoading ? (
          <ActivityIndicator size="large" color="#0099FF" />
        ) : (
          <TouchableOpacity style={styles.loginbutton}
            onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.loginbuttonText}>Log In</Text>
          </TouchableOpacity>
        )}
      </View>
    
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signInLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#fcfcfcff',
    borderRadius: 8,
    backgroundColor: '#fcfcfcff',
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginbutton: {
    backgroundColor: '#008be7ff',
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  loginbuttonText: {
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  registerbutton: {
    marginTop: 20,
    color: '#008be7ff',
    fontWeight: 'bold',
  },
  image: { 
    //marginTop: 20,
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    marginBottom: 20 },
signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 16,
    color: '#5a677d',
  },
    signInLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;