import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, Dimensions, Image, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import ScrollableTabView , { DefaultTabBar  } from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';

import Card from './components/Card';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import Near from './components/Near';
import Popular from './components/Popular';


const width = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
const height = width * 0.55;
const images = [
  'https://media.foody.vn/images/beauty-upload-api-675x355-%281%29-201224151240.jpg',
  'https://media.foody.vn/images/beauty-upload-api-675x355-210219174402.jpg',
  'https://media.foody.vn/images/beauty-upload-api-675x355.-210309112809.jpg',
  'https://images.foody.vn/biz_banner/foody-upload-api-food-biz-210315111823.jpg'
];
const HomeScreen = ({navigation}) => {
  //  const scrollRef = React.useRef();
  const [searchState, setSearchState] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [foodCard, setFoodCard] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchFoodCard = async() => {
      try {

        const list = [];

        await firestore()
        .collection('foodcards')
        .orderBy('title', 'desc')
        .get()
        .then((querySnapshot) => {
          // console.log("Total cards:", querySnapshot.size);

          querySnapshot.forEach(doc => {
            const {
              userId,
              title,
              description,
              price,
              foodCardImg,
              menuImg,
              coordinate,
              ratings,
              reviews
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              title,
              description,
              price,
              foodCardImg,
              menuImg,
              coordinate,
              ratings,
              reviews,
              liked: false,
            })
          })
        })

        setFoodCard(list);
        if(loading) {
          setLoading(false);
        }

        console.log("Card:", foodCard);
      } catch(e) {
        console.log(e);
      }
    };

    useEffect(() => {
      fetchFoodCard();
      // Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
      // Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
  
      // // cleanup function
      // return () => {
      //   Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      //   Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
      // };
    }, []);

  const updateSearch = (search) => {
    // this.setState(search = this.state.search);
    console.log('search triggered!!', search)
  };

  // useEffect(() => {
  //   setInterval(() => {
  //     setSelectedIndex({
  //       selectedIndex: selectedIndex === images.length - 1? 0 : selectedIndex + 1
  //     }),
  //     () => {
  //               scrollRef.current.scrollTo({
  //                 animated: true,
  //                 y: 0,
  //                 x: width * selectedIndex
  //               })}
              
  //   }, 3000)
  // }, [])

  // componentDidMount = () => {
  //   setInterval(() => {
  //     this.setState(prev => ({ selectedIndex: prev.selectedIndex === images.length - 1 ? 0 : prev.selectedIndex + 1 }),
  //       () => {
  //         this.scrollRef.current.scrollTo({
  //           animated: true,
  //           y: 0,
  //           x: width * this.state.selectedIndex
  //         })
  //       })
  //   }, 3000)
  // }

  // componentWillUnmount = () => {

  // }

  // const OnChangeIndex = (event) => {
  //   //width of viewsize
  //   const viewSize = event.nativeEvent.layoutMeasurement.width;
  //   //position of white dot
  //   const contentOffset = event.nativeEvent.contentOffset.x;

  //   const selectedIndexed = Math.floor(contentOffset / viewSize)
  //   setSelectedIndex({ selectedIndexed });
  // }

    // const { search } = this.state;
    // const { selectedIndex } = this.state;

    const renderItem = ({item}) => {
      return (
          <Card 
              itemData={item}
              onPress={()=> navigation.navigate('CardDetails', {itemData: item})}
          />
      );
  };

    return (
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"} />
        <View style={styles.banner}>
        <SearchBar
          placeholder="Name of the place..."
          onChangeText={(txt) => updateSearch(txt)}
          value={searchState}
          containerStyle={{
            backgroundColor: '#64b5f6',
          }}
          inputContainerStyle={{
            backgroundColor: 'white',

          }}
        />

        <Swiper
          autoplay ={true}
          height={200}
          activeDotColor="#fff">
          <View style={styles.slide}>
            <Image
              source={{uri: 'https://media.foody.vn/images/beauty-upload-api-675x355-%281%29-201224151240.jpg'}}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{uri: 'https://media.foody.vn/images/beauty-upload-api-675x355-210219174402.jpg'}}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{uri: 'https://media.foody.vn/images/beauty-upload-api-675x355.-210309112809.jpg'}}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{uri: 'https://images.foody.vn/biz_banner/foody-upload-api-food-biz-210315111823.jpg'}}
              resizeMode="cover"
              style={styles.sliderImage}
            />
          </View>
        </Swiper>
        
        {/* <ScrollView
          onMomentumScrollEnd={(event)=> {
            const viewSize = event.nativeEvent.layoutMeasurement.width;
            //position of white dot
            const contentOffset = event.nativeEvent.contentOffset.x;
        
            const selectedIndexed = Math.floor(contentOffset / viewSize)
            setSelectedIndex({ selectedIndexed });
          }}
          ref={scrollRef}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width, height }}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width, height, resizeMode: 'contain' }}
            />
          ))}
        </ScrollView>
        <View style={styles.circleDiv}>
          {images.map((image, i) => (
            <View
              key={image}
              style={[styles.whiteCircle, { opacity: i === selectedIndex ? 0.5 : 1 }]}
            />
          ))}
        </View> */}
        </View>

        <View style={styles.tabbar}>
          <ScrollableTabView
            style={{marginTop:20 }}
            initialPage={0}
            tabBarActiveTextColor='blue'
            renderTabBar={() => <DefaultTabBar  />}
          >
            {/* <Near key="key1" tabLabel='Near You' onPress={()=> navigation.navigate('CardDetails')}></Near> */}
            <View key='key1' tabLabel='Near You' >
        <FlatList 
            data={foodCard}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
      </View>
            <Popular key = 'key2' tabLabel='Popular'></Popular>
          </ScrollableTabView>
          </View>  
      </View>
    )
  
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  banner: {
    position: 'absolute'
  },

  circleDiv: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  whiteCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: 'white',

  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  tabbar: {
    flex: 1,
    marginTop: width*0.69,
    paddingHorizontal: 30,
  },
  viewSpace: {
    marginTop:0,
    height: 10,
  }
});