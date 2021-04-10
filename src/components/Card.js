import React,{useContext, useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AuthContext} from '../AuthProvider';

import StarRating from './StarRating';
import firestore from '@react-native-firebase/firestore'

const Card = ({itemData, onPress, onDelete}) => {

  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

    const getUser = async() => {
      await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log(documentSnapshot.data())
          setUserData(documentSnapshot.data())
        }
      })
      .catch(error => {
        console.log('Error:',error);
      })
     }

     useEffect(() => {
        getUser();
        return () => {
          userData
        }
      }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.cardImgWrapper}>
          <Image
            source={{uri:itemData.foodCardImg}}
            resizeMode="cover"
            style={styles.cardImg}
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{itemData.title}</Text>
          <StarRating ratings={itemData.ratings} reviews={itemData.reviews} />
          <Text numberOfLines={2} style={styles.cardDetails}>{itemData.description}</Text>
          {userData? user.uid === itemData.userId  || userData.role === 'admin' ? 
          <TouchableOpacity style={styles.button} onPress={()=> onDelete(itemData.id)}>
          <Ionicons name="md-trash-bin" size={25} />
          </TouchableOpacity> 
          : null : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
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
  button: {
    alignSelf: 'flex-end',
    borderRadius: 5,
    padding: 5,
  }
});
