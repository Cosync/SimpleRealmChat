//
//  ChatEntryState.swift
//  SuperSimpleChat
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


// Global state observable used to trigger routing
class ChatEntryState: ObservableObject {
    @Published var chatEntries: Results<ChatEntry>?
    @Published var count = 0

    private var notificationToken: NotificationToken! = nil
    
    func setup() -> Void {
        
        if let chatRealm = ChatRealmManager.shared.chatRealm {
            let results = chatRealm.realm.objects(ChatEntry.self).sorted(byKeyPath: "createdAt", ascending: false)
            
            self.notificationToken = results.observe { (changes: RealmCollectionChange) in
        
                switch changes {
                case .initial:
                    self.chatEntries = results
                    self.count = results.count
                    
                case .update(let results, _, _, _):
                     self.chatEntries = results
                    self.count = results.count
                    
                case .error(let error):
                    // An error occurred while opening the Realm file on the background worker thread
                    fatalError("\(error)")
                }
            }
        }

    }
    
    func chatEntryText(_ index: Int) -> String {
        if let text = self.chatEntries?[index].text {
            return text
        }
        return ""
    }
    
    func chatEntryName(_ index: Int) -> String {
        if let name = self.chatEntries?[index].name {
            return name
        }
        return ""
    }
    
    func cleanup() -> Void {
        self.notificationToken.invalidate()
        self.notificationToken = nil
    }
}
