"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
  Linking, // Import Linking here
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as DocumentPicker from "expo-document-picker"
import axios from "axios"
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons"

export default function Careers() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchCareers = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(`https://www.api.blueaceindia.com/api/v1/careers?page=${page}`)
      setCareers(response.data.data)
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.currentPage)
    } catch (err) {
      setError("Failed to load career opportunities. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCareers(currentPage)
  }, [currentPage])

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      })

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        setResumeFile(result.assets[0])
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick document")
    }
  }

  const handleApply = (job) => {
    setSelectedJob(job)
    setModalVisible(true)
  }

  const handleSubmitApplication = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !resumeFile) {
      Alert.alert("Missing Information", "Please fill all required fields and upload your resume")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address")
      return
    }

    setSubmitting(true)

    try {
      const form = new FormData()
      form.append("name", formData.name)
      form.append("email", formData.email)
      form.append("phone", formData.phone)
      form.append("message", formData.message)
      form.append("jobID", selectedJob._id)

      // Add the resume file to form data
      const fileUri = Platform.OS === "ios" ? resumeFile.uri.replace("file://", "") : resumeFile.uri
      form.append("resume", {
        uri: fileUri,
        name: resumeFile.name,
        type: resumeFile.mimeType,
      })

      const response = await axios.post("https://www.api.blueaceindia.com/api/v1/create-career-inquiry", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        Alert.alert(
          "Application Submitted",
          "Your application has been submitted successfully. We will contact you soon!",
          [{ text: "OK", onPress: () => closeModal() }],
        )
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      Alert.alert("Error", "Failed to submit application. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
    setFormData({ name: "", email: "", phone: "", message: "" })
    setResumeFile(null)
    setSelectedJob(null)
  }

  if (loading && careers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading career opportunities...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={60} color="#E53935" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchCareers(currentPage)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: "https://placeholder.svg?height=60&width=60" }} style={styles.logo} />
        <View>
          <Text style={styles.title}>Career Opportunities</Text>
          <Text style={styles.subtitle}>Join our growing team of professionals</Text>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>We're looking for talented individuals to help us grow</Text>
      </View>

      {/* Job Listings */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {careers.map((career) => (
          <View key={career._id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{career.title}</Text>
              <View style={styles.vacancyBadge}>
                <Text style={styles.vacancyText}>
                  {career.noOfVacancy} {career.noOfVacancy === 1 ? "Vacancy" : "Vacancies"}
                </Text>
              </View>
            </View>

            <Text style={styles.jobDescription}>{career.description}</Text>

            <View style={styles.divider} />

            <View style={styles.pointsContainer}>
              <Text style={styles.pointsTitle}>Requirements & Benefits:</Text>
              {career.points.map((point, pointIndex) => (
                <View key={pointIndex} style={styles.pointItem}>
                  <MaterialIcons name="check-circle" size={18} color="#4A90E2" />
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(career)}>
                <MaterialIcons name="send" size={20} color="#fff" />
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.whatsappButton}
                onPress={() => {
                  const message = `Hi, I'm interested in the ${career.title} position at Blueace India.`
                  const whatsappUrl = `https://wa.me/+919311539090?text=${encodeURIComponent(message)}`
                  Linking.openURL(whatsappUrl) // Use Linking here
                }}
              >
                <FontAwesome name="whatsapp" size={20} color="#fff" />
                <Text style={styles.whatsappButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={22} color={currentPage === 1 ? "#999" : "#4A90E2"} />
          </TouchableOpacity>

          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity
            style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={22} color={currentPage === totalPages ? "#999" : "#4A90E2"} />
          </TouchableOpacity>
        </View>
      )}

      {/* Application Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for {selectedJob?.title}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.formLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />

              <Text style={styles.formLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />

              <Text style={styles.formLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />

              <Text style={styles.formLabel}>Cover Letter</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us why you're interested in this position"
                multiline
                numberOfLines={4}
                value={formData.message}
                onChangeText={(text) => handleInputChange("message", text)}
              />

              <Text style={styles.formLabel}>Resume/CV *</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <MaterialIcons name="file-upload" size={20} color="#4A90E2" />
                <Text style={styles.uploadButtonText}>
                  {resumeFile ? resumeFile.name : "Upload Resume (PDF, DOC, DOCX)"}
                </Text>
              </TouchableOpacity>
              {resumeFile && (
                <View style={styles.filePreview}>
                  <MaterialIcons name="description" size={20} color="#4A90E2" />
                  <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                    {resumeFile.name}
                  </Text>
                  <TouchableOpacity onPress={() => setResumeFile(null)}>
                    <MaterialIcons name="close" size={20} color="#E53935" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitApplication} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="send" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Application</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#4A90E2",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  banner: {
    backgroundColor: "#2C3E50",
    padding: 15,
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4A90E2",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    flex: 1,
  },
  vacancyBadge: {
    backgroundColor: "#EBF5FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  vacancyText: {
    color: "#4A90E2",
    fontSize: 13,
    fontWeight: "600",
  },
  jobDescription: {
    fontSize: 14,
    color: "#5D6D7E",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E1E8ED",
    marginVertical: 15,
  },
  pointsContainer: {
    marginBottom: 15,
  },
  pointsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },
  pointItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  pointText: {
    fontSize: 14,
    color: "#5D6D7E",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  applyButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 0.5,
  },
  whatsappButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
  },
  pageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F5F7FA",
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 15,
    color: "#2C3E50",
    marginHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: "#4A90E2",
    fontSize: 14,
    marginLeft: 8,
  },
  filePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF5FF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  fileName: {
    flex: 1,
    color: "#4A90E2",
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})
