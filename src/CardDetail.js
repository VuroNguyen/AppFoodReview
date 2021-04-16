import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  ImageHeaderScrollView,
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AuthContext } from './AuthProvider';
import { Container } from './styles/FeedStyles';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

import StarRating from 'react-native-star-rating';
import PostCard from './components/PostCard';

import ImagePicker from 'react-native-image-crop-picker';

import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from './styles/AddPost';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIN_HEIGHT = 55;
const MAX_HEIGHT = 350;

const CardDetailsScreen = ({ route, navigation }) => {

  const itemData = route.params.itemData;

  const [userData, setUserData] = useState(null);
  const [showPO, setShowPO] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const navTitleView = useRef(null);

  const [starCount, setStarCount] = useState(0);
  const [totalRate, setTotalRate] = useState([]);
  const [averageRate, setAverageRate] = useState(0);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {

    getRole();
    return () => {
      userData
    }
  }, []);

  const getRole = async () => {
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
  }

  const fetchLiked = async () => {

    try {
      // const [initialLike, setInitialLike] = useState(false);

      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('liked')
        .doc(itemData.id)
        .get()
        .then((querySnapshot) => {
          const { liked } = querySnapshot.data();
          setIsLike(liked);
        })

    } catch (e) {
      console.log(e);
    }
  }

  // const fetchRate = async () => {

  //   try {
  //     const list = [];

  //     await firestore()
  //       .collection('foodcards')
  //       .doc(itemData.id)
  //       .collection('posts')
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {
  //           const {star} = doc.data();
  //           list.push({star})
  //         })
  //       })
  //       setTotalRate(list);
  //       console.log('Rate',totalRate);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('foodcards')
        .doc(itemData.id)
        .collection('posts')
        .get()
        .then((querySnapshot) => {
          console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              post,
              postImg,
              postTime,
              star,
            } = doc.data();
            list.push({
              id: doc.id,
              userName: userData? userData.name : 'User',
              userImg: userData? userData.userImg : null,
              postTime: postTime,
              post,
              postImg,
              star,
            });
          });
        });

      setPosts(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  };

  // const RateCalculate = () => {
  // //  const average = totalRate.map((item) => {
  // //     const rate = parseInt(item);
  // //     const ratePlus = 0;
  // //     ratePlus += rate;
  // //     return ratePlus;
  // //   })
  // var ratePlus = 0;
  //   totalRate.forEach(item => {
  //     var rate = parseInt(item);
      
  //     ratePlus += rate;
  //     setAverageRate(parseFloat(ratePlus/totalRate.length))
  //   });
    

  //   firestore()
  //       .collection('foodcards')
  //       .doc(itemData.id)
  //       .update({
  //         ratings: totalRate,
  //       })
  //       .then(() => {
  //         console.log('rate updated')
  //       })
  //       .catch(error => {
  //         console.log("Error: ", error)
  //       })
  // }

  useEffect(() => {
    fetchLiked();
    fetchPosts();
    // fetchRate();
    // RateCalculate();
  }, [])

  useEffect(() => {
    fetchLiked();
  }, [isLike])

  useEffect(() => {
    fetchPosts();
    // fetchRate();
    // RateCalculate();
  }, [loading])

  //Set like state change but it is reverse due to the firebase data
  const LikeChange = () => {
    setIsLike(!isLike)
    console.log(isLike)

    saveLikedState();
  }

  const saveLikedState = () => {
    //set user liked state
    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('liked')
      .doc(itemData.id)
      .set({
        liked: !isLike,
      })
      .then(() => {

        console.log('Like Updated!');
      })
      .catch(error => {
        console.log("error:", error)
      })

    //check if true or false so we can incre or decre the likes
    if (isLike == false) {
      firestore()
        .collection('foodcards')
        .doc(itemData.id)
        .update({
          likes: firestore.FieldValue.increment(1),
        })
        .then(() => {
          console.log('add successed')
        })
        .catch(error => {
          console.log("Error: ", error)
        })
    } else {
      firestore()
        .collection('foodcards')
        .doc(itemData.id)
        .update({
          likes: firestore.FieldValue.increment(-1),
        })
        .then(() => {
          console.log('decrese successed')
        })
        .catch(error => {
          console.log("Error: ", error)
        })
    }
  }

  const ModalPopupShow = () => {
    setShowPO(true)
  }

  const ModalPopupClose = () => {
    setShowPO(false)
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const handleChooseImage = () => {
    Alert.alert(
      'Choose Your Image',
      'choose your method to input the image',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Choose from Library',
          onPress: () => choosePhotoFromLibrary(),
        },
        {
          text: 'Take Camera',
          onPress: () => takePhotoFromCamera(),
        }
      ]
    )
  }

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firestore()
      .collection('foodcards')
      .doc(itemData.id)
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        star: starCount,
      })
      .then(() => {
        console.log('Post Added!');
        Alert.alert(
          'Post published!',
          'Your post has been published Successfully!',
        );
        setPost(null);
      })
      .catch((error) => {
        console.log('Something went wrong with added post to firestore.', error);
      });

      firestore()
        .collection('foodcards')
        .doc(itemData.id)
        .update({
          reviews: firestore.FieldValue.increment(1),
        })
        .then(() => {
          console.log('Review +1')
        })
        .catch(error => {
          console.log("Error: ", error)
        })

        setShowPO(false);
  }

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`postphotos/${filename}`);
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

  const onStarRatingPress = (rating) => {
    setStarCount(rating)
  }

  const ListHeader = () => {
    return null;
  };

  const Test = () => {
    console.log(isLike)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />

      <ImageHeaderScrollView
        maxHeight={MAX_HEIGHT}
        minHeight={MIN_HEIGHT}
        maxOverlayOpacity={0.6}
        minOverlayOpacity={0.3}
        renderHeader={() => (
          <Image source={{ uri: itemData.foodCardImg }} style={styles.image} />
        )}
        renderForeground={() => (
          <View style={styles.titleContainer}>
            <Text style={styles.imageTitle}>{itemData.title}</Text>
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View style={styles.navTitleView} ref={navTitleView}>
            <Text style={styles.navTitle}>{itemData.title}</Text>
          </Animatable.View>
        )}>
        <TriggeringView
          style={styles.section}
          onHide={() => navTitleView.current.fadeInUp(200)}
          onDisplay={() => navTitleView.current.fadeOut(100)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.title}>Overview</Text>
            <View style={styles.contactBtn}>
              {userData ? userData.role === '' ?
                <Button title='Contact' onPress={() => navigation.navigate('ChatScreen', { FoodLocation: itemData.title })} />
                : null : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={() => LikeChange()} style={styles.Likebtn}>
                {isLike ?
                  <FontAwesome name="heart" size={24} color="#FF6347" />
                  :
                  <FontAwesome name="heart-o" size={24} color="#FF6347" />}
              </TouchableOpacity>
              <Text style={{ fontSize: 18, marginLeft: 5 }}>{itemData.likes}</Text>
            </View>
          </View>
        </TriggeringView>
        <View style={[styles.section, styles.sectionLarge]}>
          <Text style={styles.sectionContent}>{itemData.description}</Text>
          <Text style={[styles.sectionContent, { borderTopWidth: 0.5, marginTop: 300 }]}>Price:{itemData.price}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Menu Image</Text>
        </View>
        <View style={styles.section}>
          <Image source={{ uri: itemData.menuImg }} style={styles.image} />
        </View>

        {/* <View style={styles.contactBtn}>
              {userData ? userData.role === '' ?
                <Button title='Contact' onPress={() => Test()} />
                : null: null}
            </View> */}

        <View style={[styles.section, { height: 250 }]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={{
              latitude: itemData.coordinate.latitude,
              longitude: itemData.coordinate.longitude,
              latitudeDelta: 0.00864195044303443,
              longitudeDelta: 0.000142817690068,
            }}>
            <MapView.Marker
              coordinate={itemData.coordinate}
              image={require('./images/map_marker.png')}
            />
          </MapView>
        </View>

        <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Button title='Add Comment' color='#64b5f6' style={[styles.title]} onPress={() => ModalPopupShow()} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ marginRight: 5, fontSize: 16 }}>Rate:</Text>
            <FontAwesome name="star" size={20} color="#FF6347" />
            <Text style={{ marginHorizontal: 2 }}>{itemData.ratings}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ marginRight: 5, fontSize: 16 }}>Reviews:</Text>
            <Text>({itemData.reviews})</Text>
          </View>

        </View>
        <Modal
          transparent={true}
          visible={showPO}
          animationType='fade'
        >
          <View style={styles.outModal}>
            <View style={styles.modal}>

            <StarRating
        disabled={false}
        emptyStar={'star-o'}
        fullStar={'star'}
        halfStar={'star-half'}
        iconSet={'FontAwesome'}
        maxStars={5}
        rating={starCount}
        selectedStar={(rating) => onStarRatingPress(rating)}
        fullStarColor={'lightblue'}
      />

          <InputField
            placeholder="What's on your mind?"
            multiline
            numberOfLines={4}
            value={post}
            onChangeText={(content) => setPost(content)}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={{width: 100}} onPress={()=> handleChooseImage()}>
              <Text style={{borderWidth: 0.5}}>Add Image</Text>
            </TouchableOpacity>
            <Image 
            source={{uri: image}}
              style={{ height: 150, width: 150 }}
              />
          </View>
              <View style={styles.buttonModal}>
                <TouchableOpacity
                  style={styles.sub_can_btn}
                  onPress={() => ModalPopupClose()}>
                  <LinearGradient                         //button Sign in here
                    colors={['#4c669f', '#3b5998']}
                    style={styles.sub_can_btn}>
                    <Text style={[styles.text_button, {
                      color: 'white'
                    }]}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sub_can_btn}
                  onPress={() => submitPost()}>
                  <LinearGradient                         //button Sign in here
                    colors={['#4c669f', '#3b5998']}
                    style={styles.sub_can_btn}>
                    <Text style={[styles.text_button, {
                      color: 'white'
                    }]}>Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.section}>
          
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <PostCard
                  item={item}
                />
              )}
              keyExtractor={(item) => item.id}
              // ListHeaderComponent={ListHeader}
              // ListFooterComponent={ListHeader}
              showsVerticalScrollIndicator={false}
            />
         
        </View>
      </ImageHeaderScrollView>
      
    </View>
  )

}

export default CardDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: MAX_HEIGHT,
    width: Dimensions.get('window').width,
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    fontSize: 16,
    textAlign: 'justify',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  categoryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FF6347',
    borderRadius: 20,
    margin: 10,
    padding: 10,
    paddingHorizontal: 15,
  },
  category: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 24,
  },
  navTitleView: {
    height: MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 5,
    opacity: 0,
  },
  navTitle: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  sectionLarge: {
    minHeight: 150,
  },
  contactBtn: {
    opacity: 0.8,
    marginLeft: 120,
  },
  Likebtn: {
    marginLeft: 10,
  },
  outModal: {
    flex: 1,
    backgroundColor: '#000000aa'
  },

  modal: {
    backgroundColor: 'white',
    margin: 35,
    marginBottom: 150,
    marginTop: 120,
    marginRight: 50,
    padding: 50,
    borderRadius: 10,
    flex: 1,

    position: 'absolute',
  },
  sub_can_btn: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonModal: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }
});