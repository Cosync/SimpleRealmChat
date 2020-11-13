 

exports.ChatEntry = {
    "name":"ChatEntry",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string", 
        "name":{ "type": "string", "indexed": true }, 
        "text":{ "type": "string", "indexed": true }, 
        "createdAt": {  "type": "date" , "optional": true , "indexed": true }
    }
}; 



exports.UserProfile = {
    "name":"UserProfile",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string",  
        "name":{ "type": "string", "indexed": true }, 
        "createdAt": {  "type": "date" , "optional": true , "indexed": true }
    }
}; 



exports.UserPrivateData = {
    "name":"UserPrivateData",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string",  
        "email":{ "type": "string", "indexed": true }, 
        "name":{ "type": "string", "indexed": true }, 
        "createdAt": {  "type": "date" , "optional": true , "indexed": true }
    }
}; 


exports.Connection = {
    "name":"Connection",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string",  
        "friendUid":{ "type": "string", "indexed": true }, 
        "status":{ "type": "string", "indexed": true }, 
        "createdAt": {  "type": "date" , "optional": true , "indexed": true }
    }
}; 

  