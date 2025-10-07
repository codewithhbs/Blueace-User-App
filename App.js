import { useState, useEffect, useRef, useCallback } from "react";
import { AppRegistry, View, StyleSheet, Text, StatusBar } from "react-native";
import { name as appName } from "./app.json";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./screens/Onboarding/Onboarding";
import Login from "./screens/auth/Login/Login";
import { CheckToken } from "./utils/api/Api";
import Home from "./Page/Home/Home";
import LoadingSpinner from "./components/common/Loader";
import Service_Details from "./Page/Service_Details/Service_Details";
import Booking from "./screens/Booking/Booking";
import BookingSuccess from "./screens/Booking/BookingSuccess";
import FormCall from "./screens/GetCall/FormCall";
import Profile from "./screens/Profile_Dashboard/Profile";
import OrderPage from "./screens/Profile_Dashboard/OrderPage";
import DService from "./components/Services/DService";
import RegisterUser from "./screens/auth/Register/RegisterUser";
import Careers from "./Page/careers/Careers";
import PasswordChange from "./Page/PasswordChange/PasswordChange";
import ErrorBoundary from "./ErrorBoundary";
import ChatbotWidget from "./ChatbotWidget";
import { SkipProvider } from "./context/SkipContext";
import UserVerifyOtp from "./screens/auth/Register/VerifyOtp";
import CheckAppUpdate from "./context/CheckAppUpdate";
import Product from "./screens/Product/Product";
import ProductDetail from "./screens/Product/ProductDetail";

const Stack = createNativeStackNavigator();

const App = () => {
  console.log("🔄 App component rendering...");

  // State management
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Refs
  const navigationRef = useRef(null);
  const initializationRef = useRef(false); // Prevent multiple initialization calls

  // Memoized token check function to prevent re-renders
  const checkInitialRoute = useCallback(async () => {
    console.log("🔍 Starting token check...");

    // Prevent multiple simultaneous calls
    if (initializationRef.current) {
      console.log("⚠️ Token check already in progress, skipping...");
      return;
    }

    initializationRef.current = true;
    setIsInitializing(true);

    try {
      console.log("📡 Calling CheckToken API...");
      const startTime = Date.now();

      const data = await CheckToken();
      // console.log("📡 Calling CheckToken DATA...", data);

      const endTime = Date.now();
      console.log(`✅ CheckToken completed in ${endTime - startTime}ms`);
      // console.log("📄 CheckToken response:", JSON.stringify(data, null, 2));

      if (data?.success) {
        console.log("🏠 Setting initial route to 'home' (authenticated)");
        setInitialRouteName("home");
      } else {
        console.log("👋 Setting initial route to 'Onboard' (not authenticated)");
        setInitialRouteName("Onboard");
      }
    } catch (error) {
      console.error("❌ CheckToken error:", error);


      console.log("🔄 Falling back to 'Onboard' due to error");
      setInitialRouteName("Onboard");

      // Uncomment if you're using Sentry
      // Sentry.captureException(error);
    } finally {
      console.log("🏁 Token check process completed");
      setIsInitializing(false);
      initializationRef.current = false;
    }
  }, []);

  // Track route changes with better logging
  const handleNavigationStateChange = useCallback(() => {
    if (!navigationRef.current) {
      console.log("⚠️ Navigation ref not available");
      return;
    }

    try {
      const currentRouteName = navigationRef.current.getCurrentRoute()?.name;
      console.log(`🧭 Navigation state changed - Current route: ${currentRouteName}`);

      if (currentRouteName !== currentRoute) {
        console.log(`🔄 Route transition: ${currentRoute} → ${currentRouteName}`);
        setCurrentRoute(currentRouteName);
      }
    } catch (error) {
      console.error("❌ Error getting current route:", error);
    }
  }, [currentRoute]);

  // Navigation ready handler
  const handleNavigationReady = useCallback(() => {
    console.log("🚀 Navigation container is ready");
    setIsNavigationReady(true);

    // Get initial route name
    if (navigationRef.current) {
      const initialRoute = navigationRef.current.getCurrentRoute()?.name;
      console.log(`📍 Initial route detected: ${initialRoute}`);
      setCurrentRoute(initialRoute);
    }
  }, []);

  // Initialize app on mount
  useEffect(() => {
    console.log("🚀 App useEffect triggered - Starting initialization");
    checkInitialRoute();

    // Cleanup function
    return () => {
      console.log("🧹 App cleanup");
      initializationRef.current = false;
    };
  }, []); // Empty dependency array - only run once

  // Log state changes for debugging
  useEffect(() => {
    console.log("📊 State update:", {
      isInitializing,
      initialRouteName,
      currentRoute,
      isNavigationReady
    });
  }, [isInitializing, initialRouteName, currentRoute, isNavigationReady]);

  // Show loading screen while checking token
  if (isInitializing || !initialRouteName) {
    console.log("⏳ Showing loading screen", { isInitializing, initialRouteName });

    return (
      <View style={styles.loaderContainer}>
        <LoadingSpinner />
        <Text style={styles.loaderText}>
          {isInitializing ? "Authenticating..." : "Loading, please wait..."}
        </Text>
        <Text style={styles.debugText}>
          {isInitializing ? "Checking authentication status..." : "Preparing app..."}
        </Text>
      </View>
    );
  }

  console.log(`🎯 Rendering navigation with initial route: ${initialRouteName}`);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationReady}
      onStateChange={handleNavigationStateChange}
    >
    <StatusBar barStyle={'default'}/>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // Add smooth transitions
        }}
      >
        <Stack.Screen
          name="Onboard"
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="login"
          component={Login}
        />
        <Stack.Screen
          name="register"
          component={RegisterUser}
        />
        <Stack.Screen
          name="home"
          component={Home}
        />
        <Stack.Screen
          name="otp"
          component={UserVerifyOtp}
        />
        <Stack.Screen
          name="service_details"
          component={Service_Details}
        />
        <Stack.Screen
          name="Booking"
          component={Booking}
        />
        <Stack.Screen
          name="Booking-Successful"
          component={BookingSuccess}
        />
        <Stack.Screen
          name="get-a-call"
          component={FormCall}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          name="order"
          component={OrderPage}
        />
        <Stack.Screen
          name="resetpassword"
          component={PasswordChange}
        />
        <Stack.Screen
          name="Services"
          component={DService}
        />
        <Stack.Screen
          name="Careers"
          component={Careers}
        />
        <Stack.Screen
          name="Products"
          component={Product}
        />
        <Stack.Screen
          name="Product_Detail"
          component={ProductDetail}
        />
      </Stack.Navigator>

      {/* Only show chatbot on home screen and when navigation is ready */}
      {currentRoute === "home" && isNavigationReady && (
        <>
          {console.log("🤖 Rendering ChatbotWidget")}
          <ChatbotWidget />
        </>
      )}
    </NavigationContainer>
  );
};

const RootApp = () => {
  console.log("🌟 RootApp rendering");

  return (
    <ErrorBoundary>
      <CheckAppUpdate>

      <SkipProvider>
        <App />
      </SkipProvider>
      </CheckAppUpdate>
    </ErrorBoundary>
  );
};

// Register the app
console.log("📱 Registering app component:", appName);
AppRegistry.registerComponent(appName, () => RootApp);

export default RootApp;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 18,
    color: "#0d6efd",
    fontWeight: "600",
    textAlign: "center",
  },
  debugText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
  },
});