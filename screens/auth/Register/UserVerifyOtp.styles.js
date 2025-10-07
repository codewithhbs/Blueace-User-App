import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: width * 0.9,
    maxWidth: 450,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#007bff',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  body: {
    padding: 25,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#333333',
  },
  validityText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6c757d',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    backgroundColor: '#ffffff',
  },
  verifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  resendButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  activeResendText: {
    color: '#007bff',
    fontWeight: '600',
  },
  resendLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});