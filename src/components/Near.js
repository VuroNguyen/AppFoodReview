import React, {useState, useEffect} from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import {dataTest} from '../models/data';
import Card from './Card';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Near = ({navigation}) => {

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
              foodCardImg,
              ratings,
              reviews
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              title,
              description,
              foodCardImg,
              ratings,
              reviews
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

    const renderItem = ({item}) => {
        return (
            <Card 
                itemData={item}
                onPress={() => navigation.navigate(('CardDetails'), {itemData: item})}
            />
        );
    };

    return (
      <View style={styles.container}>
        <FlatList 
            data={foodCard}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
      </View>
    );
};


export default Near;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      width: '90%',
      alignSelf: 'center'
    },
  });