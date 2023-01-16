import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import path from "path";
import { Server } from "socket.io";
import { Contenedor } from "./clase-contenedor/clase.js";
import { fileURLToPath } from "url";
import { chatSchema } from "./clase-contenedor/normalizeSchema/index.js";
import { normalize } from "normalizr";
import { DbConfig } from "./db/dbConfig.js";

import { productRouter } from "./routes/products.js";
import { clientRouter } from "./routes/client.js";
import { loginRouter } from "./routes/login.js";
import { productSocket } from "./routes/productSocket.js";
import { chatSocket } from "./routes/chatSocket.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
export const productContainer = new Contenedor();

//Configuracion template engine handlebars
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", __dirname + "/views");
app.set("view engine", ".hbs");

// APP USES
app.use(cookieParser());

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: DbConfig.mongoAtlas.url,
			ttl: 600,
		}),
		secret: "sessionSecreta",
		resave: false,
		saveUninitialized: false,
	})
);

// Server routes
app.use("/api/productos", productRouter);
app.use(clientRouter);
app.use(loginRouter);

const server = app.listen(8080, () => {
	console.log("Server listening on port 8080");
	productContainer.getProducts();
});

// Creación servidor websocker
const io = new Server(server);

io.on("connection", async (socket) => {
	console.log("Nuevo cliente conectado");

	productSocket(socket, io.sockets);
	chatSocket(socket, io.sockets);
});
/* 
app.get("/home", (req, res) => {
	if (req.session.username) {
		productContainer.logged = true;
	}
	console.log("home");
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/", (req, res) => {
	if (req.session.username) {
		productContainer.logged = req.session.username;
		res.sendFile(path.join(__dirname + "/public/index.html"));
	} else {
		res.redirect("/login");
	}
	res.render("home"); // Primer parametro: Nombre de la vista a mostrart
});

app.post("/login", (req, res) => {
	const { name } = req.body;
	if (name != "") {
		req.session.username = name;
		productContainer.logged = req.session.username;
		res.redirect("/");
	} else {
		res.send("Credenciales no validas");
	}
});

app.get("/login", (req, res) => {
	res.sendFile(pathfILE);
});

//funciones que normaliza datos
const normalizeData = (data) => {
	const normalizedData = normalize(
		{ id: "chatHistory", messages: data },
		chatSchema
	);
	return normalizedData;
};
export const normalizeMessages = async () => {
	const messages = await productContainer.getMessages();
	const normalizedMessages = normalizeData(messages);
	return normalizedMessages;
};

io.on("connection", async (socket) => {
	console.log("Nuevo cliente conectado");
	//PRODUCTOS

	//envio de productos al conectarse
	socket.emit("productos", productContainer.productos);

	//Agregado de producto y envio de productos actualizados
	socket.on("newProduct", async (data) => {
		const message = await productContainer.addProduct(data);
		await productContainer.getProducts();
		setTimeout(() => {
			io.sockets.emit("productos", productContainer.productos);
		}, 1000);
	});

	//CHAT

	//Envio de mensajes normalizados
	socket.emit("messages", await normalizeMessages());

	//Agregado de mensaje y envio de mensajes actualizados y normalizads
	socket.on("newMessage", async (data) => {
		productContainer.addMessage(data);
		io.sockets.emit("messages", await normalizeMessages());
	});

	//LOGIN
	socket.emit("login", productContainer.logged);
});

/*
LINK FOTO PARA HACER MAS RAPIDO

https://i.postimg.cc/76b2Ld3b/coca-cola.png

*/
