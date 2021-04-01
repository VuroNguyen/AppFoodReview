import React, {useContext, useEffect, useState} from 'react';
import { Button } from 'react-native-elements';
import { View, StyleSheet, StatusBar } from 'react-native';
import {Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,} from 'react-native-paper';
import {AuthContext} from './AuthProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; //to make icons for apps
import { SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';


const AccountScreen = ({navigation}) =>  {
  
    const { user, logout } = useContext(AuthContext);
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
      }, []);
    
    return (

      <SafeAreaView style={styles.container}>
        
        <StatusBar barStyle={"light-content"} />
        
        <TouchableRipple onPress={()=> navigation.navigate('Profile')}>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15}} >
            <Avatar.Image 
              source={require('./images/blankuser.png')}
              size={80}
            />
            <View style={{marginLeft: 20}}>
              <Title style={[styles.title, {
                marginTop:15,
                marginBottom: 5,
              }]}>{userData && userData.name !== '' ? userData.name : 'User'}</Title>
              <Caption style={styles.caption}>{userData ? userData.email : null}</Caption>
            </View>
          </View>
        </View>
        </TouchableRipple>
  
        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{userData? userData.city: null}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{userData? userData.phone: null}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="map" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{userData? userData.address : null}</Text>
          </View>
        </View>
  
        <View style={styles.menuWrapper}>
          <TouchableRipple onPress={() => navigation.navigate('FavoriteScreen')}>
            <View style={styles.menuItem}>
              <Icon name="heart" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Like</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="plus-thick" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Add Your Suggestion Food Area</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="share-outline" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Invite Your Friends</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="email-edit-outline" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Feedback</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="email-edit-outline" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Term and Policy</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => logout()}>
            <View style={styles.menuItem}>
              <Icon name="logout" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
        </View>
      </SafeAreaView>
    )
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  buttonSpace: {
    marginTop: 10
  },
  Header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  versionText: {
    margin : 30,
    marginLeft: 155,
    color: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});

export default AccountScreen;