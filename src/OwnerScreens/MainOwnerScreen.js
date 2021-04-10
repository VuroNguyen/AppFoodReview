import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OwnerHomeScreen from './OwnerHome';
import OwnerChatScreen from './OwnerChat';
import ChatOwnerScreen from './ChatScreen';
import OwnerAccountScreen from './OwnerAccount';
import OwnerAddFoodLocationScreen from './OwnerAddFoodLocation';
import EditOwnerProfileScreen from './EditOwnerAccount';
import CardDetailsScreen from '../CardDetail';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const OwnerAccountStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen 
            name='OwnerAccount'
            component={OwnerAccountScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
            name='OwnerAddLocation'
            component={OwnerAddFoodLocationScreen}
            options={{
                headerTitle: 'Add Food Location',
                headerTitleAlign: 'center',
            }}
        />
        <Stack.Screen 
            name='EditOwnerAccount'
            component={EditOwnerProfileScreen}
            options={{
                headerTitle: 'Edit Owner Profile',
                headerTitleAlign: 'center',
            }}
        />
    </Stack.Navigator>
);

const OwnerChatStack = ({navigation}) => (
    <Stack.Navigator>
      <Stack.Screen name="OwnerChatScreen" component={OwnerChatScreen} />
      <Stack.Screen
        name="ChatOwnerScreen"
        component={ChatOwnerScreen}
        options={({route}) => ({
          title: route.params.userName,
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );

  const OwnerHomeStack = ({navigation}) => {
    return (
    <Stack.Navigator>
        <Stack.Screen 
            name='HomeScreen'
            component={OwnerHomeScreen}
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
    </Stack.Navigator>
    )
}

const MainOwnerTabScreens = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="blue"
            barStyle={{ backgroundColor: '#64b5f6' }}
        >
            <Tab.Screen
                name="Home"
                component={OwnerHomeStack}
                options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="OwnerChatScreen"
                component={OwnerChatStack}
                options={{
                tabBarLabel: 'Chat',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="comment-text-outline" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="OwnerAccount"
                component={OwnerAccountStack}
                options={{
                tabBarLabel: 'account',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
                }}
            />
        </Tab.Navigator>
    )
}

export default MainOwnerTabScreens;