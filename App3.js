import { StyleSheet, SafeAreaView } from 'react-native'
import Navigation from './src/navigation/Navigation'

const App = () => {
    return (
        <SafeAreaView style={styles.root}>
            <Navigation />
        </SafeAreaView>
    );
}

export default App

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f9fbfc'
    },
})