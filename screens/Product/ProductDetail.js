import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getProductByName, handleEnquiryForProduct } from '../../utils/api/Api';
import RenderHtml from 'react-native-render-html';
import Layout from '../../components/Layout/_layout';

export default function ProductDetail() {
  const route = useRoute();
  const { id } = route.params || {};
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFetchProduct = async () => {
    try {
      setIsLoading(true);
      const res = await getProductByName(id);
      if (!res || Object.keys(res).length === 0) {
        console.log('Product Data is not found');
        Alert.alert('Error', 'Product not found');
        navigation.goBack();
        return;
      }
      setData(res);
      setFormData((prev) => ({ ...prev, productId: res._id }));
    } catch (error) {
      console.log('Internal server error', error);
      Alert.alert('Error', 'Failed to fetch product details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProduct();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await handleFetchProduct();
    setRefreshing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEnquiry = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setIsLoading(true);
      const res = await handleEnquiryForProduct(formData);
      if (res.status === 'success') {
        Alert.alert('Success', res.message);
        setFormData({
          productId: data._id,
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setShowModal(false);
      } else {
        Alert.alert('Error', res.message);
      }
    } catch (error) {
      console.log('Internal server error', error);
      Alert.alert('Error', 'Failed to submit enquiry');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Layout isHeaderWithBackShown={true} isBottomNavShown={false} title={id} isHeaderShown={false}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {Object.keys(data).length > 0 ? (
            <>
              <Image
                source={{ uri: data.largeImage?.url }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.smallDesc}>{data.smalldesc}</Text>
              <View style={styles.longDescContainer}>
                <RenderHtml
                  contentWidth={300}
                  source={{ html: data.longdesc }}
                />
              </View>
              {/* Add padding to prevent content from being hidden under the sticky button */}
              <View style={styles.bottomPadding} />
            </>
          ) : (
            <Text style={styles.errorText}>No product data available</Text>
          )}
        </ScrollView>

        {/* Sticky Enquiry Button */}
        <View style={styles.stickyButtonContainer}>
          <TouchableOpacity style={styles.enquireButton} onPress={() => setShowModal(true)}>
            <Text style={styles.enquireButtonText}>Enquire About This Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Enquiry Form Popup Modal */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.formHeader}>Enquire About This Product</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Your Phone"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Your Message"
              value={formData.message}
              onChangeText={(text) => handleInputChange('message', text)}
              multiline
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleEnquiry} disabled={isLoading}>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Submitting...' : 'Submit Enquiry'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  smallDesc: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  longDescContainer: {
    marginBottom: 20,
  },
  bottomPadding: {
    height: 80, // Ensure content doesn't get hidden under the sticky button
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  enquireButton: {
    backgroundColor: '#00225f',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  enquireButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#00225f',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});