import React, { useContext, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import { View, Text, Button, StyleSheet, StatusBar, Image, TextInput, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { AuthContext } from '../AuthProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


const ProfileScreen = ({ navigation }) => {

  const { user } = useContext(AuthContext);
  const [isPress, setPress] = useState(false);
  const [showPO, setShowPO] = useState(false);
  const [userData, setUserData] = useState(null);
  // const [image, setImage] = useState(null);

  const [data, setData] = useState({
    currentPassword: '',
    newPassword: '',
  });

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

  const PressCheck = () => {
    setPress(!isPress)
    if (isPress === true) {
      setPress({ isPress: false })
      console.log('pressed');
    }
  }

  const ModalPopupShow = () => {
    setShowPO(true)
  }

  const ModalPopupClose = () => {
    setShowPO(false)
  }

  

  const onChangePasswordPress = () => {

    setShowPO(false)

    const emailCred = firebase.auth.EmailAuthProvider.credential(
      user.email, data.currentPassword);
    firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
      .then(() => {
        // User successfully reauthenticated.
        firebase.auth().currentUser.updatePassword(data.newPassword).then(() => {

          console.log('Password has changed');
        }).catch((e) => {
          // Handle error.
          console.log('error', e);
        });
      }).catch(error => {
        console.log('Error:', error);
      });

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* <ImageBackground style={styles.userImg} imageStyle={{ borderRadius: 80 }} source={require('../images/blankuser.png')}>
          <MaterialCommunityIcons onPress={() => console.log('hehe')} name='camera' size={25} />
        </ImageBackground>

        <View style={styles.userNameEdit}>
          <Text style={styles.userName}>{user.email}</Text>
          <MaterialCommunityIcons onPress={() => console.log('edit ten nha')} name='square-edit-outline' size={20} />
        </View>

        <Animatable.Text onPress={PressCheck} animation={isPress ? '' : 'flash'} style={styles.editText}>Update</Animatable.Text>

        <View style={styles.Spacing}>
          <Text style={styles.leftText}>Email:</Text>
          <TextInput multiline placeholder='Email...' style={styles.inputText}>hehe</TextInput>
        </View>

        <View style={styles.SpacingNext}>
          <Text style={styles.leftText}>Address:</Text>
          <TextInput multiline placeholder='Address...' style={styles.inputText}>hehe</TextInput>
        </View>

        <View style={styles.SpacingNext}>
          <Text style={styles.leftText}>Phone:</Text>
          <TextInput multiline placeholder='Phone Number...' style={styles.inputText}>hehe</TextInput>
        </View> */}

        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri : userData ? userData.userImg || 'https://www.quartzmasters.com/wp-content/uploads/2017/03/article-user-blank.jpg' : 'https://www.quartzmasters.com/wp-content/uploads/2017/03/article-user-blank.jpg'}}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderRadius: 15 }}
            />
          </View>
          <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
            {userData && userData.name !== '' ? userData.name : 'User'}
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.name : ''}
            style={
              styles.textInput
              }
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" size={20} />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            value={userData ? userData.phone : ''}
            style={
              styles.textInput
              }
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="map" size={20} />
          <TextInput
            placeholder="Address"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.address : ''}
            style={
              styles.textInput
              }
          />
        </View>
        <View style={styles.action}>
          <Icon name="map-marker-outline" size={20} />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.city : ''}
            style={
              styles.textInput
            }
          />
        </View>

        <View style={styles.Spacing}>
          <TouchableOpacity
            style={styles.changePassword}
            onPress={() => ModalPopupShow()}>
            <LinearGradient                         //button Sign in here
              colors={['#4c669f', '#3b5998']}
              style={styles.changePassword}>
              <Text style={[styles.text_button, {
                color: 'white'
              }]}>Change Password</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={showPO}
          animationType='fade'
        >
          <View style={styles.outModal}>
            <View style={styles.modal}>
              <View>
                <TextInput onChangeText={(text) => setData({ ...data, currentPassword: text })} placeholder='Current Password...' style={{ borderBottomWidth: 0.5 }} />
              </View>
              <View style={styles.SpacingModal}>
                <TextInput onChangeText={(text) => setData({ ...data, newPassword: text })} placeholder='New Password...' style={{ borderBottomWidth: 0.5 }} />
              </View>
              <View style={styles.SpacingModal}>
                <TextInput placeholder='Confirm New Password...' style={{ borderBottomWidth: 0.5 }} />

                <TouchableOpacity
                  style={styles.changePassword}
                  onPress={() => onChangePasswordPress()}>
                  <LinearGradient                         //button Sign in here
                    colors={['#4c669f', '#3b5998']}
                    style={styles.changePassword}>
                    <Text style={[styles.text_button, {
                      color: 'white'
                    }]}>Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.changePassword}
                  onPress={() => ModalPopupClose()}>
                  <LinearGradient                         //button Sign in here
                    colors={['#4c669f', '#3b5998']}
                    style={styles.changePassword}>
                    <Text style={[styles.text_button, {
                      color: 'white'
                    }]}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
              </View>
            </View>
          </View>
        </Modal>

        <View style={{ height: 100, width: '100%' }} />

      </ScrollView>
    </SafeAreaView>
  )

}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  userNameEdit: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  Spacing: {
    marginTop: 20,
    borderTopWidth: 1,
    width: '100%',
    flexDirection: 'row',
  },
  SpacingModal: {
    marginTop: 20,
  },
  SpacingNext: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
  },
  inputText: {
    marginTop: 10,
    borderBottomWidth: 1,
    width: '80%',
    height: 40,
    fontSize: 18,
  },
  editText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
    color: 'blue',
    alignSelf: 'flex-end'
  },
  leftText: {
    alignSelf: 'center',
    fontSize: 18,
  },
  changePassword: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },

  text_button: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  outModal: {
    flex: 1,
    backgroundColor: '#000000aa'
  },

  modal: {
    backgroundColor: 'white',
    margin: 60,
    marginBottom: 180,
    marginTop: 100,
    padding: 50,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});