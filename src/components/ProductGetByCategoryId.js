import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Platform, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Products from './Products';
import { useTranslation } from 'react-i18next';

const SKELETON_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const LoadingSkeleton = () => (
    <View style={styles.categoryContainerSuspend}>
        {SKELETON_ARRAY.map((item, index) => (
            <View key={`category-${index}`}>
                <View style={styles.headerTextSuspend} />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={styles.productFlexRowSuspend}>
                        {SKELETON_ARRAY.map((innerItem, innerIndex) => (
                            <View 
                                key={`product-${index}-${innerIndex}`} 
                                style={styles.productSuspend}
                            /> 
                        ))}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        ))}
    </View>
);

const ProductGetByCategoryId = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const token = localStorage.getItem('access_token');

    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/categories', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            setCategories(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.categoryContainer}>
            <Text style={styles.headerText}>{item.name[i18n.translator.language]}</Text>
            <Products category_id={item.id}/>
        </View>
    );

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.contentContainer}
                    alwaysBounceVertical
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop:20,
        padding:2,
        backgroundColor: '#fff'
    },
    headerText: {
        fontWeight: '700',
        fontFamily: 'Inter',
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