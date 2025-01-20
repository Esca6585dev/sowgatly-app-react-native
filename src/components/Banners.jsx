import React, {useEffect, useState} from 'react'
import { ImageBackground, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import bgImageRose from '../../assets/banner-1.png';
import bgImageHNY from '../../assets/banner-2.png';
import { useTranslation } from 'react-i18next';

const Banners = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { t, i18n } = useTranslation();

    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/categories?parent=1', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer 1|MADVetcOYwHT7yYmWWQB9PLK6T1lQyvoBYI8Pqc559492981',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();

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
        backgroundColor: '#e7e7e7',
        minWidth: 250,
        height: 98,
        borderRadius: 5,
        marginHorizontal: 2,
        padding: 15,
    },
    bannerBlockTextSuspend: {
        backgroundColor: '#ccc',
        width: 150,
        height: 30,
        borderRadius: 5,
    },
    bannerBlock: {
        minWidth: 250,
        height: 98,
        borderRadius: 5,
        marginHorizontal: 2,
        padding: 15,
    },
    bannerBlockText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#fff',
    },
});
  
export default Banners;