import Schema from '../config/Schema';
import Realm from "realm"; 
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat' 
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ObjectId } from 'bson';
import AsyncStorage from '@react-native-community/async-storage';
import Configure from '../config/Config'; 
import * as RealmLib from '../libs/RealmLib'; 

const ChatScreen = () => { 

  global.currentScreenIndex = 'ChatScreen';
  global.user = global.user ? global.user : {};

  const [messages, setMessages] = useState([]); 
  const [userName, setUserName] = useState('');

  useEffect(() => {


    openRealm();

    async function openRealm(){  

      global.appId = Configure.Realm.appId; 

      if(!global.user.id){ 

        let userEmail = await AsyncStorage.getItem('user_email');
        let userPassword = await AsyncStorage.getItem('user_password'); 

        let user = await RealmLib.login(userEmail, userPassword);
        AsyncStorage.setItem('user_id', user.id);  
        
      } 
      
      if(!global.realm) await RealmLib.openRealm();

      if(!global.userData || global.userData.name){
        let userData = global.privateRealm.objects(Configure.Realm.userData).filtered(`uid = '${global.user.id}'`); 
        global.userData = userData[0]; 
        if(global.userData) setUserName(global.userData.name);
      }
      else setUserName(global.userData.name);

      global.realm.removeAllListeners();  
      const results = global.realm.objects(Configure.Realm.chatTable); 
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

    if(!global.realm) return;

    let item = messages[0];
    global.realm.write(() => { 
      global.realm.create(Configure.Realm.chatTable, 
        { 
          _id: new ObjectId(),
          _partition: Configure.Realm.partition,
          name: global.userData.name, 
          text: item.text,  
          createdAt: new Date().toISOString()
        }); 
    });


    
  }, [])




  function eventListener(itemList, changes) {

    
    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => { 
      let item = itemList[index]; 
      if(item.name != global.userData.name) setMessages(previousMessages => GiftedChat.append(previousMessages, formatTextMessage(item)))
      
    });
   
  }
 

  const formatTextMessage = (message) => { 
    let item = {
      _id: message._id, 
      text: message.text, 
      createdAt: new Date(message.createdAt).toLocaleString(),
      user: {
        _id: message.name,
        name: message.name,
        avatar: 'https://cosync-assets.s3-us-west-1.amazonaws.com/logo.png',
      }
    };

    if(message.name != global.userData.name) item.user.avatar =  'https://placeimg.com/140/140/any';
    return item;
  };

 

  return (
    
    <GiftedChat
      renderLoading={() =>  <ActivityIndicator size="large" color="#0000ff"  animating={true} style={styles.activityIndicator}/>}
      messages={messages}
      renderUsernameOnMessage = {true}
      onSend={messages => onSend(messages)}
      user={{ _id: userName}}/>
  )
}

export default ChatScreen;



const styles = StyleSheet.create({
   
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});