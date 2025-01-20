import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons'

const SearchContainer = () => {
    const { t, i18n } = useTranslation();

    return (
        <SafeAreaProvider style={styles.searchContainer}>
            <SafeAreaView style={styles.searchAreaView}>
                <View style={styles.inputSearchBlock}>
                    <Ionicons name="search" style={styles.iconSearch} size={20} color={'#000'} />

                    <TextInput
                        style={styles.inputText}
                        placeholder={t('Search by products')}
                        theme={{ colors: { primary: '#fff' } }}
                        underlineColor="#fff"
                    />
                </View>

                <View style={styles.buttonSetting}>
                    <TouchableOpacity>
                        <Ionicons name="settings" size={20} color={'#000'} style={styles.iconSetting} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default SearchContainer

const styles = StyleSheet.create({
    searchContainer: {
        padding: '10px',
        backgroundColor: '#fff'
    },
    searchAreaView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputSearchBlock: {
        width: '90%',
        height: '28px',
        border: '#00000040 1px solid',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
        paddingLeft: '10px',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSearch: {
        color: '#ccc',
        fontSize: '14px'
    },
    inputText: {
        fontSize: '10px',
        height: '20px',
        border: 'none',
        borderBlockColor: 'none',
        lineHeight: '12px',
        paddingLeft: '10px',
        width: '90%'
    },
    buttonSetting: {
        height: '28px',
        width: '28px',
        border: '#00000040 1px solid',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
    },
    iconSetting: {
        paddingLeft: '3px',
        paddingTop: '2px'
    },
});