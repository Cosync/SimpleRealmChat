//
//  AlertExtension.swift
//  SimpleRealmChat
//
//  Created by Richard Krueger on 11/7/20.
//

import SwiftUI

// Alert modal helper

extension Alert {
    
    init(_ message: AlertMessage) {
        self.init(
            title: Text(message.title),
            message: Text(message.message),
            dismissButton: .default(Text("OK"), action: {
                if (message.target != .login) {
                    message.state.target = message.target
                }
                return;
            })
        )
    }
}
