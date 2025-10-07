import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Promise() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Icon name="check-decagram" size={24} color="#0066cc" />
        </View>
        <Text style={styles.title}>Blueace India Promise</Text>
      </View>

      <View style={styles.promiseList}>
        <View style={styles.promiseItem}>
          <Icon name="check-decagram" size={18} color="#555" />
          <Text style={styles.promiseText}>Verified Professionals</Text>
        </View>
        
        <View style={styles.promiseItem}>
          <Icon name="calendar" size={18} color="#555" />
          <Text style={styles.promiseText}>Hassle Free Booking</Text>
        </View>
        
        <View style={styles.promiseItem}>
          <Icon name="currency-usd" size={18} color="#555" />
          <Text style={styles.promiseText}>Transparent Pricing</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#e6f0ff',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  promiseList: {
    gap: 12,
    marginLeft: 12,
  },
  promiseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promiseText: {
    fontSize: 14,
    color: '#555',
  },
});
