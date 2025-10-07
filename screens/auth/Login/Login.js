import { View, Text, KeyboardAvoidingView, ScrollView, StyleSheet, Platform, TouchableOpacity, Image, Alert, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout/_layout'
import { useNavigation, CommonActions } from '@react-navigation/native';
import Input from '../../../components/forms/Input';
import Button from '../../../components/common/Button';
import { colors } from '../../../colors/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { login } from '../../../utils/api/Api';
import LoadingSpinner from '../../../components/common/Loader';
import { useSkip } from '../../../context/SkipContext';
import { save } from '../../../Service/SecureStore';

export default function Login() {
    const [loginMethod, setLoginMethod] = useState('phone'); // 'email' or 'phone'
    const [formInputs, setFormInputs] = useState({
        email: '',
        password: '',
        phoneNumber: '',
    });

    const { saveSkipLogin } = useSkip()
    const { skipLogin } = useSkip()
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleInputChange = (name, value) => {
        setFormInputs({ ...formInputs, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateInputs = () => {
        let valid = true;
        const newErrors = {};

        if (loginMethod === 'email') {
            if (!formInputs.email || !/\S+@\S+\.\S+/.test(formInputs.email)) {
                newErrors.email = 'Please enter a valid email';
                valid = false;
            }
        } else {
            if (!formInputs.phoneNumber || !/^\d{10}$/.test(formInputs.phoneNumber)) {
                newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
                valid = false;
            }
        }

        if (!formInputs.password || formInputs.password.length < 7) {
            newErrors.password = 'Password must be at least 7 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSkip = async () => {
        await saveSkipLogin(true)
        Alert.alert("Skip Login", "You can skip login for now, but some features may be limited.");
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'home',
                    }
                ],
            })
        );
    }

    const handleSubmit = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const loginData = {
                ...formInputs,
                loginMethod,
            };

            const data = await login(loginData);

            if (!data || data.success === false) {
                setErrors({ ...errors, password: data?.msg || "Invalid login credentials." });
                return;
            }

            // Check if user is not verified
            if (data.data && data.data.isVerify === false) {
                Alert.alert("OTP Sent", data.message || "Verification required.");
                navigation.navigate("otp", { id: data.data.id, contact: data.data.ContactNumber });
                return;
            }

            // Success case
            Alert.alert("Success!", data.message || "Login successful!");
            console.log("data.token",data.token)
            await save('token', data.token);
        await saveSkipLogin(false)
            setTimeout(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'home' }],
                    })
                );
            }, 1500);

        } catch (error) {
            console.log(error.message);
            Alert.alert("Login failed", error.message);
        } finally {
            setLoading(false);
        }
    };


    const toggleLoginMethod = () => {
        setLoginMethod(prev => prev === 'email' ? 'phone' : 'email');
        setErrors({});
    };

    return (
        <Layout isHeaderShown={false} isBottomNavShown={false}>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
                        <Image
                            source={require('./ac-login.jpg')}
                            style={styles.logo}
                            resizeMode="cover"
                        />
                    </Animated.View>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>

                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    loginMethod === 'email' && styles.toggleButtonActive
                                ]}
                                onPress={() => setLoginMethod('email')}
                            >
                                <Icon name="email" size={20} color={loginMethod === 'email' ? colors.white : colors.primary} />
                                <Text style={[
                                    styles.toggleText,
                                    loginMethod === 'email' && styles.toggleTextActive
                                ]}>Email</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    loginMethod === 'phone' && styles.toggleButtonActive
                                ]}
                                onPress={() => setLoginMethod('phone')}
                            >
                                <Icon name="phone" size={20} color={loginMethod === 'phone' ? colors.white : colors.primary} />
                                <Text style={[
                                    styles.toggleText,
                                    loginMethod === 'phone' && styles.toggleTextActive
                                ]}>Phone</Text>
                            </TouchableOpacity>
                        </View>

                        {loginMethod === 'email' ? (
                            <Input
                                icon="email-outline"
                                keyboardType="email-address"
                                value={formInputs.email}
                                placeholder="Enter your email"
                                onChangeText={(value) => handleInputChange('email', value)}
                                error={errors.email}
                            />
                        ) : (
                            <Input
                                icon="phone"
                                keyboardType="phone-pad"
                                value={formInputs.phoneNumber}
                                placeholder="Enter your phone number"
                                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                                error={errors.phoneNumber}
                            />
                        )}

                        <View style={styles.passwordContainer}>
                            <Input
                                icon="lock-outline"
                                secureTextEntry={!showPassword}
                                value={formInputs.password}
                                placeholder="Enter your password"
                                onChangeText={(value) => handleInputChange('password', value)}
                                error={errors.password}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Icon
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={24}
                                    color={colors.primary}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('resetpassword')}
                            style={styles.forgotPassword}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            onPress={handleSubmit}
                            loading={loading}
                            style={styles.loginButton}
                        >
                            {loading ? <LoadingSpinner /> : 'Sign In'}
                        </Button>

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity onPress={() => handleSkip()} >
                                <Text>Skip To Continue</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('register')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </Layout>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    logoContainer: {
        alignItems: 'center',
        width: 'auto',
        height: 250,

    },
    logo: {
        width: '100%',
        height: '100%',

    },
    formContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 48,

    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.placeholder,
        textAlign: 'center',
        marginBottom: 32,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 4,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    toggleButtonActive: {
        backgroundColor: colors.primary,
    },
    toggleText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    toggleTextActive: {
        color: colors.white,
    },
    passwordContainer: {
        position: 'relative',
        marginTop: 16,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginVertical: 16,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        marginTop: 16,
        height: 50,
        borderRadius: 25,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: colors.placeholder,
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 24,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    signupText: {
        color: colors.text,
        fontSize: 14,
    },
    signupLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});