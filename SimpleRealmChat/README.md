# SimpleRealmChat
Super Simple Chat app for MongoDB Realm

On the MongoDB Atlas side

* Create a Free Atlas Cluster. Under 'Additional Settings' select version 'MongoDB 4.4 - Beta'
* Name new Atlas Cluster SimpleRealmChat
* Hit Create Cluster

Once the cluster has been created, select the Realm tab 

* Select Create a New App
* Select Mobile, iOS, No I'm starting from Scratch as your options
* Hit 'Start a new Realm App'
* Name the new Realm App 'SimpleRealmChat'
* Link it to the SimpleRealmChat cluster created above (default choice)
* Hit Create Realm Application

Set up Sync in Dev Mode

* Select Cluster to Sync 'SimpleRealmChat'
* Define a Database called 'SimpleRealmChatDB'
* Create a partition key called '_partition' as a string
* Hit 'Turn Dev Mode On'

Set up user provider 

* In the Realm app go to the User tab
* Select the Providers tab
* Select Email/Password
* Toggle the Provider Enable control to on
* Select 'Automatically confirm users' as User Confirmation Method.
* Select 'Run a password reset function' as the Password Reset Method
* Select 'New function' in function
* Select the default name 'resetFunc' 
* Hit 'Save'

Deploy the Realm App

* Hit 'REVIEW & DEPLOY'

XCode Project

* Download the source code from Github
* Set up pods by typing 'pod install' at the command line
* Open generated workspace file
* Set the Realm id in Models.swift
* Copy the Realm id from the top left button in the Realm panel in the web UI
* Edit the REALM_APP_ID in the Constants.swift function with the copied Realm Id

Run the app


Functions

onUpdateUserPrivateData

```javascript
exports = function(changeEvent) {
    console.log("Got here man");
    console.log("changeEvent.fullDocument ", JSON.stringify(changeEvent.fullDocument)); 
  
    const mongodb = context.services.get("mongodb-atlas");
    const userProfiles = mongodb.db("SimpleRealmChatDB").collection("UserProfile");
  
    var newProfile = { "_id": changeEvent.fullDocument._id,
        "_partition": "shared",
        "name": changeEvent.fullDocument.name
    };

    userProfiles.updateOne({_id: changeEvent.fullDocument._id}, newProfile, {upsert: true});

};
```

onUpdateConnection

```javascript
exports = function(changeEvent) {
    console.log("changeEvent.fullDocument ", JSON.stringify(changeEvent.fullDocument)); 
  
    const mongodb = context.services.get("mongodb-atlas");
    const connections = mongodb.db("SimpleRealmChatDB").collection("Connection");
    
    if (!changeEvent.fullDocument.active) {
    
        console.log("Got here");
        var friendConnection = { "_id": new BSON.ObjectId(),
            "_partition": changeEvent.fullDocument.friendUid,
            "friendUid": changeEvent.fullDocument._partition,
            "active": true
        };
        
        var connection = { "$set": {
            "active" : true
            }
        };
    
        connections.updateOne({_id: friendConnection._id}, friendConnection, {upsert: true});
        
        connections.updateOne({_id: changeEvent.fullDocument._id}, connection, {upsert: false});
    }

};
```
