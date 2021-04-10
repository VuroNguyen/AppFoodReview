import React from 'react';
import {View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from "./Home";
import FavoriteScreen from "./Favorite";
import AccountScreen from "./Account";
import NotificationScreen from './Notification';
import ProfileScreen from './Account_Components/Profile';
import EditProfileScreen from './Account_Components/EditProfile';
import ExploreScreen from './Explore';
import CardDetailsScreen from './CardDetail';
import ChatScreen from './Chat';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AccountStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen 
            name='Account'
            component={AccountScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
            name='Profile'
            component={ProfileScreen}
            options={{
                headerTitle: 'Profile',
                headerTitleAlign: 'center',
                headerRight: () => (
                    <View style={{marginRight: 10}}>
                      <MaterialCommunityIcons.Button
                        name="account-edit"
                        size={25}
                        backgroundColor='white'
                        color='black'
                        onPress={() => navigation.navigate('EditProfile')}
                      />
                    </View>
                  ),
            }}
        />
        <Stack.Screen 
            name='EditProfile'
            component={EditProfileScreen}
            options={{
                headerTitle: 'Edit Profile',
                headerTitleAlign: 'center',
            }}
        />
    </Stack.Navigator>
);

const HomeStack = ({navigation}) => {
    return (
    <Stack.Navigator>
        <Stack.Screen 
            name='HomeScreen'
            component={HomeScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
        name="CardDetails"
        component={CardDetailsScreen}
        options={({route}) => ({
          // title: route.params.title,
          headerBackTitleVisible: false,
          headerTitle: false,
          headerTransparent: true,
          headerTintColor: '#fff'
        })}
      />
      <Stack.Screen 
            name='ChatScreen'
            component={ChatScreen}
            options={({route}) => ({
                title: route.params.FoodLocation,
                headerBackTitleVisible: false,
              })}
        />
    </Stack.Navigator>
    )
}

export default class MainTabScreen extends React.Component {
    render() {
        return (
            
            <Tab.Navigator
            initialRouteName="Home"
            activeColor="blue"
            barStyle={{ backgroundColor: '#64b5f6' }}
            >
            <Tab.Screen
                name="HomeScreen"
                component={HomeStack}
                options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="ExploreScreen"
                component={ExploreScreen}
                options={{
                tabBarLabel: 'Explore',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="compass" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="FavoriteScreen"
                component={FavoriteScreen}
                options={{
                tabBarLabel: 'Favorite',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="heart" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                tabBarLabel: 'Notification',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="bell" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="AccountScreen"
                component={AccountStack}
                options={{
                tabBarLabel: 'account',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
                }}
            />
            
            </Tab.Navigator>
            
        );
    }
}
