import React, {useContext} from 'react';
import { View, Text, Button,StyleSheet, StatusBar } from 'react-native';
import {Appbar} from 'react-native-paper';
import { AuthContext } from '../AuthProvider';


const AdSuggestScreen = ({navigation}) =>{

    const {logout} = useContext(AuthContext);
    
      return(
        <View style={styles.container}>
        <StatusBar barStyle= {"light-content"}/>
        <Appbar.Header style={{backgroundColor: '#64b5f6'}}>
          <Appbar.Content title='User Suggestions' style={styles.Header}/>
        </Appbar.Header>

        <Button title='sign out' onPress={()=>logout()}/>
      </View>
      )
    
}

export default AdSuggestScreen;

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