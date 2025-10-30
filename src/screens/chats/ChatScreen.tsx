import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ChatScreenProps } from '../../navigation/types';

const ChatScreen = ({ route, navigation }: ChatScreenProps) => {
  const { name, mediaUri } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: name});
  }, [navigation, name]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the chat with {name}.</Text>
      <Button
        title="View Media"
        onPress={() => navigation.navigate('MediaView', { mediaUri: mediaUri })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default ChatScreen;