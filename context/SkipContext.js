import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SkipContext = createContext();

export const SkipProvider = ({ children }) => {
    const [skipLogin, setSkipLogin] = useState(false);

    useEffect(() => {
      
        const loadSkipValue = async () => {
            try {
                const value = await AsyncStorage.getItem('skipLogin');
                if (value !== null) {
                    setSkipLogin(JSON.parse(value));
                }
            } catch (e) {
                console.log("Error loading skipLogin value:", e);
            }
        };
        loadSkipValue();
    }, []);

    const saveSkipLogin = async (value) => {
        try {
            await AsyncStorage.setItem('skipLogin', JSON.stringify(value));
            console.log("skipLogin value saved:", value);
            setSkipLogin(value);
            console.log("skipLogin state updated:", skipLogin);
        } catch (e) {
            console.log("Error saving skipLogin value:", e);
    
        }
    };
    const clearSkipLogin = async () => {
        try {
            await AsyncStorage.removeItem('skipLogin');
            setSkipLogin(false);
            console.log("skipLogin value cleared");
        } catch (e) {
            console.log("Error clearing skipLogin value:", e);
        }
    }

    return (
        <SkipContext.Provider value={{ skipLogin, saveSkipLogin ,clearSkipLogin }}>
            {children}
        </SkipContext.Provider>
    );
};

export const useSkip = () => useContext(SkipContext);