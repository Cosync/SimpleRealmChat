 //
//  Schema.js
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

exports.ChatEntry = {
    "name":"ChatEntry",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": { "type": "string", "indexed": true }, 
        "uid": { "type": "string", "indexed": true }, 
        "name":{ "type": "string", "indexed": true }, 
        "text":{ "type": "string", "indexed": true }, 
        "createdAt": {  "type": "date" , "optional": true , "indexed": true }
    }
}; 



exports.UserProfile = {
    "name":"UserProfile",
    "primaryKey":"_id",
    "properties": {
        "_id": { "type": "string", "indexed": true }, 
        "_partition": { "type": "string", "indexed": true }, 
        "name":{ "type": "string", "indexed": true }
        
    }
}; 



exports.UserPrivateData = {
    "name":"UserPrivateData",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "string", "indexed": true }, 
        "_partition": { "type": "string", "indexed": true }, 
        "email":{ "type": "string", "indexed": true }, 
        "name":{ "type": "string", "indexed": true }
    }
}; 


exports.Connection = {
    "name":"Connection",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition":{ "type": "string", "indexed": true }, 
        "friendUid":{ "type": "string", "indexed": true }, 
        "active":{ "type": "bool", "indexed": true }
    }
}; 

  