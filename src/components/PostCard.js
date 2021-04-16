import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import StarRating from 'react-native-star-rating';

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
  Star
} from '../styles/FeedStyles';

import ProgressiveImage from './ProgressiveImage';

import {AuthContext} from '../AuthProvider';

import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const PostCard = ({item, onPress}) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  // likeIcon = item.liked ? 'heart' : 'heart-outline';
  // likeIconColor = item.liked ? '#2e64e5' : '#333';

  // if (item.likes == 1) {
  //   likeText = '1 Like';
  // } else if (item.likes > 1) {
  //   likeText = item.likes + ' Likes';
  // } else {
  //   likeText = 'Like';
  // }

  // if (item.comments == 1) {
  //   commentText = '1 Comment';
  // } else if (item.comments > 1) {
  //   commentText = item.comments + ' Comments';
  // } else {
  //   commentText = 'Comment';
  // }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          // console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
    return () => {
      userData
    }
  }, []);

  return (
    <Card key={item.id}>
      <UserInfo>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg ||
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
          }}
        />
        <UserInfoText>
          <TouchableOpacity onPress={onPress}>
            <UserName>
              {item.userName}
            </UserName>
          </TouchableOpacity>

          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
        <Star>
        <StarRating
        disabled={true}
        emptyStar={'star-o'}
        fullStar={'star'}
        halfStar={'star-half'}
        iconSet={'FontAwesome'}
        maxStars={5}
        rating={item.star}
        fullStarColor={'lightblue'}
        starSize={30}
      />
      </Star>
      </UserInfo>
      <PostText>{item.post}</PostText>
      {/* {item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : <Divider />} */}
      {item.postImg != null ? (
        <ProgressiveImage
          defaultImageSource={require('../images/default-img.jpg')}
          source={{uri: item.postImg}}
          style={{width: '100%', height: 250}}
          resizeMode="cover"
        />
      ) : (
        <Divider />
      )}
    </Card>
  );
};

export default PostCard;
