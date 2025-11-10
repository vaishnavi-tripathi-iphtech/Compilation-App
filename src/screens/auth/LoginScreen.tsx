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
      <Text style={styles.title}>Welcome Back !</Text>
      <View style={styles.subcontainer}>
        <Text style={styles.title2}>afrivalley</Text>
        <Text style={styles.signInText}>Please login with your personal information.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
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
            <Text style={styles.loginbuttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.loginwithText}>Login with</Text>
        <View style={styles.logocontainer}>
          <View style={styles.logobg}>
            <Image source={require("../assets/icons/facebook.png")} style={{ width: 32, height: 32 }} />
            <Image source={require("../assets/icons/instagram.png")} style={{ width: 32, height: 32 }} />
            <Image source={require("../assets/icons/linkedin.png")} style={{ width: 32, height: 32 }} />
          </View>
        </View>


      </View>
      
    
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signInLink}>Register</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    //padding: 20,
    backgroundColor: '#020067ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color:'white',
    margin: 80
  },
  title2: {
    fontSize: 28,
    color:'#020067ff',
    margin: 14,
  },
  subcontainer:{
    width: '100%',
    height: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: "#020067ff",
    borderTopLeftRadius: 100,
    borderStyle: "solid",
    alignItems: 'center'
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#d9d9d9ff',
    borderRadius: 50,
    backgroundColor: '#fcfcfcff',
    paddingHorizontal: 25,
    marginBottom: 15,
    fontSize: 13,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15
  },
  loginbutton: {
    backgroundColor: '#030c70',
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginTop: 10,
    width: '100%',
    height: 50,
    alignItems: 'center'
  },
  loginbuttonText: {
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 ,
  },
  loginwithText: {
    fontSize: 14,
    color: '#161616ff',
    padding: 50
  },
  logocontainer:{

  },
  logobg:{

  },
  registerbutton: {
    marginTop: 20,
    color: '#020067ff',
    fontWeight: 'bold',
  },
  image: { 
    marginTop: 20,
    width: 50, 
    height: 50, 
    borderRadius: 75, 
    marginBottom: 20 
  },
signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 14,
    color: '#161616ff',
    paddingBottom: 50
  },
    signInLink: {
    fontSize: 16,
    color: '#020067ff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;