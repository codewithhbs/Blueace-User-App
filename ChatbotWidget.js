import React, { useState, useRef, useEffect } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform
} from "react-native"
import { WebView } from "react-native-webview"
import { Ionicons } from "@expo/vector-icons"
import LottieView from "lottie-react-native"

const { width, height } = Dimensions.get("window")

const ChatbotWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false)
  const [animatedHeight] = useState(new Animated.Value(60))
  const webViewRef = useRef(null)
  const loadingTimeoutRef = useRef(null)

  const toggleChatbot = () => {
    if (!isExpanded) {
      setShowLoader(true)
      setIsWebViewLoaded(false)

      // Fallback timeout - hide loader after 10 seconds max
      loadingTimeoutRef.current = setTimeout(() => {
        setShowLoader(false)
      }, 4000)
    }

    const toValue = isExpanded ? 60 : height - 100

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start()

    setIsExpanded(!isExpanded)
  }

  const closeChatbot = () => {
    // Clear any pending timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    Animated.timing(animatedHeight, {
      toValue: 60,
      duration: 300,
      useNativeDriver: false,
    }).start()

    setIsExpanded(false)
    setShowLoader(false)
    setIsWebViewLoaded(false)
  }

  const handleWebViewLoad = () => {
    console.log("WebView loaded")
    setIsWebViewLoaded(true)

    // Additional delay to ensure iframe content is fully loaded
    setTimeout(() => {
      setShowLoader(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }, 2000) // 2 second delay after WebView reports it's loaded
  }

  const handleWebViewError = (error) => {
    console.log("WebView error:", error)
    setShowLoader(false)
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
  }

  const handleWebViewLoadStart = () => {
    console.log("WebView load started")
  }

  const handleWebViewLoadEnd = () => {
    console.log("WebView load ended")
  }

  // Enhanced HTML with iframe load detection
  const chatbotHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100vh;
            background-color: #f8f9fa;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
            background-color: white;
          }
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div id="loading-overlay" class="loading-overlay">
          <div>Loading chatbot...</div>
        </div>
        <iframe
          id="chatbot-iframe"
          src="https://embeded.chat.adsdigitalmedia.com/?metacode=chatbot-QUP9P-CCQS2&autostart=true"
          title="Chatbot"
          onload="handleIframeLoad()">
        </iframe>
        
        <script>
          function handleIframeLoad() {
            console.log('Iframe loaded');
            // Hide loading overlay
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
              overlay.style.display = 'none';
            }
            
            // Notify React Native that iframe is loaded
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'iframe_loaded'
              }));
            }
          }
          
          // Fallback - hide overlay after 8 seconds
          setTimeout(() => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
              overlay.style.display = 'none';
            }
          }, 8000);
        </script>
      </body>
    </html>
  `

  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data)
      if (message.type === 'iframe_loaded') {
        console.log('Iframe content loaded')
        handleWebViewLoad()
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      {!isExpanded ? (
        <TouchableOpacity style={styles.botIcon} onPress={toggleChatbot}>
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.expandedChat}>
          <TouchableOpacity onPress={closeChatbot} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>

          {showLoader && (
            <View style={styles.loaderContainer}>
              <LottieView
                source={require('./loading.json')}
                autoPlay
                loop
                style={styles.loader}
              />
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{ html: chatbotHTML }}
            style={[styles.webview, { opacity: showLoader ? 0 : 1 }]}
            onLoadStart={handleWebViewLoadStart}
            onLoadEnd={handleWebViewLoadEnd}
            onLoad={handleWebViewLoad}
            onError={handleWebViewError}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            mixedContentMode="compatibility"
            allowsInlineMediaPlayback={true}
          />
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: width - 40,
    borderRadius: 12,

    zIndex: 1000,
  },
  botIcon: {
    width: 60,
    height: 60,
    justifyContent: "end",
    alignItems: "end",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedChat: {
    position: "absolute",
    top: 90,
    right: 0,
  
    height:Platform.OS === 'ios' ? height - 250 : height - 100,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    zIndex: 999,
  },
  loader: {
    width: 250,
    height: 250,
  },
  webview: {
    flex: 1,
  },
})

export default ChatbotWidget