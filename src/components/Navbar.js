import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.bgColorWhite}>
      <Text style={styles.city}>{t('City')}</Text>

      <View style={styles.container}>

        <View style={styles.containerLeft}>
          <Text style={styles.cityName}>Aşgabat</Text>
            <Icon name="angle-down" style={styles.iconAngleDown} size={20} color={'#000'} />
        </View>

        <View style={styles.containerRight}>
          <Text style={styles.notification}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" style={styles.iconNotificationOutline} size={20} color={'#000'} />
            </TouchableOpacity>
          </Text>
          
          <Text style={styles.cart}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart" style={styles.iconCart} size={20} color={'#000'} />
            </TouchableOpacity>
          </Text>
        </View>
        
      </View>
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({
  bgColorWhite: {
    backgroundColor: '#fff'
  },
  city: {
    color: '#00000080',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '10px',
    fontSize: '17px'
  },
  cityName: {
    fontStyle: 'bold',
    fontSize: '19px'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '2px',
  },
  containerLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerRight: {
    flexDirection: 'row'
  },
  iconAngleDown: {
    paddingLeft: '5px',
  },
  iconCart: {
    fontSize: '20px',
  },
  iconNotificationOutline: {
    fontSize: '20px',
    marginRight: '10px'
  }
});