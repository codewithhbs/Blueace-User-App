import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { colors } from '../../../colors/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSkip } from '../../../context/SkipContext';

const BottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { skipLogin } = useSkip();

    const tabs = [
        { name: 'Home', icon: 'home', route: 'home' },
        // { name: skipLogin ? 'Login' : 'Profile', icon: 'account', route: skipLogin ? 'login' : 'Profile' },
        { name: 'Products', icon: 'briefcase', route: 'Products' },
        { name: 'Services', icon: 'briefcase', route: 'Services' },
        { name: 'Careers', icon: 'account-wrench-outline', route: 'Careers' },
        { name: 'Get A Call', icon: 'phone', route: 'get-a-call' },
    ];

    return (
        <View style={styles.bottomNav}>
            {tabs.map((tab, index) => {
                const isActive = route.name.toLowerCase() === tab.route.toLowerCase();

                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.tabItem}
                        onPress={() => navigation.navigate(tab.route)}
                    >
                        <Icon
                            name={tab.icon}
                            size={24}
                            color={isActive ? colors.primary : colors.dark}
                        />
                        <Text style={isActive ? styles.activeTabText : styles.tabText}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>

    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 12,
        color: '#111',
    },
    activeTabText: {
        fontSize: 12,
        color: '#6366F1',
        fontWeight: 'bold',
    },
});

export default BottomNav;
