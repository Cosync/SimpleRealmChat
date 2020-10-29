//
//  UIAppExtension.swift
//  SimpleRealmChat
//
//  Created by Richard Krueger on 10/21/20.
//

import Foundation
import UIKit

extension UIApplication {
    func endEditing(_ force: Bool) {
        self.windows
            .filter{$0.isKeyWindow}
            .first?
            .endEditing(force)
    }
}
