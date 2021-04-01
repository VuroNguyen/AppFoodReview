import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { CheckBox } from 'react-native-elements'
import { AuthContext } from './AuthProvider';

const SignupCom = () => {

  const { register } = useContext(AuthContext);

  const [data, setData] = React.useState({
    email: '',
    password: '',
    password_confirm: '',
    check_textInputChange: false,
    secureTextEntry: true,
    secureTextEntry_confirm: true,
    checked: false,
  });

  // const [email, setEmail] = useState('');
  // const [check_textInputChange, setCheck_textInputChange] = useState(false);
  // const [password, setPassword] = useState('');
  // const [password_confirm, setPassword_confirm] = useState('');
  // const [secureTextEntry, setSecureTextEntry] = useState(true);
  // const [secureTextEntry_confirm, setSecureTextEntry_confirm] = useState(true);
  // const [checked, setChecked] = useState(false);

  textInputChange = (value) => {
    if (value.length !== 0) {
      setData({
        ...data,
        email: value,
        check_textInputChange: true
      });
    }
    else {
      setData({
        ...data,
        email: value,
        check_textInputChange: false
      });
    }
  }

  SecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    })
  }

  SecureTextEntry_confirm = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry
    });
  }

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
            placeholder="Input Your Email..."
            style={styles.textInput}
            onChangeText={(text) => textInputChange(text)}
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
            <TextInput      //Input Password
              placeholder="Enter your Password..."
              secureTextEntry={true}
              style={styles.textInput}
              value={data.password}
              onChangeText={(text) => setData({
                ...data,
                password: text
              })}
            />
            :
            <TextInput      //Input Password
              placeholder="Enter your Password..."
              style={styles.textInput}
              value={data.password}
              onChangeText={(text) => setData({
                ...data,
                password: text
              })}
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

        <Text style={[styles.text_footer, {
          marginTop: 35
        }]}>Confirm Password:</Text>
        <View style={styles.action}>
          <FontAwesome // Icon
            name='lock'
            color='#64b5f6'
            size={20}
          />
          {data.secureTextEntry_confirm ?
            <TextInput      //Input Password
              placeholder="Confirm Password..."
              secureTextEntry={true}
              style={styles.textInput}
              value={data.password_confirm}
              onChangeText={(text) => setData({
                ...data,
                password_confirm: text
              })}
            />
            :
            <TextInput      //Input Password
              placeholder="Confirm Password..."
              style={styles.textInput}
              value={data.password_confirm}
              onChangeText={(text) => setData({
                ...data,
                password_confirm: text
              })}
            />
          }
          <TouchableOpacity
            onPress={() => SecureTextEntry_confirm()}>
            {data.secureTextEntry_confirm ?
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

        <View style={styles.textPrivate}>
          <CheckBox
            checked={data.checked}
            onPress={() => setData({ ...data, checked: !data.checked })}
            containerStyle={{
              margin: -10,
              marginLeft: -10,
              marginRight: -10
            }}
          />
          <Text style={styles.color_textPrivate}>
            I Accept the application
              </Text>
          <Text style={[styles.color_textPrivate, {
            fontWeight: 'bold'
          }]}>
            {" "}
                Term of Services
              </Text>
          <Text style={styles.color_textPrivate}>
            {" "}
                and
              </Text>
          <Text style={[styles.color_textPrivate, {
            fontWeight: 'bold'
          }]}>
            {" "}
                Private Policy
              </Text>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => register(data.email, data.password)}>
            <LinearGradient
              colors={['#4c669f', '#3b5998']}
              style={styles.signIn}>
              <Text style={[styles.text_Sign, {
                color: 'white'
              }]}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  )

}

export default SignupCom;

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
    marginTop: 20
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

  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },

  color_textPrivate: {
    color: 'gray'
  }
});