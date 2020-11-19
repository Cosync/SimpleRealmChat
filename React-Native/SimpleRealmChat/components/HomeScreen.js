/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
//Import all required component
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = props => {

    alert('Home');
    global.currentScreenIndex = 'HomeScreen';
    let [user_id, setUserId] = React.useState('');

    let [user_email, setUserEmail] = React.useState('');

    AsyncStorage.getItem('user_id').then(id =>{
        setUserId(id); 
    })

    AsyncStorage.getItem('user_email').then(email =>{ 
        setUserEmail(email); 
    })

    const handleSubmitPress = () => {
       
        props.navigation.navigate('ChatScreen') 
    }
 

  return (
    <View style={styles.mainBody}>
        
        <Text style={{ fontSize: 23, marginTop: 10 }}>
            Wecome to Super Simple Chat App
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>User ID: {user_id}</Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>User Eamil: {user_email}</Text>


        <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitPress}>
            <Text style={styles.buttonTextStyle}>JOIN CHAT ROOM</Text>
        </TouchableOpacity>
        
    </View>
  );
};
export default HomeScreen; 

const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 60,
      backgroundColor: '#fff',
    },
    
    buttonStyle: {
      backgroundColor: '#4638ab',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#7DE24E',
      height: 40,
      width: 200,
      alignItems: 'center',
      borderRadius: 30,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,
      marginBottom: 20,
    },
    buttonTextStyle: {
      color: 'white',
      paddingVertical: 10,
      fontSize: 16,
    }, 
  });