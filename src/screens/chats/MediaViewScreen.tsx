import React, { useState } from 'react'; // 1. Import useState
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator, 
  Text,
} from 'react-native';
import { MediaViewScreenProps } from '../../navigation/types';

const MediaViewScreen = ({ route }: MediaViewScreenProps) => {
  const { mediaUri } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      {mediaUri ? (
        <>
          <Image
            source={{ uri: mediaUri }}
            style={styles.image}
            resizeMode="contain"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
          {isLoading && (
            <ActivityIndicator
             
              size="large"
              color="#ffffff"
            />
          )}
        </>
      ) : (
        <Text style={styles.text}>No media found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default MediaViewScreen;