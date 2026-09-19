import React, {useEffect, useState} from 'react'
import { Image, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../config/api';
import { colors, radius, spacing } from '../theme';

const Categories = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { i18n } = useTranslation();
    const navigation = useNavigation();

    const getCategories = async () => {
        setLoading(true);
        try {
            const json = await apiRequest('/categories');
            setData(json.data || []);
        } catch (error) {
            console.error(error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);


    // Add a check for data before chunking
    const chunkData = (arr) => {
        if (!arr || !Array.isArray(arr)) return []; // Return empty array if data is not valid
        const chunks = [];
        for (let i = 0; i < arr.length; i += 2) {
            chunks.push(arr.slice(i, i + 2));
        }
        return chunks;
    };

    // Add a loading state check
    if (isLoading) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        return (
            <View>
                <ScrollView style={styles.scrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.containerTwoLine}>
                        {numbers.map((chunk, chunkIndex) => (
                            <View key={chunkIndex} style={styles.patternContainer}>
                                {/* Top Row - 1 item */}
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.block}>
                                        <Text style={styles.blockTextSuspend} />

                                        <View style={styles.categoryImageSuspend} />
                                    </TouchableOpacity>
                                </View>

                                {/* Bottom Row - 2 items */}
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.block}>
                                        <Text style={styles.blockTextSuspend} />

                                        <View style={styles.categoryImageSuspend} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    }

    const dataChunks = chunkData(data);

    return (
        <View>
            <ScrollView style={styles.scrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={styles.containerTwoLine}>
                    {dataChunks.map((chunk, chunkIndex) => (
                        <View key={chunkIndex} style={styles.patternContainer}>
                            {/* Top Row - 1 item */}
                            <View style={styles.container}>
                                {chunk[0] && (
                                    <TouchableOpacity style={styles.blockTop}
                                        onPress={() => navigation.navigate('Notifications')}
                                    >
                                        <Text style={styles.blockText}>
                                            {chunk[0].name[i18n.translator.language]}
                                        </Text>

                                        <Image
                                            style={styles.categoryImage}
                                            source={{ uri: chunk[0].image }}
                                        />
                                    </TouchableOpacity>
                                )}
                                {chunk[2] && (
                                    <TouchableOpacity style={styles.block}
                                        onPress={() => navigation.navigate('Notifications')}
                                    >
                                        <Text style={styles.blockText}>
                                            {chunk[2].name[i18n.translator.language]}
                                        </Text>

                                        <Image
                                            style={styles.categoryImage}
                                            source={{ uri: chunk[0].image }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Bottom Row - 2 items */}
                            <View style={styles.container}>
                                {chunk[1] && (
                                    <TouchableOpacity style={styles.block}
                                        onPress={() => navigation.navigate('Notifications')}
                                    >
                                        <Text style={styles.blockText}>
                                            {chunk[1].name[i18n.translator.language]}
                                        </Text>

                                        <Image
                                            style={styles.categoryImage}
                                            source={{ uri: chunk[1].image }}
                                        />
                                    </TouchableOpacity>
                                )}
                                {chunk[2] && (
                                    <TouchableOpacity style={styles.block}
                                        onPress={() => navigation.navigate('Notifications')}
                                    >
                                        <Text style={styles.blockText}>
                                            {chunk[2].name[i18n.translator.language]}
                                        </Text>

                                        <Image
                                            style={styles.categoryImage}
                                            source={{ uri: chunk[1].image }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginVertical: spacing.xs
    },
    containerTwoLine: {
        flexDirection: 'row',
        margin: spacing.md,
    },
    patternContainer: {
        flexDirection: 'column',
        marginRight: 2,
    },
    container: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 5,
    },
    block: {
        backgroundColor: colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: 120,
        height: 47,
        borderRadius: radius.sm,
        marginHorizontal: 2,
        padding: 5,
    },
    blockTop: {
        backgroundColor: colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: 120,
        height: 47,
        borderRadius: radius.sm,
        padding: 5
    },
    blockText: {
        fontSize: 10,
        fontWeight: '500',
        maxWidth: 85,
        color: colors.text,
    },
    categoryImage: {
        width: 40,
        height: 40,
        marginLeft: 10
    },
    blockTextSuspend: {
        backgroundColor: colors.skeleton,
        width: 75,
        height: 15,
        borderRadius: radius.sm,
    },
    categoryImageSuspend: {
        width: 40,
        height: 40,
        marginLeft: 10,
        backgroundColor: colors.skeleton,
        borderRadius: 20,
    }
});

export default Categories;
