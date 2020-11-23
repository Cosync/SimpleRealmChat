 
//
//  ChatScreen.js
//  SimpleRealmChat
//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//
//  Created by Tola Voeung on 11/13/20.
//  Copyright © 2020 cosync. All rights reserved.
//

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
  const [loading, setLoadingMessages] = useState(false); 

  useEffect(() => {
   
    
    if(!global.userProfile || !global.currentProfile || !global.currentProfile._id){
      props.navigation.navigate('ConnectionScreen');
      return;
    } 
    
    openRealm();

    props.navigation.addListener('didFocus', () =>{ // it works on the second time or when come back to this screen
      setMessages([]);  
      openRealm();
    });
    
    async function openRealm(){  
      setLoadingMessages(true);
      global.appId = Configure.Realm.appId; 

      if(!global.user.id){ 

        let userEmail = await AsyncStorage.getItem('user_email');
        let userPassword = await AsyncStorage.getItem('user_password'); 

        let user = await RealmLib.login(userEmail, userPassword);
        AsyncStorage.setItem('user_id', user.id);  
        
      } 
      
      chatPartition = global.user.id > global.currentProfile._id ?  global.currentProfile._id + "_" + global.user.id : global.user.id + "_" + global.currentProfile._id; 
        

      if(global.chatRealm){
        global.chatRealm.removeAllListeners(); 
        global.chatRealm.close();
        global.chatRealm = null;
      }  

      await RealmLib.openRealmChat(chatPartition); 
      global.chatRealm.removeAllListeners(); 
     
     
      const results = global.chatRealm.objects(Configure.Realm.chatEntry); 
      results.removeListener(eventListener);

      let chatEntryList =  results.sorted("createdAt", true); 
      results.addListener(eventListener);  

      let fetchedMessages = []; 
      chatEntryList.forEach(message => {
        fetchedMessages.push(formatTextMessage(message))
      });
      
      setMessages(fetchedMessages); 
      setLoadingMessages(false);
     
    } 

  }, [])

  const onSend = useCallback((messages = []) => {
    
    //setMessages(previousMessages => GiftedChat.append(previousMessages, messages)); 
  
    let item = messages[0]; 

    global.chatRealm.write(() => { 
      global.chatRealm.create(Configure.Realm.chatEntry, 
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
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, formatTextMessage(item)))
      
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
     
    <View style={{ flex: 1 }}>

      <Loader loading={loading} />
     
        <GiftedChat
          //renderLoading={() =>  <ActivityIndicator size="large" color="#0000ff"  animating={true} style={styles.activityIndicator}/>}
          messages={messages}
          //renderUsernameOnMessage = {true}
          //isLoadingEarlier = {true}
          onSend={message => onSend(message)}
          user={{ _id: global.user.id}}/>
       
       </View>
  )
}

export default ChatScreen;



const styles = StyleSheet.create({
   
  activityIndicator: {
    alignItems: 'center',
    height: 180,
  },
});