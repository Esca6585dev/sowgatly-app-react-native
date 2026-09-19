import { I18nextProvider } from 'react-i18next';
import { StyleSheet } from 'react-native'
import i18n from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator'
import { AuthProvider } from './src/context/AuthContext'

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <AppNavigator style={styles.container} />
            </AuthProvider>
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
