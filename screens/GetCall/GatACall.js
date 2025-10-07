import { View, Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
export default function GatACall() {
    const navigation = useNavigation()
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('get-a-call')} style={styles.container}>
            <Image source={require('./sc.png')} style={styles.image} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    image: {
        width: width,
        height: height,
        resizeMode: 'contain',
    },

});
