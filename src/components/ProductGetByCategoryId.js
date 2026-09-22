import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, View, Text, ScrollView } from 'react-native';
import Products from './Products';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../config/api';
import { localize } from '../utils/localize';
import { colors, radius } from '../theme';

const SKELETON_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const LoadingSkeleton = () => (
    <View style={styles.categoryContainerSuspend}>
        {SKELETON_ARRAY.map((item, index) => (
            <View key={`category-${index}`}>
                <View style={styles.headerTextSuspend} />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.productFlexRowSuspend}>
                        {SKELETON_ARRAY.map((innerItem, innerIndex) => (
                            <View 
                                key={`product-${index}-${innerIndex}`} 
                                style={styles.productSuspend}
                            /> 
                        ))}
                    </View>
                </ScrollView>
            </View>
        ))}
    </View>
);

const ProductGetByCategoryId = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { i18n } = useTranslation();

    const getCategories = async () => {
        try {
            const json = await apiRequest('/categories');
            setCategories(json.data || []);
        } catch (error) {
            console.error(error);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);


    if (isLoading) {
        return <LoadingSkeleton />;
    }

    // Rendered with map: this sits inside Main's ScrollView, and a nested
    // vertical FlatList there breaks virtualization and logs a warning.
    return (
        <View style={styles.container}>
            {categories.map((item) => (
                <View key={item.id}>
                    <Text style={styles.headerText}>{localize(item, 'name', i18n.language)}</Text>
                    <Products category_id={item.id}/>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        paddingBottom: 16,
        backgroundColor: '#fff'
    },
    headerText: {
        fontWeight: '700',
        fontSize: 16,
        marginVertical: 10,
        marginHorizontal: 10
    },
    categoryContainerSuspend: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    headerTextSuspend: {
        backgroundColor: '#ccc',
        width: 120,
        height: 10,
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 2,
        padding: 15,
    },
    productFlexRowSuspend: {
        flexDirection: 'row'
    },
    productSuspend: {
        backgroundColor: '#e7e7e7',
        width: 150,
        height: 200,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 5,
        padding: 15,
    },
    productContainer: {
        borderRadius: 8,
        backgroundColor: '#fff',
        ...Platform.select({
            web: {
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.1,
                shadowRadius: 4
            },
            android: {
                elevation: 4
            }
        })
    },
});

export default ProductGetByCategoryId;