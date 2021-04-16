import React, {useContext, useEffect, useState} from 'react';
import { View, Text, Button,StyleSheet, StatusBar, TextInput, Keyboard, ScrollView, Image, FlatList,Alert } from 'react-native';
import {Appbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../AuthProvider';
import StarRating from '../components/StarRating';
import {dataTest} from '../models/data';
import Card from '../components/Card';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


const AdHomeScreen = ({navigation}) =>{

    const {logout} = useContext(AuthContext);
    const [searchKey, setSearchKey] = useState('');
    const [foodCard, setFoodCard] = useState(null);
    const [filtered, setFiltered] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [data, setData] = React.useState({
      searchBarFocus: false,
    });

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

    useEffect(() => {
      fetchFoodCard();
      setDeleted(false);
    }, [deleted]);

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

    const handleDelete = (foodCardId) => {
      Alert.alert(
        'Delete post',
        'Are you sure?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed!'),
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => deleteCard(foodCardId),
          },
        ],
        {cancelable: false},
      );
    };

    const deleteCard = (foodCardId) => {
      console.log('Card ID:', foodCardId);

      firestore().collection('foodcards')
      .doc(foodCardId)
      .get()
      .then(documentSnapshot => {
        if(documentSnapshot.exists) {
          const {foodCardImg} = documentSnapshot.data();
          const {menuImg} = documentSnapshot.data();

          if(foodCardImg !== null && menuImg !== null) {
            const storageRef = storage().refFromURL(foodCardImg);
            const imageRef = storage().ref(storageRef.fullPath);
            const storageRefMenu = storage().refFromURL(menuImg);
            const imageRefMenu = storage().ref(storageRefMenu.fullPath);

            imageRefMenu
              .delete()
              .then(() => {
                console.log(`${menuImg} has been deleted successfully.`);
              })
              .catch((e) => {
                console.log('Error while deleting the menu image. ', e);
              });
            // If the post image is not available

            imageRef
              .delete()
              .then(() => {
                console.log(`${foodCardImg} has been deleted successfully.`);
                deleteFirestoreData(foodCardId);
              })
              .catch((e) => {
                console.log('Error while deleting the image. ', e);
              });
            // If the post image is not available
          }
          else if(menuImg == null && foodCardImg !== null) {
            const storageRef = storage().refFromURL(foodCardImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${foodCardImg} has been deleted successfully.`);
                deleteFirestoreData(foodCardId);
              })
              .catch((e) => {
                console.log('Error while deleting the image. ', e);
              });
            // If the post image is not available
          } 
          else {
            deleteFirestoreData(foodCardId);
          }
        }
      })
    }

    const deleteFirestoreData = (foodCardId) => {
      firestore()
        .collection('foodcards')
        .doc(foodCardId)
        .delete()
        .then(() => {
          Alert.alert(
            'Food Card deleted!',
            'Your Card has been deleted successfully!',
          );
          setDeleted(true);
        })
        .catch((e) => console.log('Error deleting card.', e));
    };
  
    // const _keyboardDidShow = () => {
    //   setData({
    //     ...data,
    //     searchBarFocus: true,
    //   })
    // };
  
    // const _keyboardDidHide = () => {
    //   setData({
    //     ...data,
    //     searchBarFocus: false,
    //   })
    // };

    const renderItem = ({item}) => {
      return (
          <Card 
              itemData={item}
              onPress={()=> navigation.navigate('CardDetails', {itemData: item})}
              onDelete={handleDelete}
          />
      );
  };
    
      return(
        <View style={styles.container}>
        <StatusBar barStyle= {"light-content"}/>
        <Appbar.Header style={{backgroundColor: '#64b5f6'}}>
          <Appbar.Content title='Home' style={styles.Header}/>
        </Appbar.Header>

        <View style={styles.searchBackground}>
          <View style={styles.searchBar}>
            <Icon name='ios-search' style={{fontSize: 20}}/>
            <TextInput placeholder="Search" value={searchKey} onChangeText={(val)=> SearchFilter(val) } style={styles.searchInput} onSubmitEditing={Keyboard.dismiss}/>
          </View>
        </View>

        <View style={styles.container}>
        <FlatList 
            data={foodCard}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
      </View>
      </View>
      )
    
}

export default AdHomeScreen;

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
  });