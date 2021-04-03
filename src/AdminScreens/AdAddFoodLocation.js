import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert, StatusBar,
  ScrollView
} from 'react-native';
import { AuthContext } from '../AuthProvider';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import ImagePicker from 'react-native-image-crop-picker';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


const AddFoodLocationScreen = ({ navigation }) => {

  const { logout } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [menuimage, setMenuImage] = useState(null);
  const [isBanner, setIsBanner] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [coord, setCoord] = useState({
    coordinate: {
      latitude: null,
      longtitude: null,
    }
  })

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const imgname = filename.split('.').slice(0, -1).join('.');
    filename = imgname + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`foodcard/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
      { isBanner ? setImage(image.path) : setMenuImage(image.path) }
      bs.current.snapTo(1);
    }).catch(error => {
      console.log('Error:', error);
    });
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
      { isBanner ? setImage(image.path) : setMenuImage(image.path) }
      bs.current.snapTo(1);
    }).catch(error => {
      console.log('Error:', error)
    });
  }

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const bs = React.createRef();
  const fall = new Animated.Value(1);

  const checkIsBanner = () => {
    setIsBanner(true);
  };

  const checkIsMenuImage = () => {
    console.log('nay là menu nha')
    setIsBanner(false);
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View style={{
        margin: 20,
        opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
      }}>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => { bs.current.snapTo(0); checkIsBanner() }}>
            <View
              style={{
                height: 100,
                width: 200,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={{
                  uri: image
                    ? image
                    : 'https://firebasestorage.googleapis.com/v0/b/review-food-app.appspot.com/o/blank-img.jpg?alt=media&token=7adcae5d-2031-420f-ae71-b8d02534a53b'
                }}
                style={{ height: 100, width: 200 }}
                imageStyle={{ borderRadius: 15 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="camera"
                    size={35}
                    color="black"
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>
            Input Your Banner Image
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Input The Food Location Name Title/Name..."
            placeholderTextColor="#666666"
            autoCorrect={false}
            onChangeText={(txt) => { }}
            style={
              styles.textInput
            }
          />
        </View>

        <View style={styles.action}>
          <Icon name="cash" size={20} />
          <TextInput
            placeholder="Average Money..."
            placeholderTextColor="#666666"
            autoCorrect={false}
            onChangeText={(txt) => { }}
            style={
              styles.textInput
            }
          />
        </View>

        <View style={styles.action}>
          {/* <Icon name="card-text-outline" size={20} /> */}
          <TextInput
            placeholder="Add Descriptions..."
            placeholderTextColor="#666666"
            autoCorrect={false}
            onChangeText={(txt) => { }}
            style={[
              styles.textInput
            ], { height: 80, width: '90%', borderWidth: 1 }}
          />
        </View>

        <View style={styles.action}>
          <Text>
            Menu Image:
              </Text>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => { bs.current.snapTo(0); checkIsMenuImage() }}>
              <View style={{
                height: 100,
                width: 300,
                borderRadius: 15,
                borderWidth: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <ImageBackground
                  source={{
                    uri: menuimage
                      ? menuimage
                      : 'https://firebasestorage.googleapis.com/v0/b/review-food-app.appspot.com/o/Blank-banner.png?alt=media&token=ac9027d5-c4c3-41a7-9f62-ee4e5e7eb475'
                  }}
                  style={{ height: 100, width: 300 }}
                  imageStyle={{ borderRadius: 15, resizeMode: 'cover' }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="camera"
                      size={35}
                      color="black"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          </View>


        </View>

        <TouchableOpacity style={styles.commandButton} onPress={() => handleUpdate()}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  )

}

export default AddFoodLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowOffset: { width: -1, height: -3 },
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