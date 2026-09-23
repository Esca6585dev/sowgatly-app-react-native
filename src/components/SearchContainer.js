import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors, radius, spacing, typography } from '../theme'

const SearchContainer = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchAreaView}>
                <TouchableOpacity
                    style={styles.inputSearchBlock}
                    onPress={() => navigation.navigate('Search')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="search" style={styles.iconSearch} size={18} color={colors.textMuted} />
                    <Text style={styles.placeholder} numberOfLines={1}>{t('Search by products')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSetting}
                    onPress={() => navigation.navigate('Search', { openFilters: true })}
                >
                    <Ionicons name="options-outline" size={18} color={colors.text} />
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default SearchContainer

const styles = StyleSheet.create({
    searchContainer: {
        padding: spacing.md,
        backgroundColor: colors.background
    },
    searchAreaView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputSearchBlock: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    iconSearch: {
        marginRight: spacing.sm,
    },
    placeholder: {
        flex: 1,
        fontSize: typography.size.sm,
        color: colors.textMuted,
    },
    buttonSetting: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
