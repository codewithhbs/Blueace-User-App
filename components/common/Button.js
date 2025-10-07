import React from 'react';
import { 
    TouchableOpacity, 
    Text, 
    ActivityIndicator, 
    StyleSheet 
} from 'react-native';
import { colors } from '../../colors/Colors';

const Button = ({
    onPress,
    children,
    loading = false,
    disabled = false,
    variant = 'primary', 
    style
}) => {
    const buttonStyles = [
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'outline' && styles.buttonOutline,
        variant === 'danger' && styles.buttonDanger,
        variant === 'success' && styles.buttonSuccess,
        variant === 'dark' && styles.buttonDark,
        variant === 'light' && styles.buttonLight,
        (disabled || loading) && styles.buttonDisabled,
        style,
    ];

    const textStyles = [
        styles.text,
        variant === 'secondary' && styles.textSecondary,
        variant === 'outline' && styles.textOutline,
        variant === 'danger' && styles.textDanger,
        variant === 'success' && styles.textSuccess,
        variant === 'dark' && styles.textDark,
        variant === 'light' && styles.textLight,
        (disabled || loading) && styles.textDisabled,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
            ) : (
                <Text style={textStyles}>{children}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonSecondary: {
        backgroundColor: colors.secondary,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    buttonDanger: {
        backgroundColor: colors.error,
    },
    buttonSuccess: {
        backgroundColor: colors.success,
    },
    buttonDark: {
        backgroundColor: colors.dark,
    },
    buttonLight: {
        backgroundColor: colors.light,
        borderWidth: 2,
        borderColor: colors.secondary,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    textSecondary: {
        color: colors.white,
    },
    textOutline: {
        color: colors.primary,
    },
    textDanger: {
        color: colors.white,
    },
    textSuccess: {
        color: colors.white,
    },
    textDark: {
        color: colors.white,
    },
    textLight: {
        color: colors.secondary,
    },
    textDisabled: {
        color: colors.white,
    },
});

export default Button;
