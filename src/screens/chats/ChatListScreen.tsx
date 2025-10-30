import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ChatListScreenProps } from '../../navigation/types';

// Dummy data
const chats = [
  { id: '1', name: 'alpha', media: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXZgpzdVbHCW-va2yZFdfmPiUBZ0yZq8fSoA&s'},
  { id: '2', name: 'beta', media: 'https://cdn.prod.website-files.com/60b550ccbb1a59f65dc28805/679d08d9ed93cb9c981b53c3_661e5dca8eb67f5abfed52b3_CB3mo20ayudarte20imagen20a20mA1s.jpeg'}
];

const ChatListScreen = ({ navigation }: ChatListScreenProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatScreen', { chatId: item.id, name: item.name, mediaUri: item.media })}
          >
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  chatName: { fontSize: 18 },
});

export default ChatListScreen;