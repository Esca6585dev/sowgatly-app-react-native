import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { apiRequest } from '../config/api';
import { localize, discountedPrice } from '../utils/localize';
import { colors, radius, spacing, typography } from '../theme';

const BottomButton = ({ data }) => {
    const [counter, setCounter] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { t, i18n } = useTranslation();

    // `stock` can be missing from the API; treat that as "no known limit"
    // instead of blocking the + button.
    const stock = Number.isFinite(Number(data.stock)) && data.stock !== null ? Number(data.stock) : Infinity;
    const outOfStock = stock <= 0;

    const incrementNumber = () => {
        if (counter < stock) setCounter(counter + 1);
    };

    const decrementNumber = () => {
        if (counter > 1) setCounter(counter - 1);
    };

    const addToCart = async () => {
        setIsAdding(true);
        try {
            await apiRequest('/cart/add', {
                method: 'POST',
                body: { product_id: data.id, quantity: counter },
            });
            const label = localize(data, 'name', i18n.language) || t('common.product');
            Alert.alert(t('product.addedTitle'), t('product.addedMessage', { name: label }));
        } catch (error) {
            Alert.alert(t('common.error'), error.message || t('product.addFailed'));
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <View style={styles.bottomContainer}>
            <View style={styles.stepper}>
                <TouchableOpacity onPress={decrementNumber} style={styles.stepButton} disabled={counter <= 1}>
                    <Ionicons name="remove" size={20} color={counter <= 1 ? colors.border : colors.text} />
                </TouchableOpacity>
                <Text style={styles.count}>{counter}</Text>
                <TouchableOpacity onPress={incrementNumber} style={styles.stepButton} disabled={counter >= stock}>
                    <Ionicons name="add" size={20} color={counter >= stock ? colors.border : colors.text} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={addToCart}
                style={[styles.addButton, (outOfStock || isAdding) && styles.addButtonDisabled]}
                disabled={outOfStock || isAdding}
            >
                {isAdding ? (
                    <ActivityIndicator color={colors.textInverse} />
                ) : (
                    <>
                        <Text style={styles.addText} numberOfLines={1}>
                            {outOfStock ? t('product.outOfStock') : t('product.addToCart')}
                        </Text>
                        <Text style={styles.addText}>{discountedPrice(data) * counter} TMT</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default BottomButton

const styles = StyleSheet.create({
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        height: 50,
    },
    stepButton: {
        width: 40,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    count: {
        minWidth: 28,
        textAlign: 'center',
        fontSize: typography.size.lg,
        fontWeight: typography.weight.semibold,
        color: colors.text,
    },
    addButton: {
        flex: 1,
        height: 50,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
    },
    addButtonDisabled: {
        opacity: 0.5,
    },
    addText: {
        color: colors.textInverse,
        fontWeight: typography.weight.semibold,
        fontSize: typography.size.md,
    },
})
