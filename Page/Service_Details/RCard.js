import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

export default function RCard({ data, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.cardContainer, data.isSelected && styles.selectedCard]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: data?.serviceImage?.url || 'https://placehold.co/600x400?text=No+Image' }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
                {data.isSelected && (
                    <View style={styles.selectedBadge}>
                        <Icon name="tag" size={16} color="#fff" />
                        <Text style={styles.selectedText}>Selected</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{data.name}</Text>

                {data.duration && (
                    <View style={styles.infoRow}>
                        <Icon name="clock-time-four-outline" size={14} color="#666" />
                        <Text style={styles.infoText}> Verified Professionals</Text>
                    </View>
                )}

                {data.location && (
                    <View style={styles.infoRow}>
                        <Icon name="map-marker" size={14} color="#666" />
                        <Text style={styles.infoText} numberOfLines={1}>{data.location}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    imageContainer: {
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 140,
    },
    selectedBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    selectedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        flex: 1,
    },
});
