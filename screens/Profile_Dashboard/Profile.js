import { View, Text, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/_layout';
import { CheckToken, getMyAllOrder } from '../../utils/api/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../colors/Colors';
import { useNavigation } from '@react-navigation/native';
import Password_Change from './Password_Change/Password_Change';
import { clearStroge } from '../../Service/SecureStore';
import UpdateProfile from './Updates/UpdateProfile';
import { useSkip } from '../../context/SkipContext';

const ProfileSection = ({ user }) => (
    <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
                <Icon name="account" size={40} color={colors.white} />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.FullName}</Text>
                <Text style={styles.userType}>{user.UserType} Account</Text>
            </View>
        </View>
    </View>
);

const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
        <Icon name={icon} size={20} color={colors.secondary} style={styles.infoIcon} />
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const ActionButton = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <View style={styles.actionContent}>
            <Icon name={icon} size={20} color={colors.secondary} />
            <Text style={styles.actionLabel}>{label}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.placeholder} />
    </TouchableOpacity>
);

export default function Profile() {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUdate] = useState(false);
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const { clearSkipLogin } = useSkip()

    const [orderData, setOrderData] = useState({
        allOrder: [],
        activeOrder: [],
        completeOrder: [],
        canceledOrder: [],
    });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchOrderData().finally(() => setRefreshing(false));
    }, [user]);

    const fetchUserData = async () => {
        try {
            const data = await CheckToken();
            if (data.success === true) {
                setUser(data.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchOrderData = async () => {
        try {
            const data = await getMyAllOrder({ userId: user?._id });
            if (data) {
                setOrderData({
                    allOrder: data.allOrder || [],
                    activeOrder: data.activeOrder || [],
                    completeOrder: data.completeOrder || [],
                    canceledOrder: data.canceledOrder || [],
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user?._id) {
            fetchOrderData();
        }
    }, [user]);

    const handleLogout = () => {
        clearStroge();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Onboard' }],
        });
        console.log('Logout pressed');
    };


    const handleDelete = async () => {
        console.log(user?._id, 'user id');
        if (!user?._id) {
            handleLogout();
            await clearSkipLogin()

            Alert.alert('Error', 'User ID is not available. Please try again later.');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Onboard' }],
            });
            return;
        }
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`https://www.api.blueaceindia.com/api/v1/delete-my-account/${user?._id}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'

                                },
                            });
                            const data = await response.json();
                            if (data.success) {
                                Alert.alert('Success', 'Your account has been deleted successfully.');
                                handleLogout();
                                await clearSkipLogin()
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Onboard' }],
                                });
                            } else {
                                Alert.alert('Error', data.message || 'Failed to delete account.');
                            }

                        } catch (error) {
                            console.error('Error deleting account:', error);

                        }
                    },
                },
            ]
        )
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Layout isHeaderShown={false}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                style={styles.container}
            >
                <ProfileSection user={user} />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <InfoItem icon="email" label="Email" value={user.Email} />
                    <InfoItem icon="phone" label="Phone" value={user.ContactNumber} />
                    <InfoItem icon="map-marker" label="Address" value={user.address} />
                    <InfoItem icon="home" label="House No." value={user.HouseNo} />
                    <InfoItem icon="office-building" label="Landmark" value={user.NearByLandMark} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Actions</Text>
                    <ActionButton icon="package-variant" label="My Orders" onPress={() => navigation.navigate('order', { id: user?._id })} />
                    <ActionButton icon="lock" label="Change Password" onPress={() => setOpen(true)} />
                    <ActionButton icon="account-edit" label="Update Profile" onPress={() => setOpenUdate(true)} />
                    <ActionButton icon="delete" label="Delete Account" onPress={() => handleDelete()} />
                    <ActionButton icon="logout" label="Logout" onPress={handleLogout} />
                </View>
            </ScrollView>
            {open && <Password_Change userId={user?._id} isShow={open} OnClose={handleClose} />}
            {openUpdate && <UpdateProfile isOpen={openUpdate} onClose={() => setOpenUdate(false)} />}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    profileCard: {
        backgroundColor: colors.white,
        padding: 20,
        marginBottom: 15,
        borderRadius: 15,
        marginHorizontal: 15,
        marginTop: 15,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: 15,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    userType: {
        fontSize: colors.fontSize,
        color: colors.secondary,
        marginTop: 4,
    },
    section: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: colors.bigFont,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoIcon: {
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: colors.fontSize,
        color: colors.placeholder,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: colors.fontSize,
        color: colors.text,
        fontWeight: '500',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionLabel: {
        marginLeft: 12,
        fontSize: colors.fontSize,
        color: colors.text,
        fontWeight: '500',
    },
});