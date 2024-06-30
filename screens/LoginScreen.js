import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://6bb5-192-248-2-10.ngrok-free.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const responseText = await response.text();
      console.log('Login response text:', responseText); // Log the response text
  
      if (response.ok) {
        const data = JSON.parse(responseText); // Parse the response text
        console.log('Login response:', data); // Log the parsed response
  
        if (data.success) {
          await AsyncStorage.setItem('userToken', data.token);
          navigation.replace('Search');
        } else {
          alert('Login failed. Please check your credentials.');
        }
      } else {
        alert(`Login failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Network request failed', error);
      alert('Network request failed');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
