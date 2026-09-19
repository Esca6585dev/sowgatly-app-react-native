import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../config/api';
import { colors } from '../theme';

const getDiscount = (price, discount) => {
    return Math.floor(price-(price*discount)/100);
};

const BottomButton = ({data}) => {
    const [counter, setCounter] = useState(1);
    const { i18n } = useTranslation();

    // Function is called everytime increment button is clicked
    const incrementNumber = () => {
        // Counter state is incremented
        if(counter < data.stock) {
            setCounter(counter + 1);
        }
    };

    // Function is called everytime decrement button is clicked
    const decrementNumber = () => {
        // Counter state is decremented
        if(counter > 1) {
            setCounter(counter - 1);
        }
    };

    const addToCart = async () => {
        try {
            await apiRequest('/cart/add', {
                method: 'POST',
                body: { product_id: data.id, quantity: counter },
            });
            const label = data.name?.[i18n.language] || data.name?.tm || 'Önüm';
            Alert.alert('Sebede goşuldy', `${label} sebede goşuldy.`);
        } catch (error) {
            Alert.alert('Ýalňyşlyk', error.message || 'Sebede goşup bolmady.');
        }
    };
    
    return (
        <View style={styles.bottomContainer}>
            <View style={styles.bottomWrapper}>
                <View style={styles.bottomLeft}>
                    <TouchableOpacity
                        onPress={decrementNumber}
                    >
                        <Text style={styles.bottomLeftMinus}>-</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        value={String(counter)}
                        keyboardType='numeric'
                    />
                    <TouchableOpacity
                        onPress={incrementNumber}
                    >
                        <Text style={styles.bottomLeftPlus}>+</Text>
                    </TouchableOpacity>
                
                </View>

                <TouchableOpacity
                    onPress={addToCart}
                >
                    <View style={styles.bottomRight}>
                        <Text style={styles.bottomRightText}>В корзину</Text>
                        <Text style={styles.bottomRightText}>{getDiscount(data.price, data.discount) * counter} ТМТ</Text>
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default BottomButton

const styles = StyleSheet.create({
    bottomContainer: {
        width: '100%',
        height: 92,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#999',
                shadowOffset: { width: 0, height: 0 }, // You might need to adjust offset
                shadowOpacity: 1, // You might need to adjust opacity
                shadowRadius: 10,
            },
            android: {
                elevation: 5, // Adjust elevation as needed
            },
        }),
    },
    bottomWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    bottomLeft: {
        width: 132,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        borderRadius: 10,
        borderColor: '#ccc',
        ...Platform.select({
            ios: {
                shadowColor: '#ccc',
                shadowOffset: { width: 0, height: 0 }, // You might need to adjust offset
                shadowOpacity: 1, // You might need to adjust opacity
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    bottomRight: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        width: 210,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    bottomRightText: {
        color: '#fff',
        fontWeight: '600'
    },
    bottomLeftMinus: {
        color: '#ccc',
        fontSize: 22,
        paddingHorizontal: 10,
    },
    bottomLeftPlus: {
        color: '#ccc',
        fontSize: 22,
        paddingHorizontal: 10,
    },
    input: {
        width: 32,
        height: 32,
        fontSize: 22,
        paddingTop: 2,
        textAlign: 'center',
    }
})