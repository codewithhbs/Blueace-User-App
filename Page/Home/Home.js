import { View, Text, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import Layout from '../../components/Layout/_layout';
import Service from '../../components/Services/Service';
import OfferBanner from '../../components/OBanner/OfferBanner';
import Faq from '../Faq/Faq';
import GatACall from '../../screens/GetCall/GatACall';
import { WebView } from 'react-native-webview';
import ProductHome from '../ProductHome/ProductHome';

export default function Home() {
    const chatbotHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe
            src="https://embeded.chat.adsdigitalmedia.com?metacode=chatbot-QUP9P-CCQS2"
            title="Chatbot Verification"
            allow="microphone; camera"
          ></iframe>
        </body>
      </html>
    `;

    return (
        <Layout>
            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {/* Top Chatbot Widget */}
                  

                    {/* Page Sections */}
                    <ImageBackground
                        source={require('../../assets/Home/bgs.jpg')}
                        style={styles.imageBackground}
                    />
                    <Service />
                    <OfferBanner />
                    <ProductHome />
                    <GatACall />
                    <Faq />
                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    imageBackground: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
   
});
