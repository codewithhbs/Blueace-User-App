import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Expert AC Service\nat Your Doorstep',
    description:
      'Experience professional AC maintenance and repairs with our certified technicians',
    image: 'https://media.istockphoto.com/id/1221240855/photo/repairman-checking-broken-air-conditioner.jpg?s=612x612&w=0&k=20&c=cG_kPtPiIpCHhzS9PhtedPwC_6fVcHTmhPg5yAyEz5c=',
    color: '#2563eb',
  },
  {
    title: 'Quick & Reliable\nService',
    description: '90-minute response time guaranteed with efficient same-day service',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/3/402086317/JB/IW/WD/72812739/ahu-pipe-instalattion-service.jpg',
    color: '#059669',
  },
  {
    title: '24/7 Support\nJust for You',
    description: 'Round-the-clock emergency support with live chat and phone assistance',
    image: 'https://img.freepik.com/premium-vector/24-7-service-24-7-open-concept-with-arrow-icon_349999-1249.jpg?semt=ais_hybrid',
    color: '#7c3aed',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('login');
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: onboardingData[currentIndex].color,
              opacity: index === currentIndex ? 1 : 0.3,
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Image */}
      <Image source={{ uri: currentSlide.image }} style={[StyleSheet.absoluteFill, styles.backgroundImage]} />

      {/* Overlay Gradient */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: `${currentSlide.color}80` }]} />

      {/* Content */}
      <View style={[styles.contentContainer, { paddingTop: insets.top }]}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>

        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
          {renderDots()}

          <View style={styles.buttonContainer}>
            {currentIndex < onboardingData.length - 1 ? (
              <>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: currentSlide.color }]}>
                  <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleNext} style={[styles.getStartedButton, { backgroundColor: currentSlide.color }]}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width,
    height,
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    padding: 24,
    marginTop: height * 0.1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 44,
  },
  description: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 26,
  },
  bottomContainer: {
    padding: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  skipText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  getStartedButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  getStartedText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
