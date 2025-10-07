import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, ActivityIndicator, TextInput, Alert, Platform,
    ToastAndroid, KeyboardAvoidingView, Keyboard, Animated,
    StatusBar,
    Linking
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { save } from '../../../Service/SecureStore';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


export default function RegisterUser() {
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        ContactNumber: '',
        Password: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const navigation = useNavigation();

    // Refs for input focus management
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    // Toast helper function
    const showToast = (message, type = 'default') => {
        if (Platform.OS === 'android') {
            const duration = type === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
            ToastAndroid.show(message, duration);
        } else {
            Alert.alert('Info', message);
        }
    };

    // Keyboard listeners
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        // Initial animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();

        return () => {
            keyboardDidHideListener?.remove();
            keyboardDidShowListener?.remove();
        };
    }, []);

    // Real-time field validation
    const validateField = (field, value) => {
        let error = '';

        switch (field) {
            case 'FullName':
                if (!value.trim()) {
                    error = 'Full name is required';
                } else if (value.trim().length < 2) {
                    error = 'Name must be at least 2 characters';
                } else if (value.trim().length > 50) {
                    error = 'Name must not exceed 50 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'Name can only contain letters and spaces';
                }
                break;

            case 'Email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                } else if (value.length > 100) {
                    error = 'Email must not exceed 100 characters';
                }
                break;

            case 'ContactNumber':
                const phoneRegex = /^\d{10}$/;
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else if (!phoneRegex.test(value)) {
                    error = 'Please enter a valid 10-digit phone number';
                }
                break;

            case 'Password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 8) {
                    error = 'Password must be at least 8 characters';
                } else if (value.length > 50) {
                    error = 'Password must not exceed 50 characters';
                } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
                    error = 'Password must contain at least one letter and one number';
                }
                break;
        }

        return error;
    };

    // Handle input change with real-time validation
    const handleChange = (field, value) => {
        // Update form data
        setFormData(prev => ({ ...prev, [field]: value }));

        // Real-time validation if field has been touched
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));

            // Show success toast for valid input
            if (!error && errors[field]) {
                showToast(`${field.replace(/([A-Z])/g, ' $1').trim()} looks good! ✓`);
            }
        }
    };

    // Handle field blur (when user leaves input)
    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, formData[field]);
        setErrors(prev => ({ ...prev, [field]: error }));

        if (error) {
            showToast(error, 'long');
        }
    };

    // Focus next input
    const focusNextInput = (currentField) => {
        const fieldOrder = ['FullName', 'Email', 'ContactNumber', 'Password'];
        const currentIndex = fieldOrder.indexOf(currentField);
        const nextField = fieldOrder[currentIndex + 1];

        if (nextField) {
            const refMap = {
                FullName: nameRef,
                Email: emailRef,
                ContactNumber: phoneRef,
                Password: passwordRef
            };
            refMap[nextField].current?.focus();
        } else {
            Keyboard.dismiss();
        }
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched({
            FullName: true,
            Email: true,
            ContactNumber: true,
            Password: true
        });

        return isValid;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            showToast('Please fix the errors before submitting', 'long');
            return;
        }

        setLoading(true);
        showToast('Creating your account...');

        try {
            const response = await axios.post(
                'https://www.api.blueaceindia.com/api/v1/Create-User',
                formData,
                {
                    timeout: 15000,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const { success, message, data } = response.data;

            if (success && data?._id) {
                showToast('Registration successful! Welcome aboard! 🎉', 'long');

                setTimeout(() => {
                    Alert.alert(
                        "🎉 Welcome to Blueace!",
                        "Your account has been created successfully. Please verify the OTP sent to WhatsApp!",
                        [{ text: "Verify Now", onPress: () => navigation.navigate("otp", { id: data._id }) }]
                    );
                }, 500);
            } else {
                throw new Error(message || 'Registration failed');
            }


        } catch (error) {
            console.error('Registration error:', error);

            let errorMessage = 'Something went wrong. Please try again.';

            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.message ||
                    `Server error: ${error.response.status}`;
            } else if (error.request) {
                // Network error
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'ECONNABORTED') {
                // Timeout error
                errorMessage = 'Request timeout. Please try again.';
            }

            showToast(errorMessage, 'long');

            Alert.alert(
                "Registration Failed",
                errorMessage,
                [{ text: "Try Again" }]
            );
        } finally {
            setLoading(false);
        }
    };

    // Get input style based on validation state
    const getInputStyle = (field) => {
        const hasError = errors[field] && touched[field];
        const isValid = !errors[field] && touched[field] && formData[field];

        return [
            styles.input,
            hasError && styles.inputError,
            isValid && styles.inputValid
        ];
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0066cc" />

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
            >
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ]
                            }
                        ]}
                    >
                        <LinearGradient
                            colors={['#0066cc', '#004499']}
                            style={styles.headerGradient}
                        >

                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('./1695976153902-bcb609.jpg')}
                                    style={styles.logo}
                                />
                                <View style={styles.logoOverlay} />
                            </View>
                            <Text style={styles.title}>Blueace AC Services</Text>
                            <Text style={styles.subtitle}>Join thousands of satisfied customers</Text>
                        </LinearGradient>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View
                        style={[
                            styles.form,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        {/* Full Name Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="person-outline" size={20} color="#0066cc" />
                                <Text style={styles.label}>Full Name</Text>
                            </View>
                            <TextInput
                                ref={nameRef}
                                style={getInputStyle('FullName')}
                                placeholder="Enter your full name"
                                placeholderTextColor="#999"
                                value={formData.FullName}
                                onChangeText={(value) => handleChange('FullName', value)}
                                onBlur={() => handleBlur('FullName')}
                                onSubmitEditing={() => focusNextInput('FullName')}
                                returnKeyType="next"
                                autoCapitalize="words"
                                maxLength={50}
                            />
                            {errors.FullName && touched.FullName && (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={16} color="#ff3b30" />
                                    <Text style={styles.errorText}>{errors.FullName}</Text>
                                </View>
                            )}
                            {!errors.FullName && touched.FullName && formData.FullName && (
                                <View style={styles.successContainer}>
                                    <Ionicons name="checkmark-circle" size={16} color="#34c759" />
                                    <Text style={styles.successText}>Looks good!</Text>
                                </View>
                            )}
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="mail-outline" size={20} color="#0066cc" />
                                <Text style={styles.label}>Email Address</Text>
                            </View>
                            <TextInput
                                ref={emailRef}
                                style={getInputStyle('Email')}
                                placeholder="you@example.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={formData.Email}
                                onChangeText={(value) => handleChange('Email', value.toLowerCase())}
                                onBlur={() => handleBlur('Email')}
                                onSubmitEditing={() => focusNextInput('Email')}
                                returnKeyType="next"
                                maxLength={100}
                            />
                            {errors.Email && touched.Email && (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={16} color="#ff3b30" />
                                    <Text style={styles.errorText}>{errors.Email}</Text>
                                </View>
                            )}
                            {!errors.Email && touched.Email && formData.Email && (
                                <View style={styles.successContainer}>
                                    <Ionicons name="checkmark-circle" size={16} color="#34c759" />
                                    <Text style={styles.successText}>Valid email!</Text>
                                </View>
                            )}
                        </View>

                        {/* Phone Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="call-outline" size={20} color="#0066cc" />
                                <Text style={styles.label}>Phone Number</Text>
                            </View>
                            <TextInput
                                ref={phoneRef}
                                style={getInputStyle('ContactNumber')}
                                placeholder="10-digit phone number"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={formData.ContactNumber}
                                onChangeText={(value) => handleChange('ContactNumber', value.replace(/[^0-9]/g, ''))}
                                onBlur={() => handleBlur('ContactNumber')}
                                onSubmitEditing={() => focusNextInput('ContactNumber')}
                                returnKeyType="next"
                                maxLength={10}
                            />
                            {errors.ContactNumber && touched.ContactNumber && (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={16} color="#ff3b30" />
                                    <Text style={styles.errorText}>{errors.ContactNumber}</Text>
                                </View>
                            )}
                            {!errors.ContactNumber && touched.ContactNumber && formData.ContactNumber && (
                                <View style={styles.successContainer}>
                                    <Ionicons name="checkmark-circle" size={16} color="#34c759" />
                                    <Text style={styles.successText}>Valid number!</Text>
                                </View>
                            )}
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.labelContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#0066cc" />
                                <Text style={styles.label}>Password</Text>
                            </View>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    ref={passwordRef}
                                    style={[getInputStyle('Password'), styles.passwordInput]}
                                    placeholder="Min. 8 characters with letters & numbers"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!showPassword}
                                    value={formData.Password}
                                    onChangeText={(value) => handleChange('Password', value)}
                                    onBlur={() => handleBlur('Password')}
                                    onSubmitEditing={handleSubmit}
                                    returnKeyType="done"
                                    maxLength={50}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color="#0066cc"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.Password && touched.Password && (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={16} color="#ff3b30" />
                                    <Text style={styles.errorText}>{errors.Password}</Text>
                                </View>
                            )}
                            {!errors.Password && touched.Password && formData.Password && (
                                <View style={styles.successContainer}>
                                    <Ionicons name="checkmark-circle" size={16} color="#34c759" />
                                    <Text style={styles.successText}>Strong password!</Text>
                                </View>
                            )}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                loading && styles.buttonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <TouchableOpacity onPress={()=> Linking.openURL('https://www.blueaceindia.com/privacy')} activeOpacity={0.7} style={{ marginBottom: 20 }}>
                                <Text>
                                    Read our <Text style={{ color: '#0066cc', fontWeight: 'bold' }}>Terms & Conditions</Text> and <Text style={{ color: '#0066cc', fontWeight: 'bold' }}>Privacy Policy</Text>
                                </Text>
                            </TouchableOpacity>
                            <LinearGradient
                                colors={loading ? ['#ccc', '#999'] : ['#0066cc', '#004499']}
                                style={styles.buttonGradient}
                            >
                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="#ffffff" size="small" />
                                        <Text style={styles.buttonText}>Creating Account...</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.buttonText}>Create Account</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => navigation.navigate('login')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.loginText}>
                                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
    },
    headerGradient: {
        paddingTop: 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    logoContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    logoOverlay: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#e6f3ff',
        textAlign: 'center',
    },
    form: {
        paddingHorizontal: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        marginLeft: 8,
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#e1e8ed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    inputError: {
        borderColor: '#ff3b30',
        backgroundColor: '#fff5f5',
    },
    inputValid: {
        borderColor: '#34c759',
        backgroundColor: '#f0fff4',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
        bottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginLeft: 6,
        flex: 1,
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    successText: {
        color: '#34c759',
        fontSize: 14,
        marginLeft: 6,
        fontWeight: '500',
    },
    button: {
        marginTop: 30,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    buttonDisabled: {
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 8,
    },
    loginLink: {
        marginTop: 30,
        alignItems: 'center',
        paddingVertical: 16,
    },
    loginText: {
        fontSize: 16,
        color: '#666',
    },
    loginTextBold: {
        color: '#0066cc',
        fontWeight: '700',
    },
});