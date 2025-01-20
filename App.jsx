import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator'

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <AppNavigator />
        </I18nextProvider>
    );
}

export default App;