import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Layout from '../../components/Layout/_layout'
import ProductPage from './ProductPage'
import GatACall from '../GetCall/GatACall'

export default function Product() {
  return (
    <Layout>
        <ScrollView showsVerticalScrollIndicator={false}>
            <ProductPage />
            <GatACall />
        </ScrollView>
    </Layout>
  )
}

const style = StyleSheet.create({
    container:{
        flex:1
    }
})