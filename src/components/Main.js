import { StyleSheet, View, ScrollView } from 'react-native';
import * as React from 'react';
import Categories from './Categories';
import Banners from './Banners';
import ProductGetByCategoryId from './ProductGetByCategoryId';
import ChangeLanguage from '../screens/ChangeLanguage';

const Main = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Categories />

        <Banners />

        <ProductGetByCategoryId />
        
        <ChangeLanguage />

      </ScrollView>
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
