import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
//import AsyncStorage from '@react-native-community/async-storage';

import SplashCom from "./SplashCom";
import SigninCom from "./SigninCom";
import SignupCom from "./SignupCom";
import OnboardingScreen from "./OnboardingScreen";
import MainTabScreen from "./MainTab";
import AccountScreen from "./Account";


const StackNavigator = createStackNavigator({
  OnboardingScreen: {
    screen: OnboardingScreen,
    navigationOptions: {
        headerShown: false
      }
    },
    SplashScreen: {
        screen: SplashCom,
        navigationOptions: {
            headerShown: false
        }
    },
    SignInScreen: {
        screen: SigninCom,
        navigationOptions: {
            headerShown: false
        }
    },
    SignUpScreen: {
        screen: SignupCom,
        navigationOptions: {
            headerShown: false
        }
    },
    MainTabScreen: {
      screen: MainTabScreen,
      navigationOptions: {
          headerShown: false
      }
  },
  AccountScreen: {
    screen: AccountScreen,
    navigationOptions: {
        headerShown: false
    }
},
    
});

export default createAppContainer(StackNavigator);