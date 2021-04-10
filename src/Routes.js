import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './RootStack';
import MainTabScreen from './MainTab';
import MainAdTabScreens from './AdminScreens/MainAdScreens';
import MainOwnerTabScreens from './OwnerScreens/MainOwnerScreen';
import {AuthContext} from './AuthProvider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Routes = () => {

    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);
    const [data, setData] = useState(null);

     const getRole = async() => {
      const currenUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          
          setData(documentSnapshot.data())
          
        }
      })
      .catch(error => {
        console.log("Error:", error);
      })
    // setData(firestore().collection('users').doc(user.uid).get().documentSnapshot.data())
    //     console.log(data? 'co data': 'ko co data');
     }

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
        
      };

      useEffect(() => {
        
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);

      // useEffect(() => {
      //   getRole();
        
      // }, [data]);

      

      if (initializing) return null;
      if (user) {
        getRole();
      } 

    return (
        <NavigationContainer >
         
           {user && data ? data.role === 'admin' ?  <MainAdTabScreens/> : data.role ==='owner' ? <MainOwnerTabScreens/> : <MainTabScreen/> : <RootStack/>}
            
        </NavigationContainer>
    )
}

export default Routes;