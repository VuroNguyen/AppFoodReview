import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from './AuthProvider';

const SigninCom = ({navigation}) => {

    const {login} = useContext(AuthContext);

    const [data, setData] = React.useState({
      email: '',
      password: '',
      check_textInputChange: false,
      secureTextEntry: true,
      isValidUser: true,
      isValidPassword: true,
    });

    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [check_textInputChange, setCheck_textInputChange] = useState(false);
    // const [secureTextEntry, setSecureTextEntry] = useState(true);
    // const [isValidUser, setIsValidUser] = useState(true);
    // const [isValidPassword, setIsValidPassword] = useState(true);
  
  textInputChange = (value) => {
    if (value.length >= 11) {
      setData({
        ...data,
        email: value,
        check_textInputChange: true,      //set state of input text
        isValidUser: true                 // set valid state of input text
      });
    }
    else {
      setData({
        ...data,
        email: value,
        check_textInputChange: false,
        isValidUser: false
      });
    }
  }


  SecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    })
  }

 handleValidUser = (val) => {         //State of error message for username
    if (val.trim().length >= 11) {
      setData({
        ...data,
        isValidUser: true
      })
    } else {
      setData({
        ...data,
        isValidUser: false
      })
    }
  }

  handlePasswordChange = (val) => {
    if( val.trim().length >= 8 ) {
        setData({
            ...data,
            password: val,
            isValidPassword: true
        });
    } else {
        setData({
            ...data,
            password: val,
            isValidPassword: false
        });
    }
}

  disableBackButton = () => {
    BackHandler.exitApp();
    return true;
  }

  /*componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.disableBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.disableBackButton);
  }*/
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome to Food World!</Text>
        </View>

        <Animatable.View
          animation='fadeInUpBig'
          style={styles.footer}>
          <Text style={styles.text_footer}>Account:</Text>
          <View style={styles.action}>
            <FontAwesome    //Icon
              name='user-o'
              color='#64b5f6'
              size={20}
            />
            <TextInput      //Input Account
              placeholder="Your Email or Phone Number...."
              style={styles.textInput}
              onChangeText={(text) => textInputChange(text)}
              onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
            />
            {data.check_textInputChange ?
              <Animatable.View
                animation='bounceIn'>
                <Feather
                  name='check-circle'
                  color='green'
                  size={20}
                />
              </Animatable.View>
              : null}
          </View>

          {data.isValidUser ? null :
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>The username must be 11 characters long</Text>
            </Animatable.View>
          }

          <Text style={[styles.text_footer, {
            marginTop: 35
          }]}>Password:</Text>
          <View style={styles.action}>
            <FontAwesome // Icon
              name='lock'
              color='#64b5f6'
              size={20}
            />
            {data.secureTextEntry ?
              <TextInput                                //Input Password
                placeholder="Enter your Password..."
                secureTextEntry={true}                 // secureTextEntry = true means it can be seen
                style={styles.textInput}
                value={data.password}
                onChangeText={(text) => handlePasswordChange(text)} //Text asign to password
              />
              :
              <TextInput      //Input Password
                placeholder="Enter your Password..."
                style={styles.textInput}
                value={data.password}
                onChangeText={(text) => handlePasswordChange(text)} //Text asign to password
              />
            }
            <TouchableOpacity
              onPress={() => SecureTextEntry()}>
              {data.secureTextEntry ?
                <Feather
                  name='eye-off'
                  color='gray'
                  size={20}
                />
                :
                <Feather
                  name='eye'
                  color='gray'
                  size={20}
                />
              }
            </TouchableOpacity>
          </View>

          {data.isValidPassword ? null :
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>The password must be 8 characters long</Text>
            </Animatable.View>
          }

          <Text style={{ color: '#009bd1', marginTop: 15, marginLeft: 30 }}>Forgot Password?</Text>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => login(data.email, data.password) }>
              <LinearGradient                         //button Sign in here
                colors={['#4c669f', '#3b5998']}
                style={styles.signIn}>
                <Text style={[styles.text_Sign, {
                  color: 'white'
                }]}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
              style={[styles.signIn, {
                borderColor: '#4dc2f8',
                borderWidth: 1,
                marginTop: 15
              }]}>
              <Text style={[styles.text_Sign, { color: '#4dc2f8' }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    )
}

export default SigninCom;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64b5f6',
  },

  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },

  footer: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },

  text_header: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30
  },

  text_footer: {
    color: '#64b5f6',
    fontSize: 18
  },

  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },

  textInput: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: -10,
    color: '#64b5f6'
  },

  button: {
    alignItems: 'center',
    marginTop: 50
  },

  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },

  text_Sign: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  errorMsg: {
    fontSize: 13,
    color: "red"
  }
});