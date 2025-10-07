import { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import * as Updates from 'expo-updates';

const { width } = Dimensions.get('window');

export default function CheckAppUpdate({ children }) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        checkForOTAUpdates();
    }, []);

    const checkForOTAUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                setShowUpdateModal(true);
            }
        } catch (err) {
            console.log("Update check failed:", err);
        }
    };

    const handleUpdateNow = async () => {
        setIsUpdating(true);
        try {
            await Updates.fetchUpdateAsync();

            Alert.alert(
                "✅ Update Installed",
                "Blueace India app restart ho raha hai enhanced features ke saath...",
                [
                    {
                        text: "Restart Now",
                        onPress: async () => {
                            await Updates.reloadAsync();
                        }
                    }
                ]
            );
        } catch (error) {
            setIsUpdating(false);
            Alert.alert("Update Failed", "Kuch technical issue hai. Please try again.");
        }
    };

    const handleUpdateLater = () => {
        setShowUpdateModal(false);
    };

    return (
        <View style={styles.container}>
            {children}

            <Modal
                visible={showUpdateModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowUpdateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Update Icon/Image */}
                        <View style={styles.imageContainer}>
                            <View style={styles.updateIcon}>
                                <Text style={styles.iconText}>❄️</Text>
                            </View>
                        </View>

                        {/* Blueace India branding and messaging */}
                        <Text style={styles.title}>Cool Updates Available!</Text>

                        <Text style={styles.brandText}>Blueace India</Text>
                        <Text style={styles.tagline}>Leading AC Service Provider</Text>

                        <Text style={styles.subtitle}>
                            Enhanced AC service features ready for you
                        </Text>

                        <View style={styles.featuresContainer}>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>🔧</Text>
                                <Text style={styles.featureText}>Advanced service tracking</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>📱</Text>
                                <Text style={styles.featureText}>Instant booking & scheduling</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>💨</Text>
                                <Text style={styles.featureText}>Smart AC maintenance alerts</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>💰</Text>
                            <Text style={styles.featureText}>Transparent pricing & offers</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        Get the best AC service experience with improved features.
                        Keep your space cool and comfortable with Blueace India!
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleUpdateNow}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator color="#fff" size="small" />
                                    <Text style={styles.updateButtonText}>Updating...</Text>
                                </View>
                            ) : (
                                <Text style={styles.updateButtonText}>Update Now ❄️</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.laterButton}
                            onPress={handleUpdateLater}
                            disabled={isUpdating}
                        >
                            <Text style={styles.laterButtonText}>Maybe Later</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Service motivation */}
                    <Text style={styles.motivationText}>
                        "Stay Cool with India's Best AC Service! 🌟"
                    </Text>
                </View>
        </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        width: width * 0.9,
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    imageContainer: {
        marginBottom: 20,
    },
    updateIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1E88E5', // Cool blue color for AC service
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1E88E5',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 8,
        textAlign: 'center',
    },
    brandText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E88E5',
        textAlign: 'center',
        marginBottom: 4,
    },
    tagline: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    featureIcon: {
        fontSize: 20,
        marginRight: 12,
        width: 30,
    },
    featureText: {
        fontSize: 14,
        color: '#444',
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 25,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 15,
    },
    updateButton: {
        backgroundColor: '#1E88E5',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#1E88E5',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    laterButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    laterButtonText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    motivationText: {
        fontSize: 12,
        color: '#1E88E5',
        fontStyle: 'italic',
        textAlign: 'center',
        fontWeight: '600',
    },
});