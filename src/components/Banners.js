import React, {useEffect, useState} from 'react'
import { ImageBackground, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import bgImageRose from '../../assets/banner-1.png';
import bgImageHNY from '../../assets/banner-2.png';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../config/api';
import { colors, radius } from '../theme';

const Banners = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { i18n } = useTranslation();

    const getCategories = async () => {
        setLoading(true);
        try {
            const json = await apiRequest('/categories?parent=1');

            if (json.data && Array.isArray(json.data)) {
                setData(json.data);
            } else {
                console.error('Invalid data format received:', json);
                setData([]);
            }
        } catch (error) {
            console.error('API Error:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    // Add loading state
    if (isLoading) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.containerTwoLine}>
                        {Array.isArray(numbers) && numbers.map((item, index) => (
                            <View key={index} style={styles.patternContainer}>
                                <TouchableOpacity>
                                    <View style={styles.bannerBlockSuspend}>
                                        <Text style={styles.bannerBlockTextSuspend}>

                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={styles.containerTwoLine}>
                    {Array.isArray(data) && data.map((item, index) => (
                        <View key={index} style={styles.patternContainer}>
                            <TouchableOpacity>
                                <ImageBackground style={styles.bannerBlock} source={(index%2 == 0) ? bgImageHNY : bgImageRose}>
                                    <Text style={styles.bannerBlockText}>
                                        {item.name[i18n.translator.language]}
                                    </Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 2,
    },
    scrollView: {
        marginLeft: 10,
    },
    containerTwoLine: {
        flexDirection: 'row',
    },
    patternContainer: {
        flexDirection: 'column',
        marginRight: 5,
    },
    bannerBlockSuspend: {
        backgroundColor: colors.skeleton,
        minWidth: 250,
        height: 98,
        borderRadius: radius.sm,
        marginHorizontal: 2,
        padding: 15,
    },
    bannerBlockTextSuspend: {
        backgroundColor: colors.skeleton,
        width: 150,
        height: 30,
        borderRadius: radius.sm,
    },
    bannerBlock: {
        minWidth: 250,
        height: 98,
        borderRadius: radius.sm,
        marginHorizontal: 2,
        padding: 15,
        overflow: 'hidden',
    },
    bannerBlockText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#fff',
    },
});

export default Banners;
