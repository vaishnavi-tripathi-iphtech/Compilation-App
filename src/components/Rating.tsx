import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
  rating: number;
  onRate: (rate: number) => void;
  maxRating?: number;
}

const StarRating = ({ rating, onRate, maxRating = 5 }: StarRatingProps) => {
  return (
    <View style={styles.container}>
      {[...Array(maxRating)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity key={starNumber} onPress={() => onRate(starNumber)}>
            <Text style={[styles.star, rating >= starNumber ? styles.filled : styles.empty]}>★</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row' 
},
  star: { 
    fontSize: 30, 
    marginHorizontal: 5 
},
  filled: { 
    color: '#ff8c00' 
}, // Gold
  empty: { 
    color: '#ccc' 
},
});

export default StarRating;