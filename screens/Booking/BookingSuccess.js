import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BookingSuccess() {
    const route = useRoute();
    const navigation = useNavigation();
    const { data } = route.params || {};

    // Animation values
    const scaleValue = new Animated.Value(0);
    const fadeValue = new Animated.Value(0);
    const slideValue = new Animated.Value(100);

    useEffect(() => {
        // Sequence of animations
        Animated.sequence([
            // Icon scale animation
            Animated.spring(scaleValue, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            // Content fade and slide animation
            Animated.parallel([
                Animated.timing(fadeValue, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(slideValue, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    if (!data) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No order information available</Text>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('home')}
                >
                    {/* <Home size={24} color="#fff" /> */}
                    <Icon name="home" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Go to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Success Icon */}
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}>

                <Icon name="check-circle" size={80} color="#22C55E" />
            </Animated.View>

            {/* Success Message */}
            <Animated.View style={[styles.messageContainer, { opacity: fadeValue }]}>
                <Text style={styles.title}>Booking Successful!</Text>
                <Text style={styles.subtitle}>Your service has been booked successfully</Text>
            </Animated.View>

            {/* Order Details */}
            <Animated.View
                style={[
                    styles.detailsContainer,
                    {
                        opacity: fadeValue,
                        transform: [{ translateY: slideValue }]
                    }
                ]}
            >
                <View style={styles.detailRow}>

                    <Icon name="file-document" size={20} color="#6B7280" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Service Type</Text>
                        <Text style={styles.detailValue}>{data.serviceType}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>

                    <Icon name="map-marker" size={20} color="#6B7280" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Location</Text>
                        <Text style={styles.detailValue}>{data.nearByLandMark}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>

                    <Icon name="phone" size={20} color="#6B7280" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Contact</Text>
                        <Text style={styles.detailValue}>{data.phoneNumber}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>

                    <Icon name="email" size={20} color="#6B7280" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Email</Text>
                        <Text style={styles.detailValue}>{data.email}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>

                    <Icon name="calendar" size={20} color="#6B7280" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Booking Date</Text>
                        <Text style={styles.detailValue}>
                            {new Date(data.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>
            </Animated.View>

            {/* Action Button */}
            <Animated.View style={[styles.buttonContainer, { opacity: fadeValue }]}>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'home',
                                }
                            ],
                        })
                    )}
                >
                    <Icon name="home" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#22C55E',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },
    buttonContainer: {
        width: '100%',
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6B46C1',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        marginBottom: 24,
    },
});