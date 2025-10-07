import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'
export default function Otp({ isOpen, onClose, email, newPassword }) {

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isResendActive, setIsResendActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigation = useNavigation()
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0 && !isResendActive) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsResendActive(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setError('');

            // Auto-focus next input
            if (value !== '' && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (index, key) => {
        if (key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('https://www.api.blueaceindia.com/api/v1/Verify-Otp', {
                Email: email, PasswordChangeOtp: otpString, NewPassword: newPassword,
            });
            console.log(response.data)

            alert("Password changed successfully ! Now Login")
            setTimeout(() => {
                navigation.navigate('login')
            })
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError('');

        try {
            await axios.post('https://www.api.blueaceindia.com/api/v1/resend-otp', {
                Email: email
            });

            setTimer(60);
            setIsResendActive(false);
            Alert.alert("Success", "OTP has been resent to your email");
        } catch (error) {
            console.log(error.response?.data?.message)
            setError(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <LinearGradient
                        colors={['#2563eb', '#2563eb']}
                        style={styles.header}
                    >
                        <Text style={styles.headerText}>Verify OTP</Text>
                        {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity> */}
                    </LinearGradient>

                    <View style={styles.content}>
                        <Text style={styles.description}>
                            Enter the 6-digit code sent to your email
                        </Text>

                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={ref => inputRefs.current[index] = ref}
                                    style={styles.otpInput}
                                    value={digit}
                                    onChangeText={(value) => handleChange(index, value)}
                                    onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={loading ? ['#94a3b8', '#cbd5e1'] : ['#1d4ed8', '#2563eb']}
                                style={styles.submitButtonGradient}
                            >
                                <Text style={styles.submitButtonText}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>
                                Didn't receive the code?
                            </Text>
                            {isResendActive ? (
                                <TouchableOpacity
                                    onPress={handleResendOtp}
                                    disabled={loading}
                                >
                                    <Text style={styles.resendButton}>Resend OTP</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.timerText}>
                                    Resend in {timer}s
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 24,
    },
    description: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpInput: {
        width: 45,
        height: 45,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        fontSize: 20,
        marginHorizontal: 1,
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        color: '#1e293b',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    submitButton: {
        overflow: 'hidden',
        borderRadius: 12,
        marginBottom: 16,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendContainer: {
        alignItems: 'center',
    },
    resendText: {
        color: '#64748b',
        marginBottom: 8,
    },
    resendButton: {
        color: '#2563eb',
        fontWeight: '600',
    },
    timerText: {
        color: '#94a3b8',
        fontWeight: '600',
    },
});