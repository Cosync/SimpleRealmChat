//
//  UserView.swift
//  SimpleRealmChat
//
//  Created by Richard Krueger on 10/11/20.
//

import SwiftUI

struct UserInfo : Identifiable{
    var id = ""
    var name: String
}

struct UserRow: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var connectionState: ConnectionState
    @EnvironmentObject var chatEntryState: ChatEntryState
    var user: UserInfo
    var body: some View {
        HStack {
            Text("\(user.name)").foregroundColor(.primary)
            Spacer()
            Button(action: {
                
                let uid = RealmManager.shared.currentUserId!
                
                if (connectionState.connection(friendUid: self.user.id) == nil) {
                
                    let user = RealmManager.shared.app.currentUser!
                    user.functions.updateChatPartitions([.string(uid), .string(self.user.id)]) { chatPartition, error in
                        guard error == nil else {
                            print("Function call failed: \(error!.localizedDescription)")
                            return
                        }
                        guard case let .string(value) = chatPartition else {
                            print("Unexpected non-string result: \(chatPartition ?? "nil")");
                            return
                        }
                        print("Called function 'sum' and got result: \(value)")
                        
                        DispatchQueue.main.async {
                            let connection = Connection(uid: uid, friendUid: self.user.id)
                            try! RealmManager.shared.userRealm.write {

                                RealmManager.shared.userRealm.add(connection)
                            }
                            
                            if  let user = RealmManager.shared.app.currentUser {
                                
                                user.refreshCustomData() { (customData, error) in
                                    if error == nil {
                                        
                                        ChatRealmManager.shared.setCurrentChat(friendUid: self.user.id) { error in
                                            self.chatEntryState.setup()
                                            self.appState.target = .chat
                                        }
                                        
                                    }

                                }
                            }
                        }
                    }
                } else {
                    if  let user = RealmManager.shared.app.currentUser {
                        
                        user.refreshCustomData() { (customData, error) in
                            if error == nil {
                                DispatchQueue.main.async {
                                    ChatRealmManager.shared.setCurrentChat(friendUid: self.user.id) { error in
                                        self.chatEntryState.setup()
                                        self.appState.target = .chat
                                    }
                                }
                            }

                        }
                    }
                }
                

                
            }) {
                Image(systemName: "arrowtriangle.right")
                    .foregroundColor(.secondary)
                    .font(.caption)
            }
        }
        
    }
}



struct UserView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userPrivateDataState: UserPrivateDataState
    @EnvironmentObject var userProfileState: UserProfileState
    @EnvironmentObject var chatEntryState: ChatEntryState
    @EnvironmentObject var connectionState: ConnectionState

    @State var searchText = ""

    @State private var showCancelButton: Bool = false
    
    func delete(at indexes: IndexSet) {
        
    }
    
    var body: some View {
   
        NavigationView {

            VStack {
                // Search view
                HStack {
                    HStack {
                        //search bar magnifying glass image
                        Image(systemName: "magnifyingglass").foregroundColor(.secondary)

                        //search bar text field
                        TextField("search", text: self.$searchText, onEditingChanged: { isEditing in
                            self.showCancelButton = true
                        })
                        .onChange(of: searchText) { newValue in
                            userProfileState.searchText = newValue
                        }

                        // x Button
                        Button(action: {
                            self.searchText = ""
                            userProfileState.searchText = ""
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                                .opacity(self.searchText == "" ? 0 : 1)
                        }
                    }
                    .padding(8)
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)

                    // Cancel Button
                    if self.showCancelButton  {
                        Button("Cancel") {
                            UIApplication.shared.endEditing(true)
                            userProfileState.searchText = ""
                            self.searchText = ""
                            self.showCancelButton = false
                        }
                    }
                }
                .padding([.leading, .trailing,.top])
                .padding(.bottom, 1)

                // Users
                List {

                    ForEach(0..<self.userProfileState.countFiltered, id: \.self) { index in

                        UserRow(user: UserInfo(id: self.userProfileState.userProfileUid(index),
                                               name: self.userProfileState.userProfileName(index)))
                    }
                    .onDelete(perform: delete)

                }
                .listStyle(PlainListStyle())

            }

            // Use .inline for the smaller nav bar
            .navigationBarTitle(Text(self.userPrivateDataState.name), displayMode: .inline)
            .navigationBarItems(
                    // Button on the leading side
                    leading:
                    Button(action: {
                        userProfileState.searchText = ""
                        RealmManager.shared.logout( onCompletion: { (error) in
                                DispatchQueue.main.sync {
                                    self.appState.target = .login
                                    self.userProfileState.cleanup()
                                    self.userPrivateDataState.cleanup()
                                    self.connectionState.cleanup()
                                }
                            }
                        )
                    }) {
                        Text("Logout")
                    }.accentColor(.blue)
            )
            .edgesIgnoringSafeArea(.bottom)
        }
        .onAppear {
            userProfileState.searchText = ""
            self.searchText = ""
            self.showCancelButton = false
        }
    }

}

struct UserView_Previews: PreviewProvider {
    static var previews: some View {
        UserView()
    }
}
