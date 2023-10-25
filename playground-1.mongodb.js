

/* global use, db,  */
use("chatApp");

// creacion de la coleccion con una validacion

// db.createCollection("messages",{
// 	validator:{
// 		$jsonSchema: {
// 			bsonType: "object",
// 			required: ["content"],
// 			properties: {
// 				content: {
// 					bsonType: "string",
// 					description: "no hay contenido"
// 				}
// 			}
// 		}
// 	}
// });

db.getCollection("messages")
	.deleteMany({});
	