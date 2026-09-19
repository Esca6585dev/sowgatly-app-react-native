import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../config/api';
import { colors, radius, spacing, typography } from '../theme';

const SKELETON_COUNT = [1, 2, 3, 4, 5, 6];

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

    if (isLoading) {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {SKELETON_COUNT.map((key) => (
                    <View key={key} style={styles.item}>
                        <View style={styles.iconCircleSuspend} />
                        <View style={styles.labelSuspend} />
                    </View>
                ))}
            </ScrollView>
        );
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {data.map((category) => (
                <TouchableOpacity
                    key={category.id}
                    style={styles.item}
                    onPress={() => navigation.navigate('Collection', { categoryId: category.id, title: category.name?.[i18n.language] })}
                >
                    <View style={styles.iconCircle}>
                        <Image
                            style={styles.icon}
                            source={{ uri: category.image }}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.label} numberOfLines={1}>
                        {category.name?.[i18n.language] || category.name?.tm}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const ITEM_WIDTH = 72;

const styles = StyleSheet.create({
    scrollView: {
        marginVertical: spacing.sm,
    },
    item: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        marginHorizontal: spacing.xs,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        overflow: 'hidden',
        marginBottom: spacing.xs,
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    label: {
        fontSize: typography.size.xs,
        color: colors.text,
        textAlign: 'center',
    },
    iconCircleSuspend: {
        width: 56,
        height: 56,
        borderRadius: radius.full,
        backgroundColor: colors.skeleton,
        marginBottom: spacing.xs,
    },
    labelSuspend: {
        width: 48,
        height: 10,
        borderRadius: radius.sm,
        backgroundColor: colors.skeleton,
    },
});

export default Categories;
