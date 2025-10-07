import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { colors } from '../../../colors/Colors';
import { useNavigation } from '@react-navigation/native';
import { useSkip } from '../../../context/SkipContext';

const Header = () => {
    const navigation = useNavigation()
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const { skipLogin } = useSkip()
    console.log("skipLogin",skipLogin)

    return (
        <View style={styles.header}>
            {/* 
            <TouchableOpacity onPress={() => setSidebarVisible(true)}>
                <Menu size={24} color={colors.text} />
            </TouchableOpacity> */}
            <Image source={require('./logo_b.jpg')} style={styles.image} />

            {skipLogin ? (
                <TouchableOpacity onPress={() => navigation.navigate('login')}>
                    <Icon name="login" size={24} color={colors.text} />
                    {/* <User size={24} color={colors.text} /> */}
                </TouchableOpacity>
            ) : (

                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Icon name="account" size={24} color={colors.text} />
                    {/* <User size={24} color={colors.text} /> */}
                </TouchableOpacity>
            )}


            <Modal animationType="none" visible={sidebarVisible} transparent>
                <View style={styles.sidebarOverlay}>
                    <View style={styles.sidebar}>
                        <TouchableOpacity onPress={() => setSidebarVisible(false)} style={styles.closeButton}>

                            {/* <MaterialCommunityIcons name="close" size={24} color="#fff" /> */}
                            <Icon name="close" size={24} color={colors.text} />

                        </TouchableOpacity>
                        <Text style={styles.sidebarItem}>Home</Text>
                        <Text style={styles.sidebarItem}>Profile</Text>
                        <Text style={styles.sidebarItem}>Services</Text>
                        <Text style={styles.sidebarItem}>Offers</Text>
                        <Text style={styles.sidebarItem}>Shop</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.background,
        elevation: 1,
        shadowColor: colors.shadow,
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        borderRadius: 2,
        width: 100,
        height: 50,
        resizeMode: 'contain',

    },
    sidebarOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'flex-start',
    },
    sidebar: {
        backgroundColor: '#fff',
        width: '70%',
        height: '100%',
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    sidebarItem: {
        fontSize: 18,
        color: colors.text,
        marginVertical: 15,
    },
});

export default Header;
