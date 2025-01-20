// src/components/Piece.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Piece = ({ type, color, size }) => {
    const getPieceImage = () => {
        // Return appropriate piece image based on type and color
        return require(`../../assets/pieces/${color}_${type}.png`);
    };

    return (
        <Image
            source={getPieceImage()}
            style={[styles.piece, { width: size, height: size }]}
        />
    );
};

const styles = StyleSheet.create({
    piece: {
        resizeMode: 'contain',
    },
});