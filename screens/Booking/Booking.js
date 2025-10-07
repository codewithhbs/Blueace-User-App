import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import debounce from 'lodash/debounce';

import VoiceRecorder from './VoiceRecorder';
import Layout from '../../components/Layout/_layout';
import Button from '../../components/common/Button';
import MainHeading from '../../components/common/Heading';
import Input from '../../components/forms/Input';
import AddressSuggestions from './AddressSuggestions';
import { CheckToken, fetchAddressSuggestions, fetchGeocode } from '../../utils/api/Api';

export default function Booking() {
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceType, serviceId, selectedServiceId } = route.params || {};

  const [recording, setRecording] = useState();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [recordings, setRecordings] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    serviceId: '',
    fullName: 'anish',
    email: 'a@gmail.com',
    phoneNumber: '7217619794',
    message: '33',
    voiceNote: '',
    address: '',
    serviceType: '',
    Pincode: '110086',
    houseNo: '109',
    nearByLandMark: '',
    RangeWhereYouWantService: [
      {
        location: {
          type: 'Point',
          coordinates: [],
        },
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedFetchSuggestions = useCallback(
    debounce(async (text) => {
      if (text.length > 2) {
        const results = await fetchAddressSuggestions(text);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleAddressChange = (text) => {
    handleInputChange('address', text);
    debouncedFetchSuggestions(text);
  };

  const handleSelectAddress = async (address) => {
    setShowSuggestions(false);
    handleInputChange('address', address);

    const coordinates = await fetchGeocode(address);
    if (coordinates) {
      handleInputChange('RangeWhereYouWantService', [{
        location: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
      }]);
    }
  };

  const CheckMeAsALogin = async () => {
    const data = await CheckToken();

    if (data.success === true) {
      setUserData(data.data);
      setFormData(prevState => ({
        ...prevState,
        userId: data?.data?._id,
        serviceId: selectedServiceId,
        serviceType: serviceType,
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required. Please enter your full name.';
    if (!formData.email) newErrors.email = 'Email is required. Please provide a valid email address.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format. Please enter a valid email address.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required. Please provide a valid contact number.';
    if (!formData.address) newErrors.address = 'Address is required. Please enter your complete address.';
    if (!formData.Pincode) newErrors.Pincode = 'Pincode is required. Please provide a valid pincode.';
    // if (!formData.nearByLandMark) newErrors.nearByLandMark = 'Landmark is required. Please provide a nearby landmark for better service.';
    if (!formData.RangeWhereYouWantService) newErrors.RangeWhereYouWantService = 'Please Give nearByLandMark';

    setErrors(newErrors);
    return newErrors
  };

  const handleSubmit = async () => {
    console.log(formData?.RangeWhereYouWantService[0]?.location);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.entries(errors)
        .map(([field, error]) => ` ${error}`)
        .join('\n');
      Alert.alert('Input Empty 📝', errorMessages);
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      // Append regular form data
      Object.keys(formData).forEach(key => {
        if (key === 'RangeWhereYouWantService') {
          form.append(key, JSON.stringify(formData[key]));
        } else {
          form.append(key, formData[key]);
        }
      });

      // Append voice recording (if exists)
      if (recordings.length > 0 && recordings[0].file) {
        const rawUri = recordings[0].file;
        console.log('Recording URI:', rawUri);
        const fileUri = rawUri.startsWith('file://') ? rawUri : `file://${rawUri}`;

        form.append('voiceNote', {
          uri: fileUri,
          type: 'audio/x-wav',
          name: 'voiceNote.wav',
        });
      }

      const response = await axios.post('https://www.api.blueaceindia.com/api/v1/make-order-app', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response?.data?.data);

      if (response.data.success) {
        Alert.alert('Booking Successful', 'Your booking has been made successfully.');
        navigation.navigate('Booking-Successful', { data: response?.data?.data });
      } else {
        Alert.alert('Booking Failed', response.data.message || 'An unknown error occurred.');
      }

    } catch (error) {
      console.error('Booking Error:', error?.response?.data || error);
      Alert.alert('Booking Failed', 'There was an error submitting your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  async function startRecording() {
    try {
      const { status, canAskAgain } = await Audio.requestPermissionsAsync();

      if (status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else if (!canAskAgain) {
        // Permission permanently denied — guide user to settings
        Alert.alert(
          'Microphone Permission Required',
          'To record your voice, please enable microphone access in your settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      } else {
        // Permission denied but can ask again
        Alert.alert('Permission Required', 'We need your permission to record audio.');
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'An error occurred while trying to start recording.');
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      setRecordings([...recordings, {
        sound,
        duration: status.durationMillis,
        file: uri
      }]);
      setRecording(undefined);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  }

  useEffect(() => {
    CheckMeAsALogin();
  }, [serviceId, selectedServiceId, serviceType]); // Added missing dependencies

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <MainHeading text={`Book A Service of ${serviceType}`} size='small' />

        <View style={styles.form}>
          <Input
            icon="account"
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
            error={errors.fullName}
          />
          {/* <Input
            icon="email"
            placeholder="email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            error={errors.email}
          /> */}
          <Input
            icon="phone"
            placeholder=" Number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
          />
          {/* <Input
            icon="home"
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            error={errors.address}
          /> */}
          <Input
            icon="home-outline"
            placeholder="Full Address"
            value={formData.houseNo}
            onChangeText={(text) => handleInputChange('houseNo', text)}
          />
          <Input
            icon="map-marker-radius"
            placeholder="Landmark"
            value={formData.address}
            onChangeText={handleAddressChange}
          />
          {showSuggestions && (
            <AddressSuggestions
              suggestions={suggestions}
              onSelectAddress={handleSelectAddress}
            />
          )}
          <Input
            icon="map-marker"
            placeholder="Pincode"
            value={formData.Pincode}
            onChangeText={(text) => handleInputChange('Pincode', text)}
            keyboardType="number-pad"
            error={errors.Pincode}
          />
          <Input
            icon="comment-text-outline"
            placeholder="Message (optional)"
            value={formData.message}
            onChangeText={(text) => handleInputChange('message', text)}
            multiline
          />
        </View>

        <View style={styles.section}>
          <VoiceRecorder
            recording={recording}
            recordings={recordings}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onPlayRecording={(recording) => recording.sound.replayAsync()}
            onClearRecordings={() => setRecordings([])}
          />
        </View>

        <Button loading={loading} onPress={handleSubmit} style={styles.submitButton}>
          Submit Booking
        </Button>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
});
