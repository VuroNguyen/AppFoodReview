import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdHomeScreen from './AdHome';
import AdSuggestScreen from './AdSuggestScreen';
import AdAccountScreen from './AdAccount';
import AddFoodLocationScreen from './AdAddFoodLocation';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AdAccountStack = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen 
            name='AdAccount'
            component={AdAccountScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
            name='AddLocation'
            component={AddFoodLocationScreen}
            options={{
                headerTitle: 'Add Food Location',
                headerTitleAlign: 'center',
            }}
        />
    </Stack.Navigator>
);

const MainAdTabScreens = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="blue"
            barStyle={{ backgroundColor: '#64b5f6' }}
        >
            <Tab.Screen
                name="Home"
                component={AdHomeScreen}
                options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="AdSuggestScreen"
                component={AdSuggestScreen}
                options={{
                tabBarLabel: 'User Suggestion',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="bell" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="AdAccount"
                component={AdAccountStack}
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

export default MainAdTabScreens;