import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Layout from '../Layout/_layout'
import Service from './Service'
import GatACall from '../../screens/GetCall/GatACall'


export default function DService() {
    return (
        <Layout>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Service />
                <GatACall />
            </ScrollView>
        </Layout>
    )
}