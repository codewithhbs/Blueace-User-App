import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllProduct } from '../../utils/api/Api';
import { useNavigation } from '@react-navigation/native';

export default function ProductPage() {
    const navigation = useNavigation()
    const [allProduct, setAllProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const response = await getAllProduct();
            setAllProduct(response); // Assuming the API response has { success: true, data: [...] }
        } catch (error) {
            console.log('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderHeader = () => (
        <Text style={styles.header}>Products</Text>
    );

    const renderProduct = ({ item }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={()=> navigation.navigate('Product_Detail',{id: item?.title})} style={styles.card}>
            <Image
                source={{ uri: item.smallImage.url }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text 
                style={styles.description}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {item.smalldesc}
            </Text>
            {/* <Text style={styles.price}>Price: ${item.price.toLocaleString()}</Text> */}
            {/* If you want to display longdesc, you might need a WebView or parse HTML, but skipping for simplicity */}
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={allProduct}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        maxWidth: '48%', // For two columns
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});