import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    // Replace with your actual login logic 
    if (username === 'user' && password === 'password') { 
      Alert.alert('Success', 'Login successful!'); 
    } else { 
      Alert.alert('Error', 'Invalid credentials.'); 
    }
  };

  const handleRegister = () => {
    // Replace with your actual registration logic 
    if (username && password) { 
      Alert.alert('Success', 'Registration successful!'); 
      setIsRegistering(false); 
    } else { 
      Alert.alert('Error', 'Please enter username and password.'); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {isRegistering ? 'Register' : 'Login'}
        </Text>
        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={isRegistering ? handleRegister : handleLogin}
        >
          <Text style={styles.buttonText}>
            {isRegistering ? 'Register' : 'Login'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setIsRegistering(!isRegistering)} 
        >
          <Text style={styles.toggleText}>
            {isRegistering ? 'Go to Login' : 'Go to Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleText: {
    marginTop: 15,
    color: '#4CAF50',
  },
});

export default Login;