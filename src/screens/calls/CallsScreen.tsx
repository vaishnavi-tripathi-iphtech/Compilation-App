import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CallsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calls Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22 },
  subtext: { fontSize: 14, color: 'gray', marginTop: 10 },
});

export default CallsScreen;