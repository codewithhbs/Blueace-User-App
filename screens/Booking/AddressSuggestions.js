import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddressSuggestions({ suggestions, onSelectAddress }) {
  if (!suggestions?.length) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => onSelectAddress(suggestion.description)}
          >
            {/* <MapPin size={16} color="#666" /> */}
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.suggestionText} numberOfLines={2}>
              {suggestion.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
  
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,

  },
  scrollView: {
    maxHeight: 200,
  },
  scrollContent: {
    flexGrow: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});