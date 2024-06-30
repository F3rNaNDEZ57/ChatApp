import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import debounce from 'lodash.debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [chatInstances, setChatInstances] = useState([]);

  useEffect(() => {
    const fetchChatInstances = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      const response = await fetch('https://032e-112-134-155-63.ngrok-free.app/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setChatInstances(data.users);
    };

    fetchChatInstances();
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      searchUsers(query);
    } else {
      setUsers([]);
    }
  }, [query]);

  const searchUsers = debounce(async (searchQuery) => {
    try {
      const response = await fetch(`https://6bb5-192-248-2-10.ngrok-free.app/search_users?query=${searchQuery}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }, 300);

  const handleChat = (username) => {
    navigation.navigate('Chat', { recipientUsername: username });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Back"
        onPress={() => navigation.navigate('Login')}
      />
      <TextInput
        style={styles.input}
        placeholder="Search users by username"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={query.length > 0 ? users : chatInstances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChat(item.username)}>
            <View style={styles.userItem}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.lastMessage}>{item.last_message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontWeight: 'bold',
  },
  lastMessage: {
    color: 'gray',
  },
});

export default SearchScreen;
