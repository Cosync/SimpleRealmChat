 

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



exports.UserData = {
    "name":"UserData",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string", 
        "uid":{ "type": "string", "indexed": true }, 
        "name":{ "type": "string", "indexed": true }, 
        "createdAt": {  "type": "date" , "optional": true , "indexed": true }
    }
}; 

  