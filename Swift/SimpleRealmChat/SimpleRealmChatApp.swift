//
//  SimpleRealmChatApp.swift
//  SimpleRealmChat
//
//  Created by Richard Krueger on 10/5/20.
//

import SwiftUI

@main
struct SimpleRealmChatApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(AppState())
                .environmentObject(UserPrivateDataState())
                .environmentObject(UserProfileState())
                .environmentObject(ChatEntryState())
                .environmentObject(ConnectionState())
        }
    }
}
