import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import ProductCard from '../components/ProductCard';
import { colors, spacing, typography } from '../theme';

const GAP = spacing.md;
const SCREEN_PADDING = spacing.lg;
const CARD_WIDTH = (Dimensions.get('window').width - SCREEN_PADDING * 2 - GAP) / 2;

const CollectionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, title } = route.params || {};

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const json = await apiRequest(`/product/category/${categoryId}`);
                setData(json.data || []);
            } catch (error) {
                console.error('Collection API error:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (categoryId) load();
    }, [categoryId]);

    const toggleFavorite = (productId) => {
        setFavorites((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={1}>{title || 'Kolleksiýa'}</Text>
                <View style={styles.backButton} />
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : data.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="pricetags-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyText}>Bu toparda önüm ýok</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            cardWidth={CARD_WIDTH}
                            isFavorite={favorites.includes(item.id)}
                            onToggleFavorite={() => toggleFavorite(item.id)}
                            onPress={() => navigation.navigate('ProductDetail', { data: item })}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default CollectionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: typography.size.lg,
        fontWeight: typography.weight.semibold,
        color: colors.text,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: spacing.md,
        color: colors.textMuted,
        fontSize: typography.size.sm,
    },
    list: {
        paddingHorizontal: SCREEN_PADDING,
        paddingBottom: spacing.xl,
    },
    row: {
        justifyContent: 'space-between',
    },
});
