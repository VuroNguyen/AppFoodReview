import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from 'react-native' ; // import components
import * as Animatable from 'react-native-animatable'; //import animatable component to make animated components.
import LinearGradient from 'react-native-linear-gradient'; //to make nice button
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; //to make icons for apps

export default class SplashCom extends React.Component{
  render(){
    return(
      //App container
      <View style={styles.container}> 
        <StatusBar barStyle= 'light-content' backgroundColor= '#64b5f6'/> 

        <View style={styles.header}>
            <Animatable.Image
                animation= 'bounceIn'                             //bounce effect
                duration={2000}                                   //animated duration = 2 seconds.
                source={require("./images/sample2.png")}      // Image source
                style= {styles.logo}                              //Style for the Logo
                resizeMode= {'stretch'}                           //Stretch the image
            />
        </View>
        
        <Animatable.View                                //Create Animation for all footer
        style={styles.footer}
        animation= "fadeInUpBig"                        //Fade in animation for footer
        >
        <Text style={styles.title}>Get your favorite food now!!!</Text>
        <Text style={styles.text}>Sign in with Account</Text>

        <View style={styles.button}>
          <TouchableOpacity               // press button Lets Go function
          onPress={() => this.props.navigation.navigate("SignInScreen")}>
            <LinearGradient 
            colors= {['#4c669f', '#3b5998']}
            style={styles.signIn}>
              <Text style={styles.textSign}>Let's Go!</Text>
              <MaterialIcons                     // Icons Config
                name= "navigate-next"
                color= "white"
                size= {20}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </Animatable.View>
      </View>
    )
  }
}

const {height} = Dimensions.get('screen');
const height_logo = height * 0.7 * 0.4;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#64b5f6',
    },

    header: {
        flex: 2,
        justifyContent: 'center',
        alignContent: 'center'
    },

    footer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },

    logo: {
        width: height_logo, 
        height: height_logo,
        alignSelf: 'center',
        borderRadius: 100
    },

    title: {
      color: '#64b5f6',
      fontWeight: 'bold',
      fontSize: 26
    },

    text: {
      color: 'gray',
      marginTop: 5
    },

    button:{
      alignItems: 'flex-end',
      marginTop: 30
    },

    signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
    },

    textSign: {
      color: 'white',
      fontWeight: 'bold'
    }
})
