import { View, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function BannerService({ image, isShow = true }) {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: image }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 135,
        backgroundColor: '#f0f0f0',
        alignItems: 'start',
        justifyContent: 'start',
        marginBottom: 20,

    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'top',
        overflow: 'hidden',
        resizeMode: 'contain',
    }
})
