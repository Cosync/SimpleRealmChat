//
//  ChatRealmManager.swift
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
//  Created by Richard Krueger on 7/20/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import Foundation
import RealmSwift

enum ChatError: Error {
    case openRealmFailed
    case RealmIsNill
    case invalidPartitionValue
    case userNotLoggedIn

    var message: String {
        switch self {
        case .openRealmFailed:
            return "open failed on chat Realm"
        case .RealmIsNill:
            return "chat Realm is nil"
        case .invalidPartitionValue:
            return "invalid partition value for chat Realm"
        case .userNotLoggedIn:
            return "user is not logged in"
        }
    }
}

class ChatRealm {
    var friendUid: String?
    var realm: Realm! = nil
    
    var currentUserId: String? {
        return RealmManager.shared.currentUserId
    }
    
    var chatPartition: String? {
        get {
            if  let currentUserId = self.currentUserId,
                let friendUid = self.friendUid {
                if currentUserId < friendUid {
                    return currentUserId + "_" + friendUid
                } else {
                    return friendUid + "_" + currentUserId
                }
            }
            return nil
        }
    }
    
    var isInitialized: Bool {
        return self.realm == nil ? false : true
    }
    
    convenience init(friendUid: String) {
        self.init()
        self.friendUid = friendUid
    }
    
    func initRealm(onCompletion completion: @escaping (Error?) -> Void) {
        
        if self.realm != nil {
            completion(nil)
        } else {
            if  let user = RealmManager.shared.app.currentUser {
                if let chatPartition = self.chatPartition {
                    Realm.asyncOpen(configuration: user.configuration(partitionValue: chatPartition),
                    callback: { (maybeRealm, error) in
                        guard error == nil else {
                            completion(ChatError.openRealmFailed)
                            return
                        }
                        guard let realm = maybeRealm else {
                            completion(ChatError.RealmIsNill)
                            return
                        }
                        // realm opened
                        self.realm = realm
                        
                        completion(nil)
                    })

                }
                else {
                    completion(ChatError.invalidPartitionValue)
                }
            } else {
                completion(ChatError.userNotLoggedIn)
            }
        }
        
    }
}

class ChatRealmManager {
    
    static let shared = ChatRealmManager()
    
    var chatRealms: [String: ChatRealm] = [String: ChatRealm]()
    var friendUid: String?
    
    var chatRealm: ChatRealm? {
        if  let friendUid = self.friendUid,
            let chatRealm = self.chatRealms[friendUid] {
            return chatRealm
        }
        return nil
    }

    private init() {
    }
    
    deinit {
    }
    
    func setCurrentChat(friendUid: String, onCompletion completion: @escaping (Error?) -> Void) {
        self.friendUid = friendUid
        if let _ = self.chatRealms[friendUid] {
            completion(nil)
        } else {
            let chatRealm = ChatRealm(friendUid: friendUid)
            self.chatRealms[friendUid] = chatRealm
            chatRealm.initRealm { error in
                completion(error)
            }
            
        }
    }
    
    func cleanup() {
        self.friendUid = nil
    }
    
    
}
