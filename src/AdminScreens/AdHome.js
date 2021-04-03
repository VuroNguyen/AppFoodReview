import React, {useContext, useEffect} from 'react';
import { View, Text, Button,StyleSheet, StatusBar, TextInput, Keyboard, ScrollView, Image, FlatList } from 'react-native';
import {Appbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../AuthProvider';
import StarRating from '../components/StarRating';
import {dataTest} from '../models/data';
import Card from '../components/Card';


const AdHomeScreen = ({navigation}) =>{

    const {logout} = useContext(AuthContext);
    const [data, setData] = React.useState({
      searchBarFocus: false,
    });

    useEffect(() => {
      Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
  
      // cleanup function
      return () => {
        Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
      };
    }, []);
  
    const _keyboardDidShow = () => {
      setData({
        ...data,
        searchBarFocus: true,
      })
    };
  
    const _keyboardDidHide = () => {
      setData({
        ...data,
        searchBarFocus: false,
      })
    };

    const renderItem = ({item}) => {
      return (
          <Card 
              itemData={item}
              onPress={()=> {}}
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
            <TextInput placeholder="Search" style={styles.searchInput} onSubmitEditing={Keyboard.dismiss}/>
          </View>
        </View>

        <View style={styles.container}>
        <FlatList 
            data={dataTest}
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