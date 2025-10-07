import { View, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { promotionalBanner } from '../../utils/api/Api';

const { width } = Dimensions.get('screen');

export default function OfferBanner() {
    const [banner, setBanner] = useState([]);

    const fetchBanner = async () => {
        const data = await promotionalBanner();
        // console.log("first",data)
        setBanner(data);
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    return (
        <View style={styles.container}>
            {banner && banner.length > 0 ? (
                <Image
                    source={{ uri: banner[0]?.bannerImage?.url }}
                    style={styles.image}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
     
        alignItems: 'center', 
    },
    image: {
        width: width * 0.9,
        height: width * 0.35, 
        borderRadius: 10, 
        resizeMode: 'cover',
        shadowColor: '#000',
      
        
    },
});
