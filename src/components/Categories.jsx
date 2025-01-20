import React, {useEffect, useState} from 'react'
import { Image, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next';

const Categories = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { t, i18n } = useTranslation();

    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer 1|MADVetcOYwHT7yYmWWQB9PLK6T1lQyvoBYI8Pqc559492981',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            setData(json.data);
        } catch (error) {
            console.error(error);
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
        marginVertical: 5
    },
    containerTwoLine: {
        flexDirection: 'row',
        margin: 10,
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
        backgroundColor: '#e7e7e7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: 120,
        height: 47,
        borderRadius: 5,
        marginHorizontal: 2,
        padding: 5,
    },
    blockTop: {
        backgroundColor: '#e7e7e7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        minWidth: 120,
        height: 47,
        borderRadius: 5,
        padding: 5
    },
    blockText: {
        fontSize: 10,
        fontWeight: '500',
        maxWidth: 85,
    },
    categoryImage: {
        width: 40,
        height: 40,
        marginLeft: 10
    },
    blockTextSuspend: {
        backgroundColor: '#ccc',
        width: 75,
        height: 15,
        borderRadius: 5,
    },
    categoryImageSuspend: {
        width: 40,
        height: 40,
        marginLeft: 10,
        backgroundColor: '#ccc',
        borderRadius: '50%',
    }
});
  
export default Categories;