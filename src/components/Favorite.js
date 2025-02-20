import React, { useEffect, useState } from 'react';
import { Image, FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

const Favorite = ({ category_id, navigation }) => {
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleFavorite = (productId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(productId)
                ? prevFavorites.filter((id) => id !== productId)
                : [...prevFavorites, productId]
        );
    };

    const isFavorite = (productId) => favorites.includes(productId);

    const getCategories = async () => {
        if (!category_id) return;
        
        // Check local storage first
        const cached = localStorage.getItem('categories');

        if (cached) {
            setData(JSON.parse(cached));
            setLoading(false);
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/product/category/${category_id}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer 1|MADVetcOYwHT7yYmWWQB9PLK6T1lQyvoBYI8Pqc559492981',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 429) {
                console.log('Rate limit exceeded. Please wait before trying again.');
                // Maybe implement a retry mechanism with exponential backoff
                return;
            }
            
            const json = await response.json();
            setData(json.data);
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, [category_id]);

    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetails', { 
                    productId: item.id,
                    product: item 
                })}
            >
                <View style={styles.productBlock}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.productImage}
                            source={{ uri: `http://localhost:8000/${item.images[0]?.url}` }}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={() => toggleFavorite(item.id)}
                        >
                            <Ionicons
                                name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
                                style={styles.iconHeart}
                                size={14}
                                color={isFavorite(item.id) ? '#f00' : '#000'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} TMT</Text>
            </TouchableOpacity>
        </View>
    );

    if (!data.length) {
        return null;
    }

    return (
        <FlatList
            data={data}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.containerBlockProduct}
        />
    );
};

const styles = StyleSheet.create({
    containerBlockProduct: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    productContainer: {
        width: 150,
        height: 'auto',
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
    },
    productImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    productBlock: {
        width: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 5,
        right: 7,
        backgroundColor: '#fff',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    productName: {
        fontSize: 12,
        fontWeight: '500',
        padding: 5,
        height: 40,
    },
    productPrice: {
        fontSize: 12,
        fontWeight: '700',
        padding: 5,
        textAlign: 'right',
    },
    iconHeart: {
        padding: 4,
    },
});

export default Favorite;