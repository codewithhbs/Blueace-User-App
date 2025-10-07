import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { colors } from '../../../colors/Colors';
import { useNavigation } from '@react-navigation/native';
import { useSkip } from '../../../context/SkipContext';

const HeaderWithBack = ({ title }) => {
    const navigation = useNavigation();
    const { skipLogin } = useSkip()

    return (
        <View style={styles.header}>
            {/* Back Button with Icon and Title */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                {/* <ChevronLeft size={24} color={colors.text} /> */}
                <Icon name="chevron-left" size={24} color={colors.text} />
                <Text style={styles.title}>{title || 'Header'}</Text>
            </TouchableOpacity>

            {/* User Icon */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 10,
        backgroundColor: colors.background,
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderBottomColor: colors.shadow,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 8, // Space between the icon and text
    },
});

export default HeaderWithBack;
