//
//  UserProfileState.swift
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


// Global state observable used to trigger routing
class UserProfileState: ObservableObject {
    @Published var userProfiles: Results<UserProfile>?
    @Published var count = 0
    @Published var searchText = "" {
        didSet {
            self.computeFiltered()
        }
    }
    
    @Published var userProfilesFiltered: Results<UserProfile>?
    @Published var countFiltered = 0
    
    func computeFiltered() {
        if searchText.count > 0 {
            self.userProfilesFiltered = self.userProfiles?.filter("name CONTAINS[cd] '\(self.searchText)'")
            if let count = self.userProfilesFiltered?.count {
                self.countFiltered = count
            } else {
                self.countFiltered = 0
            }
        } else {
            self.userProfilesFiltered = self.userProfiles
            self.countFiltered = self.count
        }
    }

    private var notificationToken: NotificationToken! = nil
    
    func setup() -> Void {
        let uid = RealmManager.shared.currentUserId!
        let results = RealmManager.shared.sharedRealm.objects(UserProfile.self)
            .filter("_id != '\(uid)'")
            .sorted(byKeyPath: "name", ascending: true)
        
        self.notificationToken = results.observe { (changes: RealmCollectionChange) in
    
            switch changes {
            case .initial:
                self.userProfiles = results
                self.count = results.count
                self.computeFiltered()
                
            case .update(let results, _, _, _):
                self.userProfiles = results
                self.count = results.count
                self.computeFiltered()
                
            case .error(let error):
                // An error occurred while opening the Realm file on the background worker thread
                fatalError("\(error)")
            }
        }
        
    }
    
    func userProfileName(_ index: Int) -> String {
        if let name = self.userProfilesFiltered?[index].name {
            return name
        }
        return ""
    }
    
    func userProfileUid(_ index: Int) -> String {
        if let id = self.userProfilesFiltered?[index]._id {
            return id
        }
        return ""
    }
    
    func cleanup() -> Void {
        self.notificationToken.invalidate()
        self.notificationToken = nil
    }
}
