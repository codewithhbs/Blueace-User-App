import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetAllServices } from '../../utils/api/Api';
import Card from './Card';
import LoadingSpinner from '../common/Loader';

const { width } = Dimensions.get('screen');

export default function Service() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await GetAllServices();
            setData(response);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.wrapper}>
            {isLoading ? (
                <LoadingSpinner />
            ) : data && data.length > 0 ? (
                <View style={styles.container}>
                    {data.map((item, index) => (
                        <Card key={item._id || index} width={width} data={item} />
                    ))}
                </View>
            ) : (
                <Text style={styles.noDataText}>No services available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 10,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'red',
    },
});
