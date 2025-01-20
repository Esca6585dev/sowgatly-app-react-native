import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'

const getDiscount = (price, discount) => {
    return Math.floor(price-(price*discount)/100);
};

const BottomButton = ({data}) => {
    const [counter, setCounter] = useState(1);

    // Function is called everytime increment button is clicked
    const incrementNumber = () => {
        // Counter state is incremented
        if(counter < 25) {
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

    const addToCart = () => {
        const discountedPrice = getDiscount(data.price, data.discount);
        const totalPrice = discountedPrice * counter;
    
        // Implement logic to add the item to cart using React Native's AsyncStorage
        // This example demonstrates using a simulated storage mechanism (replace with actual storage)
        const simulatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        simulatedCart.push({ ...data, quantity: counter, totalPrice });
        localStorage.setItem('cart', JSON.stringify(simulatedCart));
    
        console.log('Added to cart:', simulatedCart);
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
                        value={counter}
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
        height: '92px',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#999',
        shadowRadius: 10,
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
        shadowColor: '#ccc',
        shadowRadius: 3,
        elevation: 3,
    },
    bottomRight: {
        backgroundColor: '#000',
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