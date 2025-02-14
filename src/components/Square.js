import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const Square = ({ children, position, size, isDark, onSelect }) => {
    return (
        <TouchableOpacity
            style={[
                styles.square,
                { width: size, height: size },
                isDark ? styles.dark : styles.light
            ]}
            onPress={() => onSelect(position)}
        >
            {children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    square: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dark: {
        backgroundColor: '#769656',
    },
    light: {
        backgroundColor: '#eeeed2',
    },
});

