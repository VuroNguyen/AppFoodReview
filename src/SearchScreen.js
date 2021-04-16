import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, Dimensions, Image, ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Card from './components/Card';

import firestore from '@react-native-firebase/firestore';

const SearchScreen = () => {

    const [searchKey, setSearchKey] = useState('');
    const [filtered, setFiltered] = useState(null);
    const [foodCard, setFoodCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFoodCard = async () => {
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
      setFiltered(list);
      if (loading) {
        setLoading(false);
      }

      // console.log("Card:", foodCard);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchFoodCard();
  }, []);

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

  const renderItem = ({ item }) => {
    return (
      <Card
        itemData={item}
        onPress={() => navigation.navigate('CardDetails', { itemData: item })}
      />
    );
  };

    return (
        <View style={styles.container}>
        <SearchBar
          placeholder="Name of the place..."
          onChangeText={(val)=> SearchFilter(val) }
          value={searchKey}
          containerStyle={{
            backgroundColor: '#64b5f6',
          }}
          inputContainerStyle={{
            backgroundColor: 'white',

          }}
        />

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

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
});