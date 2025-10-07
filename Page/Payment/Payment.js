import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import PhonePePaymentSDK from 'react-native-phonepe-pg'

export default function Payment() {
    const PHONEPAY_MERCHANT_ID = 'TESTPGPAYCREDUAT'
    const PHONEPAY_API_KEY = '14d6df8a-75bf-4873-9adf-43bc1545094f'

    const [amount, setAmount] = useState('')

    const handlePayment = () => {
        if (!amount || isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }

        const paymentParams = {
            merchantId: PHONEPAY_MERCHANT_ID,
            apiKey: PHONEPAY_API_KEY,
            amount: amount,

        }

        // PhonePePaymentSDK.startPayment(paymentParams, (response) => {
        //     if (response.status === 'success') {
        //         alert('Payment Successful');
        //     } else {
        //         alert('Payment Failed');
        //     }
        // })
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <Text>Payment</Text>
                <TextInput
                    style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        marginVertical: 10,
                        paddingLeft: 10
                    }}
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={(text) => setAmount(text)}
                />
                <Button title="Start Payment" onPress={handlePayment} />
            </View>
        </SafeAreaView>
    )
}
