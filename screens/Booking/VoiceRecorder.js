import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VoiceRecorder({
  recording,
  recordings,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onClearRecordings
}) {
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState({});
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      clearInterval(interval);
      setTimer(0);
      pulseAnim.setValue(1);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = (recordingLine, index) => {
    if (isPlaying[index]) {
      recordingLine.sound.pauseAsync();
    } else {
      onPlayRecording(recordingLine);
      recordingLine.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(prev => ({ ...prev, [index]: false }));
        }
      });
    }
    setIsPlaying(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Note</Text>

      <View style={styles.recorderContainer}>
        <Animated.View style={[
          styles.recordIndicator,
          { transform: [{ scale: recording ? pulseAnim : 1 }] }
        ]}>
          <TouchableOpacity
            style={[styles.recordButton, recording && styles.recordingActive]}
            onPress={recording ? onStopRecording : onStartRecording}
          >
            {recording ? (

              <Icon name="stop" size={32} color="#fff" />

            ) : (

              <Icon name="microphone" size={32} color="#fff" />
            )}
          </TouchableOpacity>
        </Animated.View>

        {recording && (
          <Text style={styles.timer}>{formatTime(timer)}</Text>
        )}
      </View>

      <View style={styles.recordingsList}>
        {recordings.map((recordingLine, index) => (
          <View key={index} style={styles.recordingItem}>
            <View style={styles.recordingInfo}>
              <Text style={styles.recordingTitle}>Recording #{index + 1}</Text>
              <Text style={styles.recordingDuration}>
                {formatTime(Math.floor(recordingLine.duration / 1000))}
              </Text>
            </View>

            <View style={styles.recordingControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handlePlayPause(recordingLine, index)}
              >
                {isPlaying[index] ? (

                  <Icon name="pause" size={20} color="#007bff" />
                ) : (

                  <Icon name="play" size={20} color="#007bff" />

                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {recordings.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClearRecordings}
        >

          <Icon name="trash-can" size={20} color="#dc3545" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  recorderContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recordIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: '#dc3545',
  },
  timer: {
    fontSize: 24,
    fontWeight: '600',
    color: '#dc3545',
  },
  recordingsList: {
    gap: 12,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  recordingDuration: {
    fontSize: 14,
    color: '#666',
  },
  recordingControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
    gap: 8,
  },
  clearButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  },
}); 