import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import "dotenv/config.js";
const uri =  process.env.MONGO_URI;

// create a mongoClient
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});



async function connect() {
	try {
		// connect the client to the server
		await client.connect();

		// seleccionamos la base de datos
		const database = client.db("chatApp");
		// seleccionamos la coleccion
		const collection = database.collection("messages");

		return collection;
	

	}catch (e){
		console.error("error to connect: " + e);
	}
	
}

export class dbModel {

	static async testConnection(){
		return connect();
	}

	static async createMessage ({input, username}){
	
		const db = await connect();

		const resultado = await db.insertOne({
			username: username,
			content: input,
			timeStamp: new Date()
		});
		
		console.log("documento insertado con el id: " + resultado.insertedId );
		return resultado;
	}

	static async recoveryDesconectionMessages({id}){
		const db = await connect();
	

		// si el id es 0, quiere decir que no tenemos ningun mensaje,
		// así que los recuperamos todos
		if(id === 0){
			const results = await db.find({}).toArray();
			return results;
		}

		// parseamos el id a objectId para poder hacer la busqueda
		const objectIdToSearch = new ObjectId(id);
		// recuperamos el documento mediante el id
		const result = await db.findOne({_id: objectIdToSearch});
		
		// si no recuperamos nada salimos
		if(!result){
			console.log("documento no encontrado by id");
			return;
		}

		// buscamos los documentos que tengan una fecha posterior al documento 
		// encontrado en la anterior busqueda y la parseamos a un array
		const results = await db.find({
			timeStamp: { $gte: result.timeStamp }
		}).toArray();
	
		

		return results;
	}

	


}




