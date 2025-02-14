import { I18nextProvider } from 'react-i18next';
import { StyleSheet } from 'react-native'
import i18n from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator'

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <AppNavigator style={styles.container} />
        </I18nextProvider>
    );
}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
})