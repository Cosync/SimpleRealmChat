/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
//Import all required component
import { View, TextInput, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import Configure from '../config/Config'; 
import * as RealmLib from '../libs/RealmLib'; 

const ConnectionScreen = props => {

  global.currentScreenIndex = 'ConnectionScreen';
  
  const [profiles, setProfileItem] = React.useState([
    {
      id: '1',
      _id: '1',
      name: 'name 1'
    },
    {
      id: '2',
      _id: '2',
      name: 'name 2'
    },
    {
      id: '3',
      _id: '3',
      name: 'name 3'
    },
    {
      id: '4',
      _id: '4',
      name: 'name 4'
    },
    { id: '5',
      _id: '5',
      name: 'name 5'
    },
  ]); 
 

  RealmLib.openRealm().then(result => {
   
    // let userProfile = result.realm.objects(Configure.Realm.userProfile).filtered(`_id != '${global.user.id}'`);

    // let list = [];
    // userProfile.forEach(element => {
    //   list.push({
    //     _id: element._id,
    //     name: element.name
    //   })
    // });
    // setProfileItem(list);

    //alert('ConnectionScreen open realm');
   
   
  }).catch(err => {
    alert('ConnectionScreen err ', err.message);
  })

    
    
    // let [user_id, setUserId] = React.useState('');

    // let [user_email, setUserEmail] = React.useState('');

    // AsyncStorage.getItem('user_id').then(id =>{
    //     setUserId(id); 
    // })

    // AsyncStorage.getItem('user_email').then(email =>{ 
    //     setUserEmail(email); 
    // })

    const handleSubmitPress = () => {
       
        props.navigation.navigate('ChatScreen') 
    }
 

  return (
    <View style={styles.mainBody}>
        <View style={styles.SectionStyle}> 
        
              <TextInput
                      style={styles.inputStyle}
                      //onChangeText={UserEmail => setUserEmail(UserEmail)} 
                      placeholder="Search" 
                      autoCapitalize="none" 
                      returnKeyType="done"  
                      blurOnSubmit={false}
                      
                    />
        </View>
        <FlatList 
          data = {profiles} 
          renderItem={({item}) => (
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listItemView}>
                <Text>{item.name}</Text>
              </View>
               
            </TouchableOpacity>
           
          )} 
               
        /> 
        
    </View>
  );
};

export default ConnectionScreen; 

const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
    },
    SectionStyle: {
      flexDirection: 'row',
      height: 40,
      marginTop: 20,
      marginLeft: 5,
      marginRight: 5,
      margin: 10,
    },
    inputStyle: {
      flex: 1,
      color: '#4638ab',
      paddingLeft: 15,
      paddingRight: 15,
      borderWidth: 1,
      borderRadius: 30,
      borderColor: '#4638ab',
    },
    listItem: {
      padding: 15,
      backgroundColor: '#f8f8f8',
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    listItemView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listItemText: {
      fontSize: 18,
    },
    checkedItemText: {
      fontSize: 18,
      textDecorationLine: 'line-through',
      color: 'green',
    },
    iconView: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: 70,
    },
    editItemInput: {
      padding: 0,
      fontSize: 18,
    },
  });