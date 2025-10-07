import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { colors } from '../../colors/Colors'

const { width } = Dimensions.get('window')

export default function Faq() {
    const [faqData, setFaqData] = useState([])
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        fetchFaqData()
    }, [])

    const fetchFaqData = async () => {
        try {
            const response = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-faq-content')
            setFaqData(response.data.data)
        } catch (error) {
            console.error('Error fetching FAQ data:', error)
        }
    }

    const FaqItem = ({ item, isExpanded, onPress }) => {
        return (
            <View style={styles.faqItem}>
                <TouchableOpacity
                    style={styles.questionContainer}
                    onPress={onPress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.question}>{item.question}</Text>
                    <Icon name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={16} color="#333" />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.answerContainer}>
                        <Text style={styles.answer}>{item.answer}</Text>
                    </View>
                )}
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Frequently Asked Questions</Text>
                <Text style={styles.subtitle}>Find answers to common questions about our services</Text>
            </View>

            <View style={styles.faqList}>
                {faqData.map((item) => (
                    <FaqItem
                        key={item._id}
                        item={item}
                        isExpanded={expandedId === item._id}
                        onPress={() => setExpandedId(expandedId === item._id ? null : item._id)}
                    />
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        marginTop: 10,
        padding: 20,
        backgroundColor: colors.blue,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.white,
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.8,
    },
    faqList: {
        paddingHorizontal: 15,
    },
    faqItem: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    question: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    answerContainer: {
        padding: 15,
        paddingTop: 0,
    },
    answer: {
        fontSize: 12,
        color: '#666',
        lineHeight: 20,
    },
})
