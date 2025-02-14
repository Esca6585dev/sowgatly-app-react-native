import { View, Text } from 'react-native'
import React from 'react'
import Navbar from './Navbar';
import SearchContainer from './SearchContainer';

const Header = () => {
  return (
    <View>
      <Navbar />
    
      <SearchContainer />
    </View>
  )
}

export default Header