/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React, {useState} from 'react';
import { ObjectId } from 'bson';
//Import all required component
import { View, TextInput, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import Configure from '../config/Config'; 
import * as RealmLib from '../libs/RealmLib'; 
import Loader from './Loader'; 
import ListItem from './ListItem';
let listConnection = [];
let userProfile, userProfileHolder;

const ConnectionScreen = props => {

  global.currentScreenIndex = 'ConnectionScreen';
  let [loading, setLoading] = React.useState(true);
  let [profiles, setProfileItem] = React.useState([]); 
  
  React.useEffect(() => {

   
    async function fetchData(){

      let result = await RealmLib.openRealm();

      userProfile = await result.realm.objects(Configure.Realm.userProfile);//.filtered(`_id != '${global.user.id}'`);
      let list = [];
      userProfile.forEach(element => {  
        if(element._id == global.user.id) global.userProfile = element;
        else{ 
          list.push({
            id: element._id,
            _id: element._id,
            name: element.name
          })
        }
      });

      userProfileHolder = list;

      setProfileItem(list);

      listConnection = await result.privateRealm.objects(Configure.Realm.connection);
      
      // allConns.forEach(conn => {  
      //   if(conn._partition == global.user.id) { 
      //     listConnection.push(conn);
      //   }
      // });
      

     
      
      setLoading(false);  
    }
    
    setLoading(true);  
    fetchData();

  }, [])
   

   

  const profileClicked = async (item) => {
    setLoading(true);  
    global.currentProfile = item;

    let conn = listConnection.filter(element => element.friendUid == item._id);
    if(conn && conn.friendUid) props.navigation.navigate('ChatScreen');
    else{
      await global.user.functions.updateChatPartitions( global.user.id, item._id); 

      global.privateRealm.write(() => { 
        let conn = { 
          _id: new ObjectId(),
          _partition:  global.user.id,
          friendUid: item._id, 
          active: true,
          createdAt: new Date().toISOString()
        };
        listConnection.push(conn);
        global.privateRealm.create(Configure.Realm.connection, conn); 
      }); 

      setLoading(false); 

      props.navigation.navigate('ChatScreen');
    }
    
  }
  

  const filterConnection = async (value) => {
    const newData = userProfileHolder.filter(item => { 

      const itemData = item.name.toUpperCase(); 
      const textData = value.toUpperCase(); 
      return itemData.indexOf(textData) > -1;    
    });
    
    setProfileItem(newData);  
  }
 

  return (
   

    <View style={styles.mainBody}>

      <View>
        <Loader loading={loading} />
      </View>

        <View style={styles.SectionStyle}> 
        
              <TextInput
                      style={styles.inputStyle}
                      onChangeText={value => filterConnection(value)} 
                      placeholder="Search" 
                      autoCapitalize="none" 
                      returnKeyType="done"  
                      blurOnSubmit={false}
                      
                    />
        </View>
        <FlatList 
          data = {profiles} 
          renderItem={({item}) => ( 
            <ListItem
            item={item}  
            itemClicked = {profileClicked}
          />
           
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