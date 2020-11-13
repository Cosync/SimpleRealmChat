# SimpleRealmChat

## Instalation
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


## Partition Strategy

### User Partition

Each user has a private partition where the partition value is the user-id of the user. Only the user can readwrite to the user partition

```
{ "%%user.id": "%%partition" }
```

### Shared Partition

There is a common shared partition called "shared". All users have read permission on the shared partition, but cannot write to it.

```
{ "shared": "%%partition" }
```

### Chat Partitions

If two users (uid1 and uid2) are chatting, the chat entires are stored in a chat partition uid1_uid2 where uid1 < uid2.

## Custom Data

Enable Custom Data for the application under the `Custom User Data` tab of `App Users` in the MongoDB Realm portal. First create a Custom User database and Custom User collection in Atlas.

* CustomUserDB (data base name)
* CustomUserData (collection name)

After the database and collection are created, then enable custom data for the Application in the MongoDB Realm portal.
Make sure that you choose `userId` as the User ID field. 

In the `Rules` section DO NOT configure the `CustomUserData` collection by choosing a Permissions Template. If no rule exists for the namespace `CustomUserDB.CustomUserData`, the collection will not be writable from within the client application. This is what you want, so that no client can spoof the Custom Data and potentially violate security. This way, the Custom Data is readable by the client but no more than that. The backend server function `onUpdateConnection` will take care of writing to the Custom Data collection. 

## Sync Rules

For the read sync rules you want to use the following

```
{
  "$or": [
    {
      "%%user.id": "%%partition"
    },
    {
      "%%partition": "shared"
    },
    {
      "%%user.custom_data.chatPartitions": "%%partition"
    }
  ]
}
```
For the write sync rules you want to use the following

```
{
  "$or": [
    {
      "%%user.id": "%%partition"
    },
    {
      "%%user.custom_data.chatPartitions": "%%partition"
    }
  ]
}
```

## Functions

### updateChatPartitions

Name: updateChatPartitions
Authentication: System

Note: the Authentication has to run as a system user otherwise custom user data cannot be written to.

```javascript
exports = async function(currentUserId, friendUserId) {
  
  const mongodb = context.services.get("mongodb-atlas");
  const users = mongodb.db("CustomUserDB").collection("CustomUserData");
  let user = await users.findOne({userId: currentUserId});
  let friendUser = await users.findOne({userId: friendUserId});
  
  var chatPartition = currentUserId + "_" + friendUserId;
  if (currentUserId > friendUserId) {
      chatPartition = friendUserId + "_" + currentUserId;
  }
        
  var userChatPartitions = { "$push": {
      "chatPartitions": chatPartition
      }
  };       
  users.updateOne({_id: user._id}, userChatPartitions, {upsert: false});      

  var friendUserChatPartitions = { "$push": {
      "chatPartitions" : chatPartition
      }
  };
  users.updateOne({_id: friendUser._id}, friendUserChatPartitions, {upsert: false});
  
  return chatPartition;
};
```

## Triggers

### signupTrigger 

`Trigger Type`: Authentication
`Name`: signupTrigger
`Action Type`: Create
`Provider(s)`: Email/Password
`Select an Event Type`: Function
`Function`: signupTrigger

```javascript
exports = function(authEvent) {
   
  const user = authEvent.user
  console.log("authEvent.user ", JSON.stringify(user)); 
  
  const mongodb = context.services.get("mongodb-atlas");
  const users = mongodb.db("CustomUserDB").collection("CustomUserData");
  
  var newUser = { userId: user.id, chatPartitions: []};
  users.updateOne({userId: user.id}, newUser, {upsert: true});
};
```

### onUpdateUserPrivateData

`Trigger Type`: Database
`Name`: onUpdateUserPrivateData
`Cluster Name`: mongodb-atlas
`Database Name`: SimpleRealmChatDB
`Collection Name`: UserPrivateData
`Operation Type`: Insert and Replace
`Function`: onUpdateUserPrivateData

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

### onUpdateConnection

`Trigger Type`: Database
`Name`: onUpdateUserPrivateData
`Cluster Name`: mongodb-atlas
`Database Name`: SimpleRealmChatDB
`Collection Name`: Connection
`Operation Type`: Insert and Replace
`Function`: onUpdateConnection

```javascript
exports = function(changeEvent) {
    console.log("changeEvent.fullDocument ", JSON.stringify(changeEvent.fullDocument)); 
  
    const mongodb = context.services.get("mongodb-atlas");
    const connections = mongodb.db("SimpleRealmChatDB").collection("Connection");
    
    if (!changeEvent.fullDocument.active) {
      
        let currentUserId = changeEvent.fullDocument._partition;
        let friendUserId = changeEvent.fullDocument.friendUid;

        var friendConnection = { "_id": new BSON.ObjectId(),
            "_partition": friendUserId,
            "friendUid": currentUserId,
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

