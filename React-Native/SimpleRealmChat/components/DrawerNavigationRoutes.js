 
import React from 'react';

//Import Navigators
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

//Import External Screens
import ConnectionScreen from './ConnectionScreen';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';  
import CustomSidebarMenu from './CustomSidebarMenu';
import NavigationDrawerHeader from './NavigationDrawerHeader';

const FirstActivity_StackNavigator = createStackNavigator({
  First: {
    screen: ConnectionScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Connection Screen',
      headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#307ecc',
      },
      headerTintColor: '#fff',
    }),
  },
});


const SecondActivity_StackNavigator = createStackNavigator({
  First: {
    screen: ChatScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Chat Screen',
      headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#307ecc',
      },
      headerTintColor: '#fff',
    }),
  },
});
 


const DrawerNavigatorRoutes = createDrawerNavigator(
  {
    ConnectionScreen: {
      screen: FirstActivity_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Connection Screen',
      },
    },
    ChatScreen: {
      screen: SecondActivity_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Chat Screen',
      },
    },
    // SettingsScreen: {
    //   screen: ThirdActivity_StackNavigator,
    //   navigationOptions: {
    //     drawerLabel: 'Setting Screen',
    //   },
    // },
  },
  {
    contentComponent: CustomSidebarMenu,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  }
);
export default DrawerNavigatorRoutes;