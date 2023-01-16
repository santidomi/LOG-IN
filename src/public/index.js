const socketClient = io();

//Agregar un producto
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const name = document.getElementById("productName").value;
	const price = document.getElementById("productPrice").value;
	const thumbnail = document.getElementById("productThumbnail").value;

	const product = {
		name: name,
		price: price,
		thumbnail: thumbnail,
	};

	socketClient.emit("newProduct", product);
	productForm.reset();
});

const createTable = async (data) => {
	const response = await fetch("./template/productDiv.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template({ products: data });
	return html;
};

const productsContainer = document.getElementById("productsContainer");
socketClient.on("products", async (data) => {
	console.log(data);
	productsContainer.innerHTML = "";
	const htmlTable = await createTable(data);
	productsContainer.innerHTML = htmlTable;
});

//Esquemas normalizr
const authorSchema = new normalizr.schema.Entity(
	"authors",
	{},
	{ idAttribute: "email" }
);
const messageSchema = new normalizr.schema.Entity("messages", {
	author: authorSchema,
});
const chatSchema = new normalizr.schema.Entity("chats", {
	messages: [messageSchema],
});

//Chat en vivo
socketClient.on("messages", async (data) => {
	console.log(data);
	const denormalizedData = await normalizr.denormalize(
		data.result,
		chatSchema,
		data.entities
	);
	let messageElements = "";
	denormalizedData.messages.forEach((msg) => {
		messageElements += `<div><strong class="red">${msg.author.id} </strong>-<strong class="green"> ${msg.timestamp}:</strong> ${msg.text}</div>`;
	});
	const chatContainer = document.getElementById("chatContainer");
	chatContainer.innerHTML =
		denormalizedData.messages.length > 0 ? messageElements : "";
});

//Envio de mensaje
const chatForm = document.getElementById("chatForm");
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = document.getElementById("chatEmail").value;
	const name = document.getElementById("chatName").value;
	const lastName = document.getElementById("chatLastName").value;
	const alias = document.getElementById("chatAlias").value;
	let text = document.getElementById("chatText").value;

	const message = {
		author: {
			id: email,
			email: email,
			nombre: name,
			apellido: lastName,
			alias: alias,
		},
		text: text,
	};

	socketClient.emit("newMessage", message);
	text = "";
});

/* onsole.log("Funcionando");
// Ejecutando socket del lado del cliente.
const socketClient = io();

//Logged in variable
let login = false;

const form = document.getElementById("form");
const productNameInput = document.getElementById("productNameInput");
const productPriceInput = document.getElementById("productPriceInput");
const productThumbnailInput = document.getElementById("productThumbnailInput");

const addProduct = (e) => {
	e.preventDefault();
	const product = {
		name: productNameInput.value,
		thumbnail: productThumbnailInput.value,
		price: productPriceInput.value,
	};
	socketClient.emit("newProduct", product);
};
form.addEventListener("submit", addProduct);

socketClient.on("productos", (data) => {
	console.log(data);
	const productsContainer = document.getElementById("productsContainer");
	productsContainer.innerHTML = "";
	data.forEach((el) => {
		const div = document.createElement("div");
		div.classList.add("product");
		div.innerHTML = `
            <p class="productInfo">${el.name}</p>
            <p class="productInfo">$${el.price}</p>
            <div class="productImgContainer">
            <img class="productImg" src=${el.thumbnail}>
            
            </div>
            <hr class="line" />
		`;
		productsContainer.appendChild(div);
	});
});
 */
/* Chat  part */
/* 
const chatForm = document.getElementById("chatForm");
const inputChatEmail = document.getElementById("inputChatEmail");
const inputChatText = document.getElementById("inputChatText");
const inputNombre = document.getElementById("inputChatNombre");
const inputEdad = document.getElementById("inputChatEdad");

const inputApellido = document.getElementById("inputApellido");
const inputAlias = document.getElementById("inputAlias");
console.log(chatForm);

const addMessage = (e) => {
	e.preventDefault();
	let email = inputChatEmail.value;
	let text = inputChatText.value;
	let nombre = inputNombre.value;
	let apellido = inputApellido.value;
	let edad = inputEdad.value;
	let alias = inputAlias.value;
	const message = {
		author: {
			id: email,
			email: email,
			nombre: nombre,
			apellido: apellido,
			edad: edad,
			alias: alias,
		},
		text: text,
	};
	socketClient.emit("newMessage", message);
	inputChatText.value = "";
	return false;
};

chatForm.addEventListener("submit", addMessage);

const authorSchema = new normalizr.schema.Entity(
	"authors",
	{},
	{ idAttribute: "email" }
); //id:con el valor del campo email.
const messageSchema = new normalizr.schema.Entity("messages", {
	author: authorSchema,
});
//esquema global o padre
const chatSchema = new normalizr.schema.Entity("chats", {
	messages: [messageSchema],
});

socketClient.on("messages", async (data) => {
	let messagesData = await normalizr.denormalize(
		data.result,
		chatSchema,
		data.entities
	);
	console.log(messagesData.messages);
	const mensajes = document.getElementById("mensajes");

	mensajes.innerHTML = "";
	messagesData?.messages?.forEach((el) => {
		const div = document.createElement("div");
		div.classList.add("message");
		div.innerHTML = `
            <div class="left">
                <p class="bold">${el.author.id}</p>
                <p class="italic">[${el.author.alias}] :</p>
            </div>
            <p class="text">${el.text}</p>
		`;
		mensajes.appendChild(div);
	});
});

socketClient.on("login", async (data) => {
	console.log(data);
	let loginFormComponent = document.getElementById("loginForm");
	const loggedInMessage = document.getElementById("loggedInMessage");
	const loggedInComponent = document.getElementById("loggedInComponent");
	if (data) {
		loginFormComponent.classList.add("hidden");
		loggedInComponent.classList.remove("hidden");
		loggedInMessage.innerText = data;
		loggedInComponent.classList.add("visible");
	} else {
		loginFormComponent.classList.remove("hidden");
	}
});
 */
