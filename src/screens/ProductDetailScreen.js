import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HorizontalRule from '../components/HorizontalRule'
import BottomButton from '../components/BottomButton'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import starIcon from '../../assets/star.png'
import starIconDefault from '../../assets/star-default.png'
import arrow1 from '../../assets/Arrow1.png'
import arrow2 from '../../assets/Arrow2.png'

const ProductDetailScreen = ({ route }) => {  
  const { data } = route.params
  const images = data.images
  const [imageID, changeImage] = useState(0)
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()  
  
  return (
    <View style={styles.container} >

      <View style={styles.headerImageSection}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerBackIcon}
        >
          <Ionicons
            name='chevron-back'
            size={24}
          />
        </TouchableOpacity>

        <Image
          style={styles.mainImage}
          source={{ uri: `http://localhost:8000/${data.images[imageID]?.url}` }}
        />
      </View>
      
      {images && images.length > 0 && (
        <ScrollView style={styles.containerImage} horizontal={true} showsHorizontalScrollIndicator={false} >
        {images.map((item, index) => (
          <View style={styles.selectImage}>
            <TouchableOpacity
              onPress={() => changeImage(index)}
            >
              <Image
                key={index}
                style={[styles.image, (index == imageID) ? styles.active : '' ]}
                source={{ uri: `http://localhost:8000/${item.url}` }}
              />
            </TouchableOpacity>
          </View>
          ))}
        </ScrollView>
      )}
      
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{data.name[i18n.translator.language]}</Text>
        
        <View style={styles.starContainer}>
          <Image style={styles.iconStar} source={starIcon} />
          <Text style={styles.numberStar}>4.9</Text>
        </View>

        <HorizontalRule />
        
        <View style={styles.section}>
          <Text style={styles.sectionName}>{t('Composition')}</Text>
          <Text style={styles.numberStar}>4.9</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionName}>{t('Size')}</Text>

          <View style={styles.sectionRow}>
            <View style={styles.sectionRowRL}>
              <Image style={styles.iconArrow1} source={arrow1} />

              <Text style={styles.sectionText}>Ширина 30 см</Text>
            </View>

            <View style={styles.sectionRowRL}>
              <Image style={styles.iconArrow2} source={arrow2} />

              <Text style={styles.sectionText}>Ширина 30 см</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionName}>{t('Description')}</Text>
          <Text style={styles.sectionDescription}>{data.description[i18n.translator.language]}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionName}>{t('Ratings and reviews')}</Text>
          
          <View style={styles.sectionAvatar}>
            <Image style={styles.iconAvatar} source={`http://localhost:8000/${data.shop.image}`} />

            <View style={styles.textAvatar}>
              <Text style={styles.textAvatarName}>{data.shop.name}</Text>

              {console.log(data.attributes)}

              <Text style={styles.textAvatarTime}>13:56</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <View style={styles.sectionRowRL}>
              <Text style={styles.starText}>{t('Correspondence')}</Text>
            </View>

            <View style={styles.sectionRowRL}>
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIconDefault} />
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={styles.sectionRowRL}>
              <Text style={styles.starText}>{t('Price / quality')}</Text>
            </View>

            <View style={styles.sectionRowRL}>
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIconDefault} />
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={styles.sectionRowRL}>
              <Text style={styles.starText}>{t('Shop service')}</Text>
            </View>

            <View style={styles.sectionRowRL}>
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIcon} />
              <Image style={styles.starIconDesign} source={starIconDefault} />
              <Image style={styles.starIconDesign} source={starIconDefault} />
              <Image style={styles.starIconDesign} source={starIconDefault} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionComment}>Спасибо большое магазину, пришло все быстро, качественно!</Text>
        </View>
        
      </View>

      <BottomButton data={data} />

    </View>
  )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  headerImageSection: {
    position: 'relative',
  },
  headerBackIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  container: {
    backgroundColor: '#fff',
  },
  mainImage: {
    height: '345px',
    width: '100%',
  },
  image: {
    height: 84,
    width: 84,
    borderRadius: 10,
    opacity: 0.5
  },
  active: {
    opacity: 1
  },
  selectImage: {
    height: 84,
    width: 84,
    height: 'auto',
    marginRight: 10,
  },
  containerImage: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  productName: {
    fontSize: 26,
    fontWeight: 600
  },
  sectionName: {
    fontSize: 20,
    fontWeight: 600
  },
  sectionSize: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  sectionDescription: {
    fontSize: 16,
  },
  sectionComment: {
    fontSize: 16,
    marginBottom: 50,
  },
  productDetails: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  section: {
    marginTop: 2,
    marginBottom: 10
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionRowRL: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  iconStar: {
    width: 26,
    height: 26,
  },
  iconArrow1: {
    width: 12,
    height: 5
  },
  iconArrow2: {
    width: 5,
    height: 12
  },
  numberStar: {
    fontSize: 16,
    marginHorizontal: 10
  },
  sectionAvatar: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  iconAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textAvatar: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  textAvatarName: {
    fontWeight: 600,
    fontSize: 18,
  },
  textAvatarTime: {
    fontSize: 14,
    color: '#999',
    fontWeight: 600
  },
  starText: {
    fontSize: 16,
  },
  starIconDesign: {
    width: 16,
    height: 16,
    marginHorizontal: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
})