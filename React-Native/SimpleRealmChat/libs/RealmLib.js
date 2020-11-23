//
//  RealmLib.js
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
import Realm from "realm"; 
import Schema from '../config/Schema';
import Configure from '../config/Config' 

export const signup = (userEmail, userPassword) => {
  return new Promise((resolve, reject) => { 

    const appConfig = {
      id:  Configure.Realm.appId,
      timeout: 10000,
    };

    const app = new Realm.App(appConfig);
    if(app.currentUser) app.currentUser.logOut();
    
    app.emailPasswordAuth.registerUser(userEmail, userPassword).then(result => { 
      resolve(true)
    }).catch(err => {
      resolve(err)
    }) 
  })
}



export const login = (userEmail, userPassword) => {
  return new Promise((resolve, reject) => { 

    const appConfig = {
      id:  Configure.Realm.appId,
      timeout: 10000,
    };

    const app = new Realm.App(appConfig); 
    const credentials = Realm.Credentials.emailPassword(userEmail, userPassword);

    app.logIn(credentials).then(user => { 
      global.user = user; 
      resolve(user);
    }).catch(err => {
      reject(err);
    }) 
  })
}


export const openRealm = () => {

  return new Promise((resolve, reject) => {
    

    if(global.realm && global.privateRealm){
      resolve(global)
      return;
    }


    let configPublic = {
        schema:  [Schema.ChatEntry, Schema.UserProfile],
        sync: {
          user: global.user,
          partitionValue: Configure.Realm.publicPartition
        }
      }; 

      let configPrivate = {
        schema: [Schema.UserPrivateData, Schema.Connection],
        sync: {
          user: global.user,
          partitionValue: `${global.user.id}`
        }
    }; 
      
    try {

      Realm.open(configPublic).then(realm => {
        global.realm = realm;
         
        Realm.open(configPrivate).then(realmPrivate => { 

          global.privateRealm = realmPrivate;
          resolve({realm: realm, privateRealm: realmPrivate});

        }).catch(err => {
          reject(err);
        })

      }).catch(err => {
        reject(err);
      })
      
    } catch (error) { 
      reject(error);
    }
    
  })
}



export const openRealmChat = (chatPartition) => {

  return new Promise((resolve, reject) => { 

    let config = {
        schema:  [Schema.ChatEntry],
        sync: {
          user: global.user,
          partitionValue: chatPartition
        }
      }; 

    try {

      Realm.open(config).then(realm => { 
        global.chatRealm = realm;
        resolve(realm); 
      }).catch(err => {
        reject(err);
      })
      
    } catch (error) { 
      reject(error);
    }
    
  })
}



