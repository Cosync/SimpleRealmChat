////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Cosync, Inc. All Rights Reserved.
// For questions about this license, you may write to mailto:info@cosync.io
//
//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Cosync, Inc., either version 3 of the License, or
//(at your option) any later version.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//
//You should have received a copy of the GNU General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
////////////////////////////////////////////////////////////////////////////

/**
 * © 2020, Cosync, Inc. All Rights Reserved.
 * 
 * @author Tola VOEUNG
 * 
 * @Editor Tola VOEUNG  
 * For questions about this license, you may write to mailto:info@cosync.io
*/ 
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
        resolve(realm); 
      }).catch(err => {
        reject(err);
      })
      
    } catch (error) { 
      reject(error);
    }
    
  })
}



