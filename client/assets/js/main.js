/* eslint-disable no-undef */
// en vanilla js podemos importar una dependencia externa
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const getUsername = async () => {
	// recuperamos el username si esta en el localStorage
	const username = localStorage.getItem("username");
	if (username) {
		console.log(`User existed ${username}`);
		return username;
	}else{
		const res = await fetch("https://random-data-api.com/api/v2/users");
		// recuperamos username y la guardamos en randomUsername
		const {username } = await res.json();
		localStorage.setItem("username", username);
      
		return username;
	}
};
  

//ahora creamos el socket con io
// podemos crearlo con auth, lo cual agrega cierta información a todos los mensajes
  
const socket = io({
	auth:{
		// por defecto es 0, es para controlar en donde se ha 
		// quedado el chat del usuario
		serverOffset: 0,
		username: await getUsername()
	}
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

 

// para emitir los mensajes
form.addEventListener("submit", (e) => {
	e.preventDefault();
	// si tenemos un valor en el input
	if (input.value) {
		// enviamos el valor del input
		socket.emit("chat message", input.value);  //-> no me queda claro como obtengo acceso a username, creo que es por el socket.emit
		// reseteamos el valor 
		input.value = "";
	}
});

// para recibir los mensajes
socket.on("chat message", (msg, serverOffset, username) => {
	const item = 
    `<li>
      <p>
        <small>${username} </small>
         : ${msg}
      </p>
    </li>`;
	messages.insertAdjacentHTML("beforeend", item);
	//actualizamos el serverOffset
	socket.auth.serverOffset = serverOffset;
	// scroll to bottom of messages
	messages.scrollTop = messages.scrollHeight;
   
});
