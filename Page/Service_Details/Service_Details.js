import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    ToastAndroid,
    Platform,
    Alert,
    StatusBar,
    Animated
} from 'react-native';
import Layout from '../../components/Layout/_layout';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { fetchAllServiceData, ServiceByName } from '../../utils/api/Api';
import RCard from './RCard';
import Promise from './Promise';
import Button from '../../components/common/Button';
import { useSkip } from '../../context/SkipContext';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');

export default function Service_Details() {
    const route = useRoute();
    const { id } = route.params || {};
    const navigation = useNavigation();
    const { skipLogin } = useSkip();

    // State management
    const [data, setData] = useState({});
    const [relatedData, setRelatedData] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isRelatedLoading, setIsRelatedLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    // Toast helper function
    const showToast = (message, type = 'default') => {
        if (Platform.OS === 'android') {
            const duration = type === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
            ToastAndroid.show(message, duration);
        } else {
            return
        }
    };

    // Fetch main service data
    const fetchData = async (showLoadingState = true) => {
        if (!id) {
            const errorMsg = 'Invalid Service ID provided';
            setError(errorMsg);
            showToast(errorMsg, 'long');
            setIsLoading(false);
            return;
        }

        try {
            if (showLoadingState) {
                setIsLoading(true);
            }
            setError(null);

            const response = await ServiceByName(id);

            if (!response) {
                throw new Error('No service data received');
            }

            setData(response);
            showToast('Service details loaded successfully');

            // Animate content in
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                })
            ]).start();

        } catch (error) {
            console.error('Error fetching service data:', error);
            const errorMsg = error.message || 'Failed to load service details';
            setError(errorMsg);
            showToast(errorMsg, 'long');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch related services
    const fetchRelatedData = async (showLoadingState = true) => {
        if (!id) return;

        try {
            if (showLoadingState) {
                setIsRelatedLoading(true);
            }

            const response = await fetchAllServiceData(id);
            setRelatedData(response || []);

            if (response && response.length > 0) {
                showToast(`Found ${response.length} related services`);
            }

        } catch (error) {
            console.error('Error fetching related data:', error);
            const errorMsg = 'Failed to load related services';
            showToast(errorMsg);
            setRelatedData([]);
        } finally {
            setIsRelatedLoading(false);
        }
    };

    // Handle service selection
    const toggleSelection = useCallback((name, serviceId) => {
        const isCurrentlySelected = selectedService === name;

        setSelectedService(isCurrentlySelected ? null : name);
        setSelectedServiceId(isCurrentlySelected ? null : serviceId);

        const message = isCurrentlySelected
            ? 'Service deselected'
            : `${name} selected`;
        showToast(message);
    }, [selectedService]);

    // Handle refresh
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await Promise.all([
            fetchData(false),
            fetchRelatedData(false)
        ]);
        setIsRefreshing(false);
        showToast('Content refreshed');
    }, [id]);

    // Handle booking navigation
    const handleBookNow = useCallback(() => {
        if (!selectedService || !selectedServiceId) {
            showToast('Please select a service first');
            return;
        }

        if (skipLogin) {
            navigation.navigate('login');
            showToast('Please login to continue booking');
        } else {
            navigation.navigate('Booking', {
                serviceType: selectedService,
                serviceId: data?._id,
                selectedServiceId: selectedServiceId,
            });
            showToast('Proceeding to booking...');
        }
    }, [selectedService, selectedServiceId, skipLogin, navigation, data]);

    // Handle image error
    const handleImageError = useCallback(() => {
        setImageError(true);
        showToast('Failed to load service image');
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchData();
        fetchRelatedData();
    }, [id]);

    // Reset animation when screen focuses
    useFocusEffect(
        useCallback(() => {
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
        }, [])
    );

    // Loading state
    if (isLoading) {
        return (
            <Layout isHeaderWithBackShown={true} title={id} isHeaderShown={false}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading service details...</Text>
                </View>
            </Layout>
        );
    }

    // Error state
    if (error && !data?.metaTitle) {
        return (
            <Layout isHeaderWithBackShown={true} title={id} isHeaderShown={false}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => fetchData()}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </Layout>
        );
    }

    return (
        <Layout isHeaderWithBackShown={true} title={id} isHeaderShown={false}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
            >
                {/* Enhanced Banner Section */}
                <Animated.View
                    style={[
                        styles.bannerContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Image
                        source={{
                            uri: !imageError && data?.sliderImage?.[0]?.url
                                ? data.sliderImage[0].url
                                : 'https://placehold.co/600x400/e0e0e0/666666?text=Service+Image'
                        }}
                        style={styles.bannerImage}
                        resizeMode="fill"
                        onError={handleImageError}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.bannerGradient}
                    >
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle} numberOfLines={2}>
                                {data?.metaTitle || 'Service Details'}
                            </Text>
                            {data?.shortDescription && (
                                <Text style={styles.bannerSubtitle} numberOfLines={2}>
                                    {data.shortDescription}
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Promise/Info Section */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Promise />
                </Animated.View>

                {/* Related Services Section */}
                <Animated.View
                    style={[
                        styles.relatedSection,
                        { opacity: fadeAnim }
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {id} Related Services
                        </Text>
                        {isRelatedLoading && (
                            <ActivityIndicator size="small" color="#007AFF" />
                        )}
                    </View>

                    <View style={styles.cardsContainer}>
                        {isRelatedLoading ? (
                            <View style={styles.relatedLoadingContainer}>
                                <ActivityIndicator size="large" color="#007AFF" />
                                <Text style={styles.loadingText}>Loading related services...</Text>
                            </View>
                        ) : relatedData && relatedData.length > 0 ? (
                            relatedData.map((item, index) => (
                                <View key={item._id || index} style={styles.cardWrapper}>
                                    <RCard
                                        data={{
                                            ...item,
                                            isSelected: item.name === selectedService,
                                            duration: item.duration || '1 hour',
                                            location: item.location || 'Main Branch'
                                        }}
                                        onPress={() => toggleSelection(item.name, item._id)}
                                    />
                                </View>
                            ))
                        ) : (
                            <View style={styles.noDataContainer}>
                                <Text style={styles.noDataIcon}>🔍</Text>
                                <Text style={styles.noDataTitle}>No Related Services</Text>
                                <Text style={styles.noDataText}>
                                    We couldn't find any related services at the moment.
                                </Text>
                                <TouchableOpacity
                                    style={styles.refreshButton}
                                    onPress={() => fetchRelatedData()}
                                >
                                    <Text style={styles.refreshButtonText}>Refresh</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Animated.View>

                {/* Bottom spacing for floating button */}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Floating Action Button */}
            {selectedService && (
                <Animated.View
                    style={[
                        styles.floatingButtonContainer,
                        { opacity: fadeAnim }
                    ]}
                >
                    <Button
                        onPress={handleBookNow}
                        variant='secondary'
                        style={styles.bookButton}
                    >
                        {skipLogin ? 'Login to Book Service' : `Book ${selectedService}`}
                    </Button>
                </Animated.View>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#f8f9fa',
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bannerContainer: {
        width: '100%',
        height: 180,
        position: 'relative',
        marginBottom: 16,
    },
    bannerImage: {
        width: '100%',
        objectFit: 'fill',
        height: '100%',
    },
    bannerGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        justifyContent: 'flex-end',
    },
    bannerContent: {
        padding: 20,
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 30,
        textShadowColor: 'rgba(0,0,0,0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    bannerSubtitle: {
        color: '#f0f0f0',
        fontSize: 16,
        marginTop: 8,
        lineHeight: 22,
        textShadowColor: 'rgba(0,0,0,0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    relatedSection: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    cardWrapper: {
        width: (width - 44) / 2, // Account for padding and gap
        marginBottom: 12,
    },
    relatedLoadingContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },
    noDataContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    noDataIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    noDataTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    noDataText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    refreshButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 100, // Space for floating button
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    bookButton: {
        borderRadius: 8,
    },
});