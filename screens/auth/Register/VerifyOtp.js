import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './UserVerifyOtp.styles';
import { save } from '../../../Service/SecureStore';
import { useSkip } from '../../../context/SkipContext';


const UserVerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [userId, setUserId] = useState('');
    const { clearSkipLogin } = useSkip()
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        // Get user ID from route params
        if (route.params?.id) {
            setUserId(route.params.id);
        }

        // Initialize timer for resend button
        setTimer(60);
    }, [route.params]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value) => {
        // Only allow numbers and limit to 6 digits
        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value);
        }
    };

    const showAlert = (title, message) => {
        Alert.alert(title, message);
    };

    const handleSubmit = async () => {
        if (otp.length !== 6) {
            showAlert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `https://www.api.blueaceindia.com/api/v1/verify_user_otp/${userId}`,
                {
                    loginOtp: otp,
                }
            );
            console.log('OTP verification response:', res.data);
            // Store token and user data in AsyncStorage
            await save('token', res.data.token);
            //   await save('user', JSON.stringify(res.data.user));

            if (res.data.success) {
                setOtp('');
                showAlert('Success', 'Verification successful!');
                await clearSkipLogin()
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'home' }],
                });
            }
        } catch (error) {
            console.log('Error verifying OTP:', error);
            showAlert(
                'Error',
                error.response?.data?.message || 'Failed to verify OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;

        setResendLoading(true);
        try {
            const res = await axios.post(
                `https://www.api.blueaceindia.com/api/v1/resend_verify_user_otp/${userId}`
            );

            if (res.data.success) {
                showAlert('Success', 'OTP resent successfully!');
                setTimer(60); // Reset timer to 60 seconds
            }
        } catch (error) {
            console.log('Error resending OTP:', error);
            showAlert(
                'Error',
                error.response?.data?.message || 'Failed to resend OTP'
            );
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Verify Your Account</Text>
                    </View>

                    {/* Body */}
                    <View style={styles.body}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark" size={80} color="#007bff" />
                        </View>

                        <Text style={styles.instructionText}>
                            Enter the 6-digit code sent to your phone
                        </Text>
                        <Text style={styles.validityText}>
                            The code is valid for 10 minutes
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Verification Code</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChangeText={handleChange}
                                keyboardType="numeric"
                                maxLength={6}
                                textAlign="center"
                                fontSize={20}
                                letterSpacing={5}
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.verifyButton,
                                (loading || otp.length !== 6) && styles.disabledButton,
                            ]}
                            onPress={handleSubmit}
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#ffffff" />
                                    <Text style={styles.buttonText}>Verifying...</Text>
                                </View>
                            ) : (
                                <Text style={styles.buttonText}>Verify OTP</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Didn't receive the code?</Text>
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleResendOtp}
                            disabled={timer > 0 || resendLoading}
                        >
                            {resendLoading ? (
                                <View style={styles.resendLoadingContainer}>
                                    <ActivityIndicator size="small" color="#007bff" />
                                    <Text style={styles.resendButtonText}>Resending...</Text>
                                </View>
                            ) : timer > 0 ? (
                                <Text style={styles.resendButtonText}>Resend in {timer}s</Text>
                            ) : (
                                <Text style={[styles.resendButtonText, styles.activeResendText]}>
                                    Resend OTP
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default UserVerifyOtp;