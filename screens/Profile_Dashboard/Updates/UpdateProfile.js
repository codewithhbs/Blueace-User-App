import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BlurView } from 'expo-blur'
import { CheckToken } from '../../../utils/api/Api'

export default function UpdateProfile({ isOpen, onClose }) {

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        ContactNumber: '',
        HouseNo: '',
        NearByLandMark: '',
        address: ''
    })

    const fetchUserData = async () => {
        try {
            const data = await CheckToken()
            if (data.success === true) {
                setUser(data.data)
                // Pre-fill form with existing user data
                setFormData({
                    FullName: data.data.FullName || '',
                    Email: data.data.Email || '',
                    ContactNumber: data.data.ContactNumber || '',

                    HouseNo: data.data.HouseNo || '',
                    NearByLandMark: data.data.NearByLandMark || '',
                    address: data.data.address || ''
                })
            }
        } catch (error) {
            setError('Failed to fetch user data')
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchUserData()
        }
    }, [isOpen])

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear any previous error/success messages
        setError('')
        setSuccess('')
    }

    const validateForm = () => {
        if (!formData.FullName.trim()) return 'Full name is required'
        if (!formData.Email.trim()) return 'Email is required'
        if (!/\S+@\S+\.\S+/.test(formData.Email)) return 'Invalid email format'
        if (!formData.ContactNumber.trim()) return 'Contact number is required'

        return null
    }

    const convertToFormData = () => {
        const formDataObj = new FormData()
        Object.keys(formData).forEach(key => {
            if (formData[key]) { // Only append if value exists
                formDataObj.append(key, formData[key])
            }
        })
        return formDataObj
    }

    const handleSubmitUpdate = async () => {
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const formDataToBeSend = convertToFormData()
            const response = await axios.put(
                `https://www.api.blueaceindia.com/api/v1/update-user/${user?._id}`,
                formDataToBeSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

           
            if (response.data.success) {
                setSuccess('Profile updated successfully!')
                setTimeout(() => {
                    onClose()
                }, 2000)
            } else {
                setError(response.data.message || 'Update failed')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <BlurView intensity={100} style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Update Profile</Text>

                    {error ? (
                        <View style={styles.messageContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {success ? (
                        <View style={styles.messageContainer}>
                            <Text style={styles.successText}>{success}</Text>
                        </View>
                    ) : null}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email (Read-Only) </Text>
                        <TextInput
                            style={styles.input}
                            value={formData.Email}
                            placeholder="Enter your email"
                            placeholderTextColor="#A0AEC0"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={false}  // This makes the input read-only
                            selectTextOnFocus={false}  // Prevents selecting text when focused
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.FullName}
                            onChangeText={(text) => handleChange('FullName', text)}
                            placeholder="Enter your full name"
                            placeholderTextColor="#A0AEC0"
                        />
                    </View>




                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contact Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.ContactNumber}
                            onChangeText={(text) => handleChange('ContactNumber', text)}
                            placeholder="Enter your contact number"
                            placeholderTextColor="#A0AEC0"
                            keyboardType="phone-pad"
                        />
                    </View>



                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>House No</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.HouseNo}
                            onChangeText={(text) => handleChange('HouseNo', text)}
                            placeholder="Enter house number"
                            placeholderTextColor="#A0AEC0"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nearby Landmark</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.NearByLandMark}
                            onChangeText={(text) => handleChange('NearByLandMark', text)}
                            placeholder="Enter nearby landmark"
                            placeholderTextColor="#A0AEC0"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.address}
                            onChangeText={(text) => handleChange('address', text)}
                            placeholder="Enter your full address"
                            placeholderTextColor="#A0AEC0"
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleSubmitUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.updateButtonText}>Update Profile</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2B6CB0',
        marginBottom: 20,
        textAlign: 'center',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    errorText: {
        color: '#E53E3E',
        textAlign: 'center',
        fontSize: 14,
    },
    successText: {
        color: '#38A169',
        textAlign: 'center',
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#4A5568',
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#EDF2F7',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#2D3748',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#EDF2F7',
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#4A5568',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    updateButton: {
        flex: 1,
        backgroundColor: '#2B6CB0',
        padding: 15,
        borderRadius: 8,
        marginLeft: 10,
    },
    updateButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
})