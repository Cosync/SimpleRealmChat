 
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat' 
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ObjectId } from 'bson';
import AsyncStorage from '@react-native-community/async-storage';
import Configure from '../config/Config'; 
import * as RealmLib from '../libs/RealmLib'; 
import Loader from './Loader'; 

let chatPartition, chatRealm;

const ChatScreen = props => {

  
  global.currentScreenIndex = 'ChatScreen';
  global.user = global.user ? global.user : {};

  const [messages, setMessages] = useState([]); 
   

  useEffect(() => {
    if(!global.userProfile || !global.currentProfile || !global.currentProfile._id){
      props.navigation.navigate('ConnectionScreen');
      return;
    }

    
    openRealm();

    async function openRealm(){  

      global.appId = Configure.Realm.appId; 

      if(!global.user.id){ 

        let userEmail = await AsyncStorage.getItem('user_email');
        let userPassword = await AsyncStorage.getItem('user_password'); 

        let user = await RealmLib.login(userEmail, userPassword);
        AsyncStorage.setItem('user_id', user.id);  
        
      }
      
      chatPartition = global.user.id > global.currentProfile._id ?  global.currentProfile._id + "_" + global.user.id : global.user.id + "_" + global.currentProfile._id; 
      //if (global.user.id > global.currentProfile._id) chatPartition = global.currentProfile._id + "_" + global.user.id;

      if(chatRealm) chatRealm.removeAllListeners(); 

      chatRealm = await RealmLib.openRealmChat(chatPartition);

      // if(!global.userProfile || global.userProfile.name){
      //   let userProfile = global.privateRealm.objects(Configure.Realm.userProfile).filtered(`_id = '${global.user.id}'`); 
      //   global.userProfile = userProfile[0]; 
      //   if(global.userProfile) setUserName(global.userProfile.name);
      // }
      // else setUserName(global.userProfile.name);

      chatRealm.removeAllListeners(); 

      const results = chatRealm.objects(Configure.Realm.chatEntry); 
      results.removeListener(eventListener);

      let chatEntryList =  results.sorted("createdAt", true); 
      results.addListener(eventListener);  

      let fetchedMessages = []; 
      chatEntryList.forEach(message => {
        fetchedMessages.push(formatTextMessage(message))
      });

      setMessages(fetchedMessages); 
      
     
    } 

  }, [])

  const onSend = useCallback((messages = []) => {
    
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages)); 
  
    let item = messages[0]; 

    chatRealm.write(() => { 
      chatRealm.create(Configure.Realm.chatEntry, 
        { 
          _id: new ObjectId(),
          _partition:  chatPartition,
          name: global.userProfile.name, 
          uid: global.user.id,
          text: item.text,  
          createdAt: new Date().toISOString()
        }); 
    }); 
    
  }, [])




  function eventListener(itemList, changes) {

    
    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => { 
      let item = itemList[index]; 
      //alert(item.text)
      if(item.uid != global.user.id) setMessages(previousMessages => GiftedChat.append(previousMessages, formatTextMessage(item)))
      
    });
   
  }
 

  const formatTextMessage = (message) => { 
    let item = {
      _id: message._id, 
      text: message.text, 
      uid: message.uid,
      createdAt: new Date(message.createdAt).toLocaleString(),
      user: {
        _id: message.uid,
        name: message.name,
        avatar: 'https://cosync-assets.s3-us-west-1.amazonaws.com/logo.png',
      }
    };

    //if(message.uid != global.userProfile._id) item.user.avatar =  'https://placeimg.com/140/140/any';
    return item;
  };

 

  return (
     
        
     
        <GiftedChat
          renderLoading={() =>  <ActivityIndicator size="large" color="#0000ff"  animating={true} style={styles.activityIndicator}/>}
          messages={messages}
          renderUsernameOnMessage = {true}
          //isLoadingEarlier = {true}
          onSend={message => onSend(message)}
          user={{ _id: global.user.id}}/>

     
  )
}

export default ChatScreen;



const styles = StyleSheet.create({
   
  activityIndicator: {
    alignItems: 'center',
    height: 180,
  },
});