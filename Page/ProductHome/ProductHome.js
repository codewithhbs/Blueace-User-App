import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getAllProduct } from '../../utils/api/Api';

export default function ProductHome() {
    const [isLoading, setIsLoading] = useState(true);
    const [allProduct, setAllProduct] = useState([]);
    const navigation = useNavigation();

    const handleFetchProduct = async () => {
        try {
            setIsLoading(true);
            const res = await getAllProduct();
            setAllProduct(res);
        } catch (error) {
            console.log('Internal server error', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetchProduct();
    }, []);

    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Product_Detail', { id: item.slug || item.title })} // Assuming slug or title as id
        >
            <Image source={{ uri: item.smallImage?.url }} style={styles.cardImage} resizeMode="cover" />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text
                style={styles.cardDesc}
                numberOfLines={2}
                ellipsizeMode="tail"
            >{item.smalldesc}</Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
             <Text style={styles.headerTitle}>Our Product</Text>
            <FlatList
                data={allProduct.slice(0, 4)}
                renderItem={renderProductCard}
                keyExtractor={(item) => item._id.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContent}
            />
            {allProduct.length > 4 && (
                <TouchableOpacity
                    style={styles.showAllButton}
                    onPress={() => navigation.navigate('Products')}
                >
                    <Text style={styles.showAllButtonText}>Show All Products</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
},
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 10,
    },
    card: {
        flex: 1,
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
    },
    cardDesc: {
        fontSize: 14,
        color: '#555',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    showAllButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    showAllButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});