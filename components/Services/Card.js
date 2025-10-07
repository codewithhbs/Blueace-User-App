import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../colors/Colors';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('screen');

export default function Card({ data }) {
    const navigation = useNavigation()
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('service_details', { id: data?.name })} style={styles.card}>
            <Image source={{ uri: data?.icon?.url }} style={styles.image} />
            <Text style={styles.name}>{data.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: width / 4,
        backgroundColor: colors.white,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1.5,
        alignItems: 'center',
        padding: 10,
    },
    image: {
        width: '100%',
        height: 30,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    name: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.text,
    },
});
