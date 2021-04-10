import React, {useContext, useEffect, useState} from 'react';
import { View, Text, Button,StyleSheet, StatusBar } from 'react-native';
import {Appbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from './AuthProvider';

const NotificationScreen = ({navigation}) =>{

  const [data, setData] = useState(null);
  const {user} = useContext(AuthContext);

  const getRole = async() => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if (documentSnapshot.exists) {
        console.log(documentSnapshot.data())
        setData(documentSnapshot.data())
      }
    })
  }

  const Test = () => {
    {data? console.log(data.role): console.log('eo co ji')}
  } 

  useEffect(() => {
    
    getRole();
    return () => {
      data
    }
  }, []);
    
      return(
        <View style={styles.container}>
        <StatusBar barStyle= {"light-content"}/>
        <Appbar.Header style={{backgroundColor: '#64b5f6'}}>
          <Appbar.Content title='Notification' style={styles.Header}/>
        </Appbar.Header>

        <Button title='test' onPress={Test()}/>
      </View>
      )
    
}

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    
  },
  Header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  });