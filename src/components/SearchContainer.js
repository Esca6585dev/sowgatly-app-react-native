import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors, radius, spacing, typography } from '../theme'

const SearchContainer = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchAreaView}>
                <View style={styles.inputSearchBlock}>
                    <Ionicons name="search" style={styles.iconSearch} size={18} color={colors.textMuted} />

                    <TextInput
                        style={styles.inputText}
                        placeholder={t('Search by products')}
                        placeholderTextColor={colors.textMuted}
                    />
                </View>

                <TouchableOpacity style={styles.buttonSetting}>
                    <Ionicons name="settings-outline" size={18} color={colors.text} />
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
    inputText: {
        flex: 1,
        fontSize: typography.size.sm,
        color: colors.text,
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
