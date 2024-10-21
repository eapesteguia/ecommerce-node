import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import ProductManager from "./services/ProductManager.js";
import { Server } from "socket.io";

// config express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// HTML estático
app.use(express.static(__dirname + "/public/"));

// middlewares de rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// telemetría
app.use("/ping", (req, res) => {
  res.send("pong");
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server escuchando en el puerto ${PORT}`);
});

// nueva instancia de socket.io del lado del server
const socketServer = new Server(httpServer);

// llamo a la clase para poder levantar la lista de productos
const productManager = new ProductManager();

socketServer.on("connection", (socket) => {
  console.log("Cliente socket conectado!");

  // levanto y mando la lista actual de productos al cliente
  const products = productManager.getAllProducts();
  socket.emit("updateProducts", products);
});
