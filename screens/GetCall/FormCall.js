import { View, Text, KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';
import { colors } from '../../colors/Colors';
import axios from 'axios';
import Layout from '../../components/Layout/_layout';
import LoadingSpinner from '../../components/common/Loader';

export default function FormCall() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        mobile: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const validateInputs = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.mobile.trim() || !/^\d+$/.test(formData.mobile)) newErrors.mobile = 'Valid mobile number is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setSuccess('');
    };

    const handleSubmit = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const res = await axios.post('https://www.api.blueaceindia.com/api/v1/create-contact', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSuccess('Our Team Call You In 2-3 Working Hours,Thank You');
            setFormData({
                name: '',
                email: '',
                subject: '',
                mobile: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout isHeaderShown={true} isBottomNavShown={true}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Raise A Call Back From Blueace India Team</Text>
                        <Text style={styles.subtitle}>We are always ready to help you</Text>

                        <Input
                            icon="account-outline"
                            value={formData.name}
                            placeholder="Enter your name"
                            onChangeText={(value) => handleInputChange('name', value)}
                            error={errors.name}
                        />
                        <Input
                            icon="email-outline"
                            keyboardType="email-address"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChangeText={(value) => handleInputChange('email', value)}
                            error={errors.email}
                        />
                        <Input
                            icon="message-outline"
                            value={formData.subject}
                            placeholder="Enter your subject"
                            onChangeText={(value) => handleInputChange('subject', value)}
                            error={errors.subject}
                        />
                        <Input
                            icon="phone-outline"
                            keyboardType="phone-pad"
                            value={formData.mobile}
                            placeholder="Enter your mobile number"
                            onChangeText={(value) => handleInputChange('mobile', value)}
                            error={errors.mobile}
                        />
                        <Input
                            icon="comment-text-outline"
                            value={formData.message}
                            placeholder="Enter your message"
                            multiline
                            numberOfLines={4}
                            onChangeText={(value) => handleInputChange('message', value)}
                            error={errors.message}
                        />

                        <Button
                            onPress={handleSubmit}
                            loading={loading}
                            style={styles.loginButton}
                        >
                            {loading ? <LoadingSpinner /> : 'Get a Call'}
                        </Button>

                        {success ? <Text style={styles.successMessage}>{success}</Text> : null}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 48,
    },
    title: {
        fontSize: 28,
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
    loginButton: {
        marginTop: 16,
    },
    successMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.success,
        textAlign: 'center',
        marginTop: 16,
    },
});
