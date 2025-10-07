import { View, Text, ScrollView, ActivityIndicator, Image, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import Otp from './Otp';

const { width } = Dimensions.get('window');

export default function PasswordChange() {
    const [formData, setFormData] = useState({
        Email: "",
        NewPassword: ""
    });
    const [otpVisible, setOtpVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const { Email, NewPassword } = formData;

        if (!Email || !NewPassword) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        if (NewPassword.length <= 6) {
            Alert.alert("Weak Password", "Your new password must be longer than 6 characters.");
            return;
        }
        setLoading(true)

        try {
            const response = await axios.post('https://www.api.blueaceindia.com/api/v1/Password-Change', formData);
            Alert.alert("Success", response.data.message);
            // setFormData({ Email: "", NewPassword: "" });
            setLoading(false)
            setOtpVisible(true)
        } catch (error) {
            setLoading(false)
            setOtpVisible(false)
            Alert.alert("Error", error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <LinearGradient
            colors={['#f0f8ff', '#fff', '#f0f8ff']}
            style={styles.gradient}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&auto=format&fit=crop&q=60' }}
                            style={styles.image}
                        />
                    </View>

                    <Text style={styles.heading}>Forget Password</Text>
                    <Text style={styles.subheading}>Enter your details below</Text>

                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email-outline" size={24} color="#64748b" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Email"
                            placeholderTextColor="#64748b"
                            keyboardType="email-address"
                            value={formData.Email}
                            onChangeText={(text) => handleInputChange('Email', text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-outline" size={24} color="#64748b" style={styles.icon} />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Enter New Password"
                            placeholderTextColor="#64748b"
                            secureTextEntry={!showPassword}
                            value={formData.NewPassword}
                            onChangeText={(text) => handleInputChange('NewPassword', text)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <MaterialCommunityIcons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color="#64748b"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                    >
                        <LinearGradient
                            colors={['#1d4ed8', '#2563eb']}
                            style={styles.buttonGradient}
                        >
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator color="#fff" style={styles.activityIndicator} />

                                </View>
                            ) : (
                                <Text style={styles.buttonText}>Change Password</Text>
                            )}
                        </LinearGradient>

                    </TouchableOpacity>
                </View>
                {otpVisible && <Otp isOpen={otpVisible} onClose={() => setOtpVisible(false)} email={formData.Email} newPassword={formData.NewPassword} />}

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        width: width > 400 ? 400 : width - 40,

        borderRadius: 20,
        padding: 24,

    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#2563eb',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e3a8a',
        textAlign: 'center',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#1e293b',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    button: {
        marginTop: 8,
        overflow: 'hidden',
        borderRadius: 12,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});