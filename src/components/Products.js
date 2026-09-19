import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../config/api';
import ProductCard from './ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { spacing } from '../theme';

const Products = ({ category_id }) => {
    const [data, setData] = useState([]);
    const navigation = useNavigation();
    const { isFavorite, toggleFavorite } = useFavorites();

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
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item)}
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
