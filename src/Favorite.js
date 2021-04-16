import React, {useState, useEffect, useContext} from 'react';
import { TextInput, FlatList, View, Text, Button,StyleSheet, StatusBar, Keyboard, Image } from 'react-native';
import {Appbar} from 'react-native-paper';
import StarRating from './components/StarRating';
import Card from './components/Card';

import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from './AuthProvider';
import firestore from '@react-native-firebase/firestore';
import firebase from 'firebase';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const FavoriteScreen = ({navigation}) => {

    const {user} = useContext(AuthContext)
    const [searchKey, setSearchKey] = useState('');
    const [foodCardId, setFoodCardId] = useState([]);
    const [flag, setFlag] = useState(false);
    const [flag2, setFlag2] = useState(false);

    const fetchLikeList = async() => {
      try {

        const listId = [];

        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('liked')
        .where('liked', '==', true)
        .get()
        .then((querySnapshot) => {
          console.log("Total Like:", querySnapshot.size);

          querySnapshot.forEach(doc => {
            listId.push(
               doc.id,
            )
          })
        })

        setFoodCardId(listId);
        // if(loading) {
        //   setLoading(false);
        // }
        setFlag(true);
        setFlag2(true);

        console.log("Card ID:", foodCardId);
      } catch(e) {
        console.log(e);
      }
    };

    const [foodCard, setFoodCard] = useState(null);
    const [filtered, setFiltered] = useState(null);
    const [loading, setLoading] = useState(true);
// foodCardId.forEach(id => {
  const fetchFoodCard = async() => {
    // console.log('Long:',foodCardId)
    try {
      const list = [];
       await firestore()
      .collection('foodcards')
      .where(firestore.FieldPath.documentId(), 'in', foodCardId)
      .get()
      .then((querySnapshot) => {
        console.log("Total cards:", querySnapshot.size);

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
            reviews,
            likes
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
            likes,
            liked: false,
          })
        })
      })
      
      

      setFoodCard(list);
      setFiltered(list);
      if(loading) {
        setLoading(false);
      }

      // console.log("Card:", foodCard);
    } catch(e) {
      console.log(e);
    }
    
  };  

  const SearchFilter = (text) => {
    if(text) {
      const newData = filtered.filter((item)=> {
        const newItemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return newItemData.indexOf(textData) > -1;
      });
      setFoodCard(newData);
      setSearchKey(text);
    } else {
      setFoodCard(filtered);
      setSearchKey(text);
    }
  }
    

    useEffect(() => {
      fetchLikeList();
      // fetchInitial();
    }, []);

    useEffect(() => {
      // console.log('a')
      fetchFoodCard();
    }, [flag]);


    const renderItem = ({item}) => {
      return (
          <Card 
              itemData={item}
              onPress={()=> navigation.navigate('CardDetails', {itemData: item})}
          />
      );
  };

      return(
        <View style={styles.container}>
        <StatusBar barStyle= {"light-content"}/>
        <Appbar.Header style={{backgroundColor: '#64b5f6'}}>
          <Appbar.Content title='Favorite' style={styles.Header}/>
        </Appbar.Header>

        <View style={styles.searchBackground}>
          <View style={styles.searchBar}>
            <Icon name='ios-search' style={{fontSize: 20}}/>
            <TextInput placeholder="Search" value={searchKey} style={styles.searchInput} onChangeText={(val)=> SearchFilter(val) } onSubmitEditing={Keyboard.dismiss}/>
          </View>
        </View>
        <FlatList 
            data={foodCard}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
        {/* <View style={styles.cardsWrapper}>
        <View style={styles.card}>
          <View style={styles.cardImgWrapper}>
            <Image
              source={require('./images/ad_1.jpg')}
              resizeMode="cover"
              style={styles.cardImg}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Amazing Food Place</Text>
            <StarRating ratings={4} reviews={99} />
            <Text style={styles.cardDetails}>
              Amazing description for this amazing place
            </Text>
          </View>
        </View>
        </View> */}
        
      </View>
      )
    
}

export default FavoriteScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      
    },
    Header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    searchBackground: {
      height: 60, 
      backgroundColor: 'lightgray', 
      justifyContent: 'center', 
      paddingHorizontal: 5
    },

    searchBar: {
      height: 40, 
      backgroundColor: 'white', 
      borderRadius: 10,
      flexDirection: 'row',
      padding: 5,
      alignItems: 'center',
    },

    searchInput: {
      height: 40,
      fontSize: 16,
      marginLeft: 15,
      color: '#64b5f6',
      width: '100%',
    },
    cardsWrapper: {
      marginTop: 20,
      width: '90%',
      alignSelf: 'center',
    },
    card: {
      height: 100,
      marginVertical: 10,
      flexDirection: 'row',
      shadowColor: '#999',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    cardImgWrapper: {
      flex: 1,
    },
    cardImg: {
      height: '100%',
      width: '100%',
      alignSelf: 'center',
      borderRadius: 8,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
    },
    cardInfo: {
      flex: 2,
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderBottomRightRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: '#fff',
    },
    cardTitle: {
      fontWeight: 'bold',
    },
    cardDetails: {
      fontSize: 12,
      color: '#444',
    },

    textNone: {
      fontSize: 20,
      flex: 1,
      marginTop: 20,
    },

    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });