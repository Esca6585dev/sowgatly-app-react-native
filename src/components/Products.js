import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../config/api';
import ProductCard from './ProductCard';
import { spacing } from '../theme';

const Products = ({ category_id }) => {
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const navigation = useNavigation();

    const toggleFavorite = (productId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(productId)
                ? prevFavorites.filter((id) => id !== productId)
                : [...prevFavorites, productId]
        );
    };

    const getProducts = async () => {
        if (!category_id) return;

        try {
            const json = await apiRequest(`/product/category/${category_id}`);
            setData(json.data || []);
        } catch (error) {
            console.error('API Error:', error);
            setData([]);
        }
    };

    useEffect(() => {
        getProducts();
    }, [category_id]);

    if (!data.length) {
        return null;
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <ProductCard
                    product={item}
                    onPress={() => navigation.navigate('ProductDetail', { data: item })}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
});

export default Products;
